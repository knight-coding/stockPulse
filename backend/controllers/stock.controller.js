import redis from "../config/redis.js";

export const setStockPrice = async (
    symbol,
    closePrice,
    tradeDate
) => {
    const key = `stock:price:${symbol}`;

    await redis.set(
        key,
        JSON.stringify({
            closePrice,
            tradeDate,
            fetchedAt: new Date().toISOString(),
        })
    );
};

export const getStockPrice = async (symbol) => {
    const key = `stock:price:${symbol}`;

    const data = await redis.get(key);

    return data ? JSON.parse(data) : null;
};