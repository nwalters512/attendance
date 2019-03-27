const winston = require('winston')
const chalk = require('chalk')

const { format } = winston

const outputFormat = format.printf(info => {
  const timestamp = chalk.bold(`[${info.timestamp}]`)
  const level = chalk.bold(info.level)
  let message = `${timestamp} ${level}: ${info.message}`
  if (info.stack) {
    message += `\n${info.stack}`
  }
  return message
})

const logger = winston.createLogger({
  level: 'info',
  format: format.combine(
    format.errors({ stack: true }),
    format.colorize(),
    format.timestamp(),
    outputFormat
  ),
  transports: [new winston.transports.Console()],
})

module.exports = logger
