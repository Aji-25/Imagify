import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import imageRouter from './routes/ImageRoutes.js';
import userRouter from './routes/UserRoutes.js';
import dotenv from 'dotenv';
import 'dotenv/config';

const app = express();
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
  }))
app.use(express.json());
app.listen(4000)


mongoose.connect(process.env.MONGO_URL)

app.use('/api/user', userRouter);
app.use('/api/image', imageRouter);



app.get('/', (req,res)=> res.send('API Working'))

  