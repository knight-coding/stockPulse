// controllers/security.controller.js

import Security from "../models/Securities.model.js";

export const searchSecurities = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || !q.trim()) {
            return res.status(400).json({
                success: false,
                message: "Search query is required",
            });
        }

        const search = q.trim();

        const securities = await Security.find({
            isActive: true,
            $or: [
                {
                    symbol: {
                        $regex: `^${search}`,
                        $options: "i",
                    },
                },
                {
                    companyName: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ],
        })
            .select("_id symbol companyName exchange isActive")
            .limit(10)
            .lean();

        return res.status(200).json({
            success: true,
            count: securities.length,
            data: securities,
        });

    } catch (error) {
        console.error("Security search error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to search securities",
        });
    }
};

