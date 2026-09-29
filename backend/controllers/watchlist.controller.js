import Watchlist from "../models/Watchlist.model.js";
import Security from "../models/Securities.model.js";
import { ensureStockRequired } from "../services/requiredStocks.service.js";
import { getStockPrice } from "../services/stockCache.service.js";

export const getWatchlist = async (req, res) => {
    try {
        const userId = req.user.id;

        const watchlist = await Watchlist.find({ userId })
            .populate(
                "securityId",
                "symbol companyName exchange isin isActive"
            )
            .lean();

        const watchlistWithPrices = await Promise.all(
            watchlist.map(async (item) => {
                const symbol = item.securityId?.symbol;

                const price = symbol
                    ? await getStockPrice(symbol)
                    : null;

                return {
                    ...item,
                    currentPrice: price?.closePrice ?? null,
                    tradeDate: price?.tradeDate ?? null,
                    priceFetchedAt: price?.fetchedAt ?? null,
                };
            })
        );

        return res.status(200).json({
            success: true,
            count: watchlistWithPrices.length,
            data: watchlistWithPrices,
        });

    } catch (error) {
        console.error("Error fetching watchlist:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch watchlist",
        });
    }
};


// Add stock to watchlist
export const addToWatchlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { securityId } = req.body;

        if (!securityId) {
            return res.status(400).json({
                success: false,
                message: "Security ID is required",
            });
        }

        await ensureStockRequired(securityId);

        // Check whether security exists
        const security = await Security.findOne({
            _id: securityId,
            isActive: true,
        });

        if (!security) {
            return res.status(404).json({
                success: false,
                message: "Security not found",
            });
        }

        // Check duplicate
        const existing = await Watchlist.findOne({
            userId,
            securityId,
        });

        if (existing) {
            return res.status(409).json({
                success: false,
                message: "Stock is already in your watchlist",
            });
        }

        const watchlistItem = await Watchlist.create({
            userId,
            securityId,
        });

        const populatedItem = await watchlistItem.populate(
            "securityId",
            "symbol companyName exchange isin isActive"
        );

        return res.status(201).json({
            success: true,
            message: "Stock added to watchlist",
            data: populatedItem,
        });
    } catch (error) {
        console.error("Add to watchlist error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to add stock to watchlist",
        });
    }
};


// Remove stock from watchlist
export const removeFromWatchlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { securityId } = req.params;

        const deletedItem = await Watchlist.findOneAndDelete({
            userId,
            securityId,
        });

        if (!deletedItem) {
            return res.status(404).json({
                success: false,
                message: "Stock not found in watchlist",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Stock removed from watchlist",
        });
    } catch (error) {
        console.error("Remove from watchlist error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to remove stock from watchlist",
        });
    }
};