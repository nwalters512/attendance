const winston = require('winston')

const { format } = winston

const outputFormat = format.printf(({ timestamp, level, message }) => {
  return `[${timestamp}] ${level}: ${message}`
})

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console({
      format: format.combine(
        format.colorize(),
        format.timestamp(),
        outputFormat
      ),
    }),
  ],
})

module.exports = logger
