import mongoose from "mongoose"
import { config } from "dotenv"

config();

const MONGO_URI = process.env.MONGO_URI as string;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
              // useNewUrlParser: true,
              // useUnifiedTopology: true,
              // useCreateIndex: true,
            // serverSelectionTimeoutMS: 30000,
            // socketTimeoutMS: 45000,
        })
        console.log('MongoDB Database connected');
    } catch (error) {
        console.error('MongoDB Database connection error:', error);
        process.exit(1);
    }
}

export default connectDB;