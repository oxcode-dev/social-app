import { config } from "dotenv";

config();

export const JWT_SECRET = process.env.JWT_SECRET as string;
export const NODE_ENV = process.env.NODE_ENV;
export const isDevelopment = NODE_ENV === "development";
export const isProduction = NODE_ENV === "production";