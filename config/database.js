const mongoose = require("mongoose");
const logger = require("../utils/logger");

const connectDB = async () => {
	try {
		// Check if the MONGO_URI is provided
		if (!process.env.MONGO_URI) {
			logger.error("MONGO_URI is not defined in the environment.");
			process.exit(1);
		}

		// Mongoose settings to handle deprecation warnings
		mongoose.set("strictQuery", true);

		// Connect to the database
		await mongoose.connect(process.env.MONGO_URI);

		logger.info("Connected to the Database");

		// If the Node process ends, close the Mongoose connection
		process.on("SIGINT", () => {
			mongoose.connection.close(() => {
				logger.info(
					"Database connection disconnected through app termination"
				);
				process.exit(0);
			});
		});
	} catch (error) {
		logger.error(`Database Connection Error : ${error.message}`);
		// Exit process with failure
		process.exit(1);
	}
};

module.exports = connectDB;