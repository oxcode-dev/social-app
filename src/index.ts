import express, { type Application } from "express";
//@ts-ignore
import connectDB from "./config/DB.ts";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import routes from "./routes/index.ts";
import rateLimiter from 'express-rate-limit';
import { Server } from 'socket.io';
import http from "http";

const app: Application = express();

app.use(express.json());

// const server = createServer(app);
const server = http.createServer(app);

const io = new Server(server);


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
