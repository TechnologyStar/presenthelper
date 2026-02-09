import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import redisClient from './config/redis.js';
import routes from './routes/index.js';
import { initializeData } from './seedData.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    code: 9999,
    message: '服务器内部错误',
    data: null
  });
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    if (redisClient) {
      try {
        await redisClient.connect();
        console.log('Redis connection established successfully.');
      } catch (error) {
        console.warn('Redis connection failed, continuing without cache:', error.message);
      }
    } else {
      console.warn('Redis not configured, running without cache.');
    }

    // 初始化数据
    await initializeData();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
      console.log(`Access URL: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();

process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await sequelize.close();
  if (redisClient) {
    try {
      await redisClient.quit();
    } catch (error) {
      console.warn('Redis quit error:', error.message);
    }
  }
  process.exit(0);
});
