import express, { Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import userRoutes from '@routes/user';
import gameRoutes from '@routes/game';
import adminRoutes from '@routes/admin';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Versioned Routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/game', gameRoutes);
app.use('/api/v1/admin', adminRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 