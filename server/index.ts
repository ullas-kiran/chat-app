import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import authRoutes from './routes/AuthRoutes';

dotenv.config();

const app: Application = express();

// Type-safe environment variables
const port: number =Number(process.env.PORT || 3001);
const databaseURL: string = process.env.DATABASE_URL || '';
const origin: string[] = [process.env.ORIGIN || 'http://localhost:3000'];

// Middleware setup
app.use(cors({
    origin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials:true
}));
app.use("/upload/profiles",express.static("uploads/profiles"))
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth",authRoutes)

// Start server
const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// Database connection
const connectToDatabase = async (): Promise<void> => {
    try {
      await mongoose.connect(databaseURL);
      console.log("Connected to the db");
    } catch (err) {
      console.error("Failed to connect to the db");
    }
  };
connectToDatabase();