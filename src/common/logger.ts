import { createLogger, transports, format, addColors } from 'winston'
import * as fs from 'fs'
import * as path from 'path'
const { combine, timestamp, json, prettyPrint, errors, colorize } = format

const logsDirectory = 'logs'

try {
    if (!fs.existsSync(logsDirectory)) {
        fs.mkdirSync(logsDirectory)
    }
} catch (err) {
    console.error(`Error creating logs directory: ${err.message}`)
    process.exit(1) // Exit the process if directory creation fails
}

const myCustomFormat = format.combine(colorize({ all: true }))
addColors({
    info: 'cyan',
    warn: 'yellow',
    error: 'red',
    debug: 'green',
})
const logger = createLogger({
    level: 'debug',
    format: combine(json(), prettyPrint(), timestamp()),
    transports: [
        new transports.Console({
            format: combine(myCustomFormat),
        }),
        new transports.File({
            filename: path.join(logsDirectory, 'error.log'),
            level: 'error',
            format: combine(
                errors({ stack: true }),
                json(),
                prettyPrint(),
                timestamp()
            ),
        }),
        new transports.File({
            filename: path.join(logsDirectory, 'combined.log'),
        }),
        new transports.File({
            filename: path.join(logsDirectory, 'debug.log'),
            level: 'debug',
            format: combine(json(), prettyPrint(), timestamp()),
        }),
        new transports.File({
            filename: path.join(logsDirectory, 'warn.log'),
            level: 'warn',
            format: combine(json(), prettyPrint(), timestamp()),
        }),
    ],
})

export default logger
