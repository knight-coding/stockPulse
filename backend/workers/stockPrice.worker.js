import { Worker } from "bullmq";
import RequiredStock from "../models/RequiredStocks.models.js";
import { fetchStockQuotes } from "../services/bharatStocks.service.js";
import { setStockPrice } from "../services/stockCache.service.js";
import stockPriceQueue from "../queues/stockPrice.queue.js";

const BATCH_SIZE = 50;

const stockPriceWorker = new Worker(
    "stock-price",
    async (job) => {
        try {
            // -----------------------------------
            // 1. Prepare stock update
            // -----------------------------------
            if (job.name === "prepare-stock-update") {
                const requiredStocks = await RequiredStock.find()
                    .populate("securityId", "symbol")
                    .lean();

                const symbols = requiredStocks
                    .map(stock => stock.securityId?.symbol)
                    .filter(Boolean);

                if (symbols.length === 0) return;

                for (let i = 0; i < symbols.length; i += BATCH_SIZE) {
                    const batch = symbols.slice(i, i + BATCH_SIZE);
                    await stockPriceQueue.add(
                        "process-stock-batch",
                        { symbols: batch },
                        {
                            attempts: 3,
                            backoff: { type: "exponential", delay: 5000 },
                            removeOnComplete: true,
                            removeOnFail: false,
                        }
                    );
                }
                return { totalStocks: symbols.length, batchesCreated: Math.ceil(symbols.length / BATCH_SIZE) };
            }

            // -----------------------------------
            // 2. Process one stock batch
            // -----------------------------------
            if (job.name === "process-stock-batch") {
                const { symbols } = job.data;
                if (!symbols?.length) return;

                const response = await fetchStockQuotes(symbols);
                
                const validQuotes = response.filter(q => q.found);
                // const invalidQuotes = response.filter(q => !q.found); // agar track karna hai to use kar

                if (validQuotes.length > 0) {
                    await Promise.all(
                        validQuotes.map(quote => setStockPrice(quote))
                    );
                }

                return { 
                    processed: symbols.length, 
                    cached: validQuotes.length, 
                    failed: symbols.length - validQuotes.length 
                };
            }

            throw new Error(`Unknown job type: ${job.name}`);

        } catch (error) {
            // Error ko throw karenge toh BullMQ ka failed event aur retry handle karega
            console.error(`[stock-price] Job failed ${job.name}:`, error.message);
            throw error;
        }
    },
    {
        connection: { host: "localhost", port: 6379 },
        concurrency: 1,
    }
);

stockPriceWorker.on("completed", (job) => {
    // Sirf summary, har stock ka log nahi
    if (job.returnvalue) {
        console.log(`[${job.name}] done`, job.returnvalue);
    }
});

stockPriceWorker.on("failed", (job, err) => {
    console.error(`[${job?.name}] failed after retries: ${err.message}`);
});

export default stockPriceWorker;