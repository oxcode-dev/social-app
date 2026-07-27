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
import compression from "compression";
import { ServerSocket } from "./config/socket.ts";
import mongoSanitize from "express-mongo-sanitize";
// import runSeed from "./db_temp.ts";

const app: Application = express();

app.disable("x-powered-by");
app.use(compression());
app.use(express.json());

app.set("trust proxy", 1);

// Use Helmet early in your middleware stack
app.use(helmet());

// Use 'dev' format for concise, color-coded console logs
app.use(morgan('dev')); 

app.use(mongoSanitize());

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

app.use(
  express.json({
    limit: "1mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  })
);

const PORT: number | string = 1337;

app.listen(PORT, () => {
  console.log(
    `🟢 Server running in development mode on port ${PORT}`
  )

  routes(app);
});

connectDB();

export default app;

// runSeed()
//   .then(() => {
//     console.log('Seeding completed successfully.');
//   })
//   .catch((error) => {
//     console.error('Error during seeding:', error);
//   });