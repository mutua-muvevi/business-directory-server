const cluster = require("cluster");
const os = require("os");
const http = require("http");
const app = require("../index");
const logger = require("../utils/logger");

const numCPUs = os.cpus().length;

let lastRestartTime = Date.now();
let restartCount = 0;
const MAX_RESTARTS_IN_WINDOW = 5;
const RESTART_WINDOW = 5 * 60 * 1000; // 5 minutes


if (cluster.isMaster) {
	logger.info(`Master ${process.pid} is running`);

	// Fork workers for each core
	for (let i = 0; i < numCPUs; i++) {
		cluster.fork();
	}
	
	cluster.on("exit", (worker, code, signal) => {
		logger.error(
			`Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`
		);

		const now = Date.now();

		// Check if restart is within the window
		if (now - lastRestartTime < RESTART_WINDOW) {
			restartCount += 1;

			if (restartCount > MAX_RESTARTS_IN_WINDOW) {
				logger.error("Max restarts reached. Not starting a new worker.");

				return;
			}
		} else {
			restartCount = 0;
		}

		// Dynamic delay
		const dynamicDelay = parseInt(process.env.RESTART_DELAY) + restartCount * 1000;
		lastRestartTime = now;

		setTimeout(() => {
			logger.info("Starting a new worker");
			cluster.fork();
		}, dynamicDelay);
	});

} else {
	const server = http.createServer(app).listen(process.env.PORT, () => {
		logger.info(`Connected to port ${process.env.PORT} on Worker ${process.pid}`);
	});

	process.on("unhandledRejection", (error, promise) => {
		logger.error(`Unhandled Promise Rejection: ${error}`);
		shutdown(server);
	});

	process.on("uncaughtException", (error) => {
		logger.error(`Uncaught Exception: ${error}`);
		shutdown(server);
	});

	// Signal handling for graceful shutdown
	process.on("SIGTERM", () => {
		logger.info("SIGTERM received, shutting down gracefully");
		shutdown(server);
	});

	process.on("SIGINT", () => {
		logger.info("SIGINT received, shutting down gracefully");
		shutdown(server);
	});
}

const shutdown = (server) => {
	// Stop accepting new connections
	server.close(async () => {
		logger.info("Closed out remaining connections");

		// Close the database connections or other cleanup tasks here
		// e.g., await mongoose.connection.close();

		process.exit(0);
	});

	setTimeout(() => {
		logger.error(
			"Could not close connections in time, forcefully shutting down"
		);
		process.exit(1);
	}, 10000); // 10 seconds timeout
}
