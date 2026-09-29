import { setValue, getValue } from "../services/redis_stock.service.js";

export const testRedis = async (req, res) => {
    await setValue("stockpulse:test", "hello-redis");

    const value = await getValue("stockpulse:test");

    res.json({
        value
    });
};