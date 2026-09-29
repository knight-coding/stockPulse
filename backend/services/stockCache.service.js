import redis from "../config/redis.js";

export const setStockPrice = async (quote) => {
    const key = `stock:price:${quote.symbol}`;

    await redis.set(
        key,
        JSON.stringify({
            closePrice: quote.close,
            tradeDate: quote.trade_date,
            fetchedAt: new Date().toISOString(),
        })
    );
};

export const getStockPrice = async (symbol) => {
    const key = `stock:price:${symbol}`;

    const data = await redis.get(key);

    return data ? JSON.parse(data) : null;
};