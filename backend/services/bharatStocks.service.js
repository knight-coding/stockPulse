import axios from "axios";

const bharatStockAPI = axios.create({
    baseURL: process.env.BHARATSTOCK_BASE_URL,
    headers: {
        "X-API-Key": process.env.BHARATSTOCK_API_KEY,
    },
    timeout: 10000,
});

export const fetchStockQuotes = async (symbols) => {
    if (!symbols || symbols.length === 0) {
        return [];
    }

    const response = await bharatStockAPI.get("/v1/stocks/quotes", {
        params: {
            symbols: symbols.join(","),
        },
    });

    return response.data;
};