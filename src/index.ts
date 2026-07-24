import express, { type Application } from "express";
//@ts-ignore
import connectDB from "./config/DB.ts";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import routes from "./routes/index.ts";
import rateLimiter from 'express-rate-limit';
import http from "http";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors"
import { ServerSocket } from "./config/socket.ts";
import { getDatabaseConnection } from "./config/database.ts";
// import runSeed from "./db_temp.ts";

const app: Application = express();

app.use(express.json());

// Use Helmet early in your middleware stack
app.use(helmet());

// Use 'dev' format for concise, color-coded console logs
app.use(morgan('dev')); 


/** Server Handling */
const httpServer = http.createServer(app);

/** Start Socket */
new ServerSocket(httpServer);

const corsOptions = {
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
    origin: (process.env.CLIENT_URL || 'http://localhost:3000').split(','),
};

app.use(cors(corsOptions));

app.use(rateLimiter({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 20, // Reduce to 50 requests
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/health' // Skip health checks
}));

// Middleware to parse JSON data
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cookieParser());

const PORT: number | string = 1337;

app.listen(PORT, () => {
  console.log(
    `🟢 Server running in development mode on port ${PORT}`
  )

  routes(app);
});

connectDB();

getDatabaseConnection();

export default app;

// io.on("connection", (socket) => {
//   console.log("A user has connected");

//   socket.on("sendMessage", (message, callback) => {
//     console.log(`Message received: ${message}`);
//     io.emit("message", message);
//     callback();
//   });

//   socket.on("disconnect", () => {
//     console.log("A user has disconnected");
//   });
// });
// import crypto from 'crypto';
// console.log(crypto.randomBytes(32).toString('hex'))


// runSeed()
//   .then(() => {
//     console.log('Seeding completed successfully.');
//   })
//   .catch((error) => {
//     console.error('Error during seeding:', error);
//   });