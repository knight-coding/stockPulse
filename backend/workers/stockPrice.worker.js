import { Worker } from "bullmq";
import RequiredStock from "../models/RequiredStocks.models.js";
import { fetchStockQuotes } from "../services/bharatStocks.service.js";
import { setStockPrice } from "../services/stockCache.service.js";
import stockPriceQueue from "../queues/stockPrice.queue.js";

const BATCH_SIZE = 50;

const stockPriceWorker = new Worker(
    "stock-price",

    async (job) => {
        console.log("Processing job:", job.name);

        // -----------------------------------
        // 1. Prepare stock update
        // -----------------------------------
        if (job.name === "prepare-stock-update") {
            const requiredStocks = await RequiredStock.find()
                .populate("securityId", "symbol");

            const symbols = requiredStocks
                .map(stock => stock.securityId?.symbol)
                .filter(Boolean);

            console.log("Total required stocks:", symbols.length);

            for (let i = 0; i < symbols.length; i += BATCH_SIZE) {
                const batch = symbols.slice(i, i + BATCH_SIZE);

                await stockPriceQueue.add(
                    "process-stock-batch",
                    {
                        symbols: batch,
                    },
                    {
                        attempts: 3,
                        backoff: {
                            type: "exponential",
                            delay: 5000,
                        },
                        removeOnComplete: true,
                        removeOnFail: false,
                    }
                );

                console.log(
                    `Batch job added: ${batch.length} stocks`
                );
            }

            return;
        }

        // -----------------------------------
        // 2. Process one stock batch
        // -----------------------------------
        if (job.name === "process-stock-batch") {
            const { symbols } = job.data;

            console.log(
                `Processing batch of ${symbols.length} stocks`
            );

            const response = await fetchStockQuotes(symbols);

            const validQuotes = response.filter(
                quote => quote.found
            );

            const invalidQuotes = response.filter(
                quote => !quote.found
            );

            for (const quote of invalidQuotes) {
                console.log(
                    `Stock not found: ${quote.symbol}`
                );
            }

            await Promise.all(
                validQuotes.map(quote =>
                    setStockPrice(quote)
                )
            );

            for (const quote of validQuotes) {
                console.log(
                    `Cached ${quote.symbol}: ₹${quote.close}`
                );
            }

            return;
        }

        throw new Error(`Unknown job type: ${job.name}`);
    },

    {
        connection: {
            host: "localhost",
            port: 6379,
        },

        // Process one batch at a time.
        // This keeps BharatStocks API requests sequential.
        concurrency: 1,
    }
);

stockPriceWorker.on("completed", (job) => {
    console.log(
        `Job ${job.id} (${job.name}) completed`
    );
});

stockPriceWorker.on("failed", (job, error) => {
    console.error(
        `Job ${job?.id} (${job?.name}) failed:`,
        error
    );
});

export default stockPriceWorker;