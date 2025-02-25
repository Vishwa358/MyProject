import fs from "fs";
import winston from "winston";

const fsPromise = fs.promises;

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "request-logging" },
  transports: [new winston.transports.File({ filename: "log.txt" })],
});

// async function log(logData) {
//   try {
//     logData = `\n ${new Date().toString()} - ${logData}`;
//     await fsPromise.appendFile("log.txt", logData);
//   } catch (err) {
//     console.log(err);
//   }
// }

const loggerMiddleware = async (req, res, next) => {
  //1. Log request body.
  if (!req.url.includes("signIn")) {
    const logData = `${req.url}-${JSON.stringify(req.body)}`;
    // await log(logData);
    logger.info(logData);
  }
  next();
};

export default loggerMiddleware;
