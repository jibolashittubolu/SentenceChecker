/* eslint-disable @typescript-eslint/no-explicit-any */
import winston from "winston";
import { isDevEnvironment } from "../basicFunctions";

const customLevels = {
  levels: {
    trace: 5,
    debug: 4,
    info: 3,
    warn: 2,
    error: 1,
    fatal: 0,
  },

  colors: {
    trace: "white",
    debug: "blue",
    info: "green",
    warn: "yellow",
    error: "red",
    fatal: "magenta",
  },
};

const formatter = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.splat(),
  winston.format.printf((info) => {
    const {
      timestamp, level, message, ...meta
    } = info;

    return `${timestamp} [${level}]: ${message} ${
      Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ""
    }`;
  }),
);

class Logger {
  private logger: winston.Logger;

  constructor() {
    const prodTransport = new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    });

    const transport = new winston.transports.Console({
      format: formatter,
    });

    this.logger = winston.createLogger({
      level: isDevEnvironment() ? "trace" : "error",
      levels: customLevels.levels,
      transports: [isDevEnvironment() ? transport : prodTransport],
    });

    winston.addColors(customLevels.colors);
  }

  async trace(msg: any, meta?: any) {
    this.logger.log("trace", msg, meta);
  }

  debug(msg: any, meta?: any) {
    this.logger.debug(msg, meta);
  }

  async info(msg: any, meta?: any) {
    this.logger.info(msg, meta);
  }

  async warn(msg: any, meta?: any) {
    this.logger.warn(msg, meta);
  }

  async error(msg: any, meta?: any) {
    this.logger.error(msg, meta);
  }

  async fatal(msg: any, meta?: any) {
    this.logger.log("fatal", msg, meta);
  }
}

const logger = new Logger();
export default logger;