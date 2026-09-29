import express from "express";
import { addHolding, deleteHolding, getHoldings, updateHolding } from "../controllers/holdings.controller.js";

const holdingRoute = express.Router();

holdingRoute.post("/:portfolioId", addHolding);
holdingRoute.get("/:portfolioId", getHoldings);
holdingRoute.patch("/:portfolioId/:symbol", updateHolding);
holdingRoute.delete("/:portfolioId/:symbol", deleteHolding);

export default holdingRoute;