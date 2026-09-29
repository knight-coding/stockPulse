import "dotenv/config";

import express from 'express';
import { connectDB } from './config/dbConnect.js';
import cors from "cors";
import cookieParser from "cookie-parser";
import router from './routes/index.js';
import { corsOptions } from './config/corsOptions.js';
import "./workers/stockPrice.worker.js";

import dns from "node:dns/promises";
dns.setServers(["1.1.1.1"]);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

await connectDB();

app.use("/api", router);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});