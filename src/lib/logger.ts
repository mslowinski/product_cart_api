import { createLogger, format, transports } from 'winston';

const { combine, timestamp, label, prettyPrint, printf } = format;

export class CartAPILogger {
  public static format = printf(info => {
    return `[${info.timestamp}] [${info.level}]: ${info.message}`
  });

  public static logger = createLogger({
    level: process.env.NODE_ENV === 'test' ? 'error' : process.env.LOGGER_LEVEL,
    format: combine(label({ label: 'cart-api log'}),
      timestamp(),
      CartAPILogger.format
    ),
    transports: [
      new transports.File({ filename: 'logs.log'}),
      new transports.Console(),
    ],
  });
}
