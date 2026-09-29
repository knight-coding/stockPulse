import { getStockPrice } from "../services/stockCache.service.js";

const price = await getStockPrice("RELIANCE");

console.log("Redis price:", price);

process.exit(0);