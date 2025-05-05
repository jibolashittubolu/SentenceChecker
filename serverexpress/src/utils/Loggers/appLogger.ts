import winston from "winston";

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

const AppLogger = winston.createLogger({
  level: "trace",
  levels: customLevels.levels,
  transports: [new winston.transports.Console({ format: formatter }),],
});
winston.addColors(customLevels.colors);

export default AppLogger;
