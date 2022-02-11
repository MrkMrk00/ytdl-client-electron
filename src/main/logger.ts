import { createLogger, format, transports } from 'winston'
const { combine, timestamp, label, printf } = format
import chalk from 'chalk'

const colorize = (level: string) => {
    switch (level) {
    case 'debug':
        return chalk.bold.blue(level.toUpperCase())
    case 'error':
        return chalk.bold.whiteBright.bgRed(level.toUpperCase())
    default:
        return chalk.bold.white(level.toUpperCase())
    }
}

const loggerFormat = printf(({ level, message, label, timestamp }) => {
    return `${chalk.bold(`${timestamp} [${label}]`)} ${colorize(level)}: ${
        level === 'error' ? chalk.bold.red(message) : message
    }`
})

const instantiateLogger = (fileName: string) => {
    return createLogger({
        level: 'debug',
        format: combine(
            timestamp({ format: 'HH:mm:ss' }),
            label({ label: fileName }),
            loggerFormat
        ),
        transports: [new transports.Console()],
    })
}

export default instantiateLogger
