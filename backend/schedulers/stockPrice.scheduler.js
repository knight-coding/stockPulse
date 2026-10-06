import stockPriceQueue from "../queues/stockPrice.queue.js";

const scheduleStockPriceUpdate = async () => {
    await stockPriceQueue.upsertJobScheduler(
        "daily-stock-price-update",
        {
            pattern: "0 0 16 * * 1-5",
            tz: "Asia/Kolkata",
        },
        {
            name: "prepare-stock-update",
            data: {},
            opts: {
                removeOnComplete: true,
                removeOnFail: false,
            },
        }
    );

    console.log(
        "Stock price scheduler registered: 4:00 PM IST, Monday-Friday"
    );
};

export default scheduleStockPriceUpdate;