import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import connectDB from './config/db.js';
import { PORT } from './config/utils.js';
import authRouter from './routes/auth.js';
import postsRouter from './routes/posts.js';
import { connectToRedis } from './services/redis.js';

const app = express();
const port = PORT || 5000;

// Configure CORS to allow requests from your frontend
app.use(cors({
  origin: 'http://35.223.159.193:5173', // Replace with your frontend's URL
  credentials: true, // For cookies or authorization headers
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

// Connect to database
connectDB();

// Connect to redis
connectToRedis();

// API route
app.use('/api/posts', postsRouter);
app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
  res.send('Yay!! Backend of wanderlust prod app is now accessible');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;

