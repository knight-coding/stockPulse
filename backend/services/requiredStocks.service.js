import RequiredStock from "../models/RequiredStocks.models.js";

export const ensureStockRequired = async (securityId) => {
    return await RequiredStock.findOneAndUpdate(
        { securityId },
        {
            $setOnInsert: {
                securityId
            }
        },
        {
            upsert: true,
            returnDocument: "after"
        }
    );
};

export const getRequiredStocks = async () => {
    return await RequiredStock.find()
        .select("securityId")
        .populate("securityId", "symbol companyName exchange isActive")
        .lean();
};