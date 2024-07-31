import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import http from 'http';
import cors from 'cors';
import reviewRoutes from './routes/review-route';
import { initWebSocket } from './websocket';

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors());

app.use(express.json());
app.use('/api', reviewRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI || '')
  .then(() => {
    console.log('Connected to MongoDB');
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      initWebSocket(server);
    });
  })
  .catch(err => {
    console.error('Connection error', err);
  });
