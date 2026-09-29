import stockPriceQueue from "../queues/stockPrice.queue.js";

await stockPriceQueue.add(
    "prepare-stock-update",
    {},
    {
        removeOnComplete: true,
        removeOnFail: false,
    }
);

console.log("Stock update preparation job added");

process.exit(0);