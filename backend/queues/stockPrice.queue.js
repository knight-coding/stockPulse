import { Queue } from "bullmq";

const stockPriceQueue = new Queue("stock-price", {
    connection: {
        host: "localhost",
        port: 6379,
    },
});

export default stockPriceQueue;