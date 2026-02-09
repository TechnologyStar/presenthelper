import dotenv from 'dotenv';

dotenv.config();

// 演示模式：禁用 Redis
const redisClient = null;

console.warn('Redis disabled in demo mode');

export default redisClient;
