import express from "express";
import holdingRoute from "./holdings.routes.js";
import { addToWatchlist, getWatchlist, removeFromWatchlist } from "../controllers/watchlist.controller.js";

const watchlistRoute = express.Router();

watchlistRoute.get("/", getWatchlist);
watchlistRoute.post("/", addToWatchlist);
watchlistRoute.delete("/:securityId", removeFromWatchlist);

export default watchlistRoute;