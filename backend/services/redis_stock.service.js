import redisClient from "../config/redis.js";

export const setValue = async (key, value) => {
    await redisClient.set(key, value);
};

export const getValue = async (key) => {
    return await redisClient.get(key);
};

export const deleteValue = async (key) => {
    await redisClient.del(key);
};