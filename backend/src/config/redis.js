import Redis from 'ioredis';
import { env } from './environment.js';
import logger from '../utils/logger.js';

let redisClient = null;
let isRedisConnected = false;

// Basic In-Memory cache fallback implementation
class MemoryCache {
  constructor() {
    this.cache = new Map();
    logger.info('💾 Utilizing In-Memory cache fallback.');
  }

  async get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    // Check expiration
    if (entry.expiry && Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    return entry.value;
  }

  async set(key, value, mode, durationSeconds) {
    let expiry = null;
    if (mode === 'EX' && durationSeconds) {
      expiry = Date.now() + durationSeconds * 1000;
    }
    this.cache.set(key, { value, expiry });
    return 'OK';
  }

  async del(key) {
    return this.cache.delete(key) ? 1 : 0;
  }

  async keys(pattern) {
    // Simple mock keys matcher
    const keysArray = Array.from(this.cache.keys());
    if (pattern === '*') return keysArray;
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    return keysArray.filter(k => regex.test(k));
  }
}

if (env.REDIS_URL) {
  try {
    redisClient = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      retryStrategy(times) {
        if (times > 3) {
          logger.warn('⚠️ Redis reconnection attempts exceeded. Falling back to In-Memory cache.');
          redisClient = new MemoryCache();
          isRedisConnected = false;
          return null; // Stop retrying
        }
        return Math.min(times * 100, 2000);
      }
    });

    redisClient.on('connect', () => {
      logger.info('🚀 Redis connected successfully.');
      isRedisConnected = true;
    });

    redisClient.on('error', (err) => {
      logger.error('Redis error occurred:', err.message);
      if (!isRedisConnected && !(redisClient instanceof MemoryCache)) {
        logger.warn('🔄 Switching to In-Memory cache due to initial connection failure.');
        redisClient = new MemoryCache();
      }
    });
  } catch (error) {
    logger.error('Could not initialize Redis client:', error.message);
    redisClient = new MemoryCache();
  }
} else {
  logger.info('No REDIS_URL environment variable provided. Falling back to In-Memory cache.');
  redisClient = new MemoryCache();
}

export const getCache = () => redisClient;
