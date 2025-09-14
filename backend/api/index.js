import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDb from '../config/db.js';
import cookieParser from 'cookie-parser';
import userRoutes from '../routes/userRoutes.js';
import tenantRoutes from '../routes/tenantRoutes.js';
import notesRoutes from '../routes/notesRoutes.js';
import seedData from "../seed.js";
import mongoose from 'mongoose';

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true,
}));

// Health check endpoint
app.get("/health", (req, res) => {
  return res.status(200).json({ status: "ok" });
});

// Routes
app.use('/api/user', userRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/notes', notesRoutes);

app.get('/', (req, res) => {
  res.send('Api sent from keep notes project');
});


connectDb();

mongoose.connection.once("open", async () => {
  await seedData(); // seed only once
});

// Export for Vercel
export default app;
