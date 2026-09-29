import fs from "fs";
import csv from "csv-parser";
import mongoose from "mongoose";
import Security from "../models/Securities.model.js";
import { connectDB } from "../config/dbConnect.js";
import "dotenv/config";


import dns from "node:dns/promises";
dns.setServers(["1.1.1.1"]);

const securities = [];

await connectDB();

fs.createReadStream("./data/EQUITY_L.csv")
  .pipe(csv({
    mapHeaders: ({ header }) => header.trim()
  }))
  .on("data", (row) => {
    securities.push({
      symbol: row["SYMBOL"]?.trim(),
      companyName: row["NAME OF COMPANY"]?.trim(),
      series: row["SERIES"]?.trim(),
      listingDate: row["DATE OF LISTING"]?.trim(),
      paidUpValue: Number(row["PAID UP VALUE"]),
      marketLot: Number(row["MARKET LOT"]),
      isin: row["ISIN NUMBER"]?.trim(),
      faceValue: Number(row["FACE VALUE"]),
      exchange: "NSE",
      isActive: true,
    });
  })
  .on("end", async () => {
    try {
      await Security.bulkWrite(
        securities.map((security) => ({
          updateOne: {
            filter: {
              symbol: security.symbol,
              exchange: security.exchange,
            },
            update: {
              $set: security,
            },
            upsert: true,
          },
        }))
      );

      console.log(`Imported ${securities.length} securities`);

      await mongoose.connection.close();
    } catch (error) {
      console.error("Import error:", error);
      process.exit(1);
    }
  });