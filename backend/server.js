import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import './config/db.js';  // This will load the DB connection

dotenv.config();
const app = express();

const allowedOrigin = process.env.FRONTEND_ORIGIN || (process.env.NODE_ENV === 'production'
  ? 'https://your-production-domain'
  : 'http://localhost:3000');
app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);

app.get('/', (req, res) => res.send('API Running'));

const PORT = Number(process.env.PORT) || 4025;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
