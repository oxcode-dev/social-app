import express, { type Application } from "express";
//@ts-ignore
import connectDB from "./config/DB.ts";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import routes from "./routes/index.ts";
import rateLimiter from 'express-rate-limit';


const app: Application = express();

app.use(express.json());


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

app.listen(PORT, () => {
  console.log(
    `🟢 Server running in development mode on port ${PORT}`
  )

  routes(app);
});

connectDB();
// import crypto from 'crypto';
// console.log(crypto.randomBytes(32).toString('hex'))
