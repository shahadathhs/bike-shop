import { createLogger, format, transports } from 'winston'

// ** Logger Format **
const loggerFormat = format.combine(
  format.timestamp(),
  format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level}]: ${message}`
  })
)

// ** Logger Instance **
export const logger = createLogger({
  level: 'info', // * Default level
  format: loggerFormat,
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), format.simple())
    })
  ]
})
