import { Redis } from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = () =>{
    const url = process.env.REDIS_URL;
    if (url) {
        return url;
    }

    throw new Error('Redis URL not found');
}

export const redis = new Redis(redisUrl());
