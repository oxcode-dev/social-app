import { config } from "dotenv";

config();

export const JWT_SECRET = process.env.JWT_SECRET as string;
export const NODE_ENV = process.env.NODE_ENV;
export const isDevelopment = NODE_ENV === "development";
export const isProduction = NODE_ENV === "production";

export const EMAIL_SMTP_USERNAME = process.env.EMAIL_SMTP_USERNAME as string;
export const CLIENT_URL = process.env.CLIENT_URL as string;

export const MONGO_URI = process.env.MONGO_URI as string;
