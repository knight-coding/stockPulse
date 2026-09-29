import express from "express";
import { createPortfolio, deletePortfolio, getUserPortfolios, getPortfolioById } from "../controllers/porfolio.controller.js";
import holdingRoute from "./holdings.routes.js";

const portfolioRoute = express.Router();

portfolioRoute.get("/", getUserPortfolios);
portfolioRoute.get("/:portfolioId", getPortfolioById);
portfolioRoute.post("/", createPortfolio);
portfolioRoute.delete("/:portfolioId", deletePortfolio);

portfolioRoute.use("/holdings", holdingRoute);

export default portfolioRoute;