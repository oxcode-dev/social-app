import express, { type Application } from "express";
//@ts-ignore
import connectDB from "./config/DB.ts";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import routes from "./routes/index.ts";
import rateLimiter from 'express-rate-limit';
import { Server } from 'socket.io';
import http from "http";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors"

const app: Application = express();

app.use(express.json());

// Use Helmet early in your middleware stack
app.use(helmet());

// Use 'dev' format for concise, color-coded console logs
app.use(morgan('dev')); 

// const server = createServer(app);
const server = http.createServer(app);

const io = new Server(server);

const corsOptions = {
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
    origin: (process.env.CLIENT_URL || 'http://localhost:3000').split(','),
};

app.use(cors(corsOptions));

app.use(rateLimiter({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 5, // Reduce to 50 requests
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


io.on('connection', (socket) => {
  console.log('a user connected');
});

app.listen(PORT, () => {
  console.log(
    `🟢 Server running in development mode on port ${PORT}`
  )

  routes(app);
});

connectDB();

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
