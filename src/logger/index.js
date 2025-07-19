const winston = require("winston")
require("winston-daily-rotate-file")

const formatPrint = winston.format.printf(
    ({ level, message, context, requestId, timestamp, metadata }) => {
        return `${timestamp} :: ${level.toUpperCase()} :: ${context ?? 'SYS'} :: ${requestId ?? '-'} :: ${message} :: ${JSON.stringify(metadata)}`
    }
)

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        formatPrint
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.DailyRotateFile({
            dirname: "src/logs",
            filename: "application-%DATE%.info.log",
            datePattern: "YYYY-MM-DD-HH-mm",
            zippedArchive: true,
            maxSize: "20m",
            maxFiles: "14d",
            level: "info"
        }),
        new winston.transports.DailyRotateFile({
            dirname: "src/logs",
            filename: "application-%DATE%.error.log",
            datePattern: "YYYY-MM-DD-HH-mm",
            zippedArchive: true,
            maxSize: "20m",
            maxFiles: "14d",
            level: "error"
        })
    ]
})

module.exports = {
    info: (message, meta = {}) => logger.info(message, meta),
    error: (message, meta = {}) => logger.error(message, meta),
    warn: (message, meta = {}) => logger.warn(message, meta),
    debug: (message, meta = {}) => logger.debug(message, meta)
}
