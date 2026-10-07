import 'dotenv/config';
import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import path from 'path';


import userRoutes from './backend/routes/userroute';
import postRoutes from './backend/routes/postroute';
import moderatorRoutes from './backend/routes/moderatorroute';


const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'backend/uploads')));

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/moderator', moderatorRoutes);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Social Network API is running successfully!' });
});

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/social-network';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully');
    app.listen(PORT, () => {
      console.log(` Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(' Database connection error:', error);
  });