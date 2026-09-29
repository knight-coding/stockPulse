import Portfolio from "../models/Portfolio.model.js";
import Security from "../models/Securities.model.js";
import { ensureStockRequired } from "../services/requiredStocks.service.js";

export const addHolding = async (req, res) => {
    try {
        const userId = req.user.id;
        const { portfolioId } = req.params;

        const {
            securityId,
            symbol,
            quantity,
            purchasePrice
        } = req.body;

        const portfolio = await Portfolio.findById(portfolioId);

        if (!portfolio) {
            return res.status(404).json({
                message: "Portfolio not found."
            });
        }

        if (!portfolio.user.equals(userId)) {
            return res.status(403).json({
                message: "You are not authorized to modify this portfolio."
            });
        }

        if (
            !securityId ||
            !symbol ||
            quantity == null ||
            purchasePrice == null
        ) {
            return res.status(400).json({
                message: "Security ID, symbol, quantity and purchase price are required."
            });
        }

        // Validate that the security exists and is active
        const security = await Security.findOne({
            _id: securityId,
            isActive: true
        });

        if (!security) {
            return res.status(404).json({
                message: "Security not found."
            });
        }

        const normalizedSymbol = symbol.toUpperCase();

        // Make sure the symbol actually belongs to the supplied securityId
        if (security.symbol !== normalizedSymbol) {
            return res.status(400).json({
                message: "Security ID and symbol do not match."
            });
        }

        const existingHolding = portfolio.holdings.find(
            holding => holding.securityId?.toString() === securityId
        );

        if (existingHolding) {
            return res.status(409).json({
                message: "This stock already exists in the portfolio."
            });
        }

        const investedAmount = quantity * purchasePrice;

        portfolio.holdings.push({
            securityId: security._id,
            symbol: security.symbol,
            quantity,
            purchasePrice,
            investedAmount
        });

        await portfolio.save();

        // Add this security to the global required-stock set
        await ensureStockRequired(security._id);

        const newHolding =
            portfolio.holdings[portfolio.holdings.length - 1];

        return res.status(201).json({
            message: "Holding added successfully.",
            holding: newHolding
        });

    } catch (error) {
        console.error("Error adding holding:", error);

        return res.status(500).json({
            message: "Error adding holding."
        });
    }
};

export const getHoldings = async (req, res) => {
    try {
        const userId = req.user.id;
        const { portfolioId } = req.params;

        const portfolio = await Portfolio.findById(portfolioId);

        if (!portfolio) {
            return res.status(404).json({
                message: "Portfolio not found."
            });
        }

        if (!portfolio.user.equals(userId)) {
            return res.status(403).json({
                message: "You are not authorized to access this portfolio."
            });
        }

        return res.status(200).json({
            message: "Holdings fetched successfully.",
            holdings: portfolio.holdings
        });

    } catch (error) {
        console.error("Error fetching holdings:", error);

        return res.status(500).json({
            message: "Error fetching holdings."
        });
    }
};

export const updateHolding = async (req, res) => {
    try {
        const userId = req.user.id;
        const { portfolioId, symbol } = req.params;

        const portfolio = await Portfolio.findById(portfolioId);

        if (!portfolio) {
            return res.status(404).json({
                message: "Portfolio not found."
            });
        }

        if (!portfolio.user.equals(userId)) {
            return res.status(403).json({
                message: "You are not authorized to modify this portfolio."
            });
        }

        const holding = portfolio.holdings.find(
            holding => holding.symbol === symbol.toUpperCase()
        );

        if (!holding) {
            return res.status(404).json({
                message: "Holding not found."
            });
        }

        const {
            quantity,
            purchasePrice
        } = req.body;

        if (quantity !== undefined) {
            holding.quantity = quantity;
        }

        if (purchasePrice !== undefined) {
            holding.purchasePrice = purchasePrice;
        }

        holding.investedAmount =
            holding.quantity * holding.purchasePrice;

        await portfolio.save();

        return res.status(200).json({
            message: "Holding updated successfully.",
            holding
        });

    } catch (error) {
        console.error("Error updating holding:", error);

        return res.status(500).json({
            message: "Error updating holding."
        });
    }
};

export const deleteHolding = async (req, res) => {
    try {
        const userId = req.user.id;
        const { portfolioId, symbol } = req.params;

        const portfolio = await Portfolio.findById(portfolioId);

        if (!portfolio) {
            return res.status(404).json({
                message: "Portfolio not found."
            });
        }

        if (!portfolio.user.equals(userId)) {
            return res.status(403).json({
                message: "You are not authorized to modify this portfolio."
            });
        }

        const holdingIndex = portfolio.holdings.findIndex(
            holding => holding.symbol === symbol.toUpperCase()
        );

        if (holdingIndex === -1) {
            return res.status(404).json({
                message: "Holding not found."
            });
        }

        portfolio.holdings.splice(holdingIndex, 1);

        await portfolio.save();

        return res.status(200).json({
            message: "Holding deleted successfully."
        });

    } catch (error) {
        console.error("Error deleting holding:", error);

        return res.status(500).json({
            message: "Error deleting holding."
        });
    }
};