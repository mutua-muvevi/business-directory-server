const { createLogger, format, transports } = require("winston");

// Step 1: Define the log format
const logFormat = format.combine(
	format.colorize(),
	format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
	format.align(),
	format.printf((info) => `${info.level}: ${info.timestamp}: ${info.message}`)
);

// Step 2: Set up different transport mechanisms
const consoleTransport = new transports.Console({
	format: logFormat,
	level: "info",
});

const fileTransport = new transports.File({
	filename: "logs/app.log",
	format: format.combine(
		format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
		format.printf(
			(info) => `${info.level}: ${info.timestamp}: ${info.message}`
		)
	),
	level: "info",
	handleExceptions: true,
});

// Step 3: Create a logger instance with the specified transports
const logger = createLogger({
	transports: [consoleTransport, fileTransport],
	exitOnError: false, // don't shut down on unhandled exceptions
});

module.exports = logger;