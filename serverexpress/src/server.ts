import express, { Express, Request, Response , Application, NextFunction } from 'express';
import {config} from 'dotenv';
import cors from 'cors'
import helmet from "helmet";
import ComponentsRouter from './components/components.router';
import { logger } from "./utils";
import errorHandler from "./core/middlewares/errors.middleware";
import rateLimit from "express-rate-limit";

//For env File 
// dotenv.config();
config()

const PORT = process.env.PORT;
const app: Application = express();




// Handle all uncaught eceptions from the begining
process.on("uncaughtException", (err: Error) => {
  logger.debug(
    err.message,
    err
  );
  // console.log(err);
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  process.exit(err ? 1 : 0);
});
const allowedHosts = [
  "sentence-checker.jiboladev.com",
  "http://localhost:8002",
  "http://localhost:8001",
  "http://localhost:8003",
]
// Define allowed IP addresses
const allowedIps = ["89.116.52.114", "127.0.0.1", '::1', "::ffff:127.0.0.1"]; // Replace with the IP address of server1

// Middleware to validate the IP address
app.use((req: Request, res: Response, next: NextFunction) => {
  const clientIp = req?.headers?.['x-forwarded-for'] as string || req.ip || "";
  const requestHost = req?.headers?.['host'] as string || "";
  
  // console.log(req.ip)
  if (allowedIps.includes(clientIp)) {
    next(); // IP is allowed, proceed with the request
  }
  if(allowedHosts.includes(requestHost)){
    next()
  } 
  else {
    res.status(403).send('Forbidden: Access denied. Origin/Host');
  }
});

app.use(cors());
// app.use(express.json());
app.use(express.json({ limit: '10240kb' }));
app.use(express.urlencoded({ limit: '10240kb', extended: true }));

// // // parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }))

// // // parse application/json
// app.use(bodyParser.json({
//   strict: false
// }))

app.use(helmet());
app.disable("x-powered-by"); 


const limiter = rateLimit({
  // windowMs: 15 * 60 * 1000, // 15 minutes
  windowMs: parseInt(process.env.RATE_LIMIT_RESET_SECONDS || "10000"), // 10 seconds
  // max: 100, // limit each IP to 100 requests per window
  max: parseInt(process.env.RATE_LIMIT_ATTEMPTS || "10"), // limit each IP to 60 requests per window
});

app.use(limiter);
app.use("/api", ComponentsRouter);


app.all('/', (req: Request, res: Response) => {
  res.send('Welcome to the Sentence Checker https://github.com/jibolashittubolu');
});

// Use error haandling middleware
app.use(errorHandler.handle);

// Take care of unhandled rejections
process.on("unhandledRejection", async (err: Error) => {
  await errorHandler.handleRejection(err);

  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  process.exit(err ? 1 : 0);
});


// Take care of manual termination
process.on("SIGINT", async (err: Error) => {
  // Close all connections
  console.log("Termination signal received! 💥 Shutting down...");
  process.exit(err ? 1 : 0);
});

app.listen(PORT, () => {
  console.log(`Server is now running on port: ${PORT}`);
});
