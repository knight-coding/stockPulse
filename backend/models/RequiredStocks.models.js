// represents the unique stocks accross users stock session to handle the limit of bharatstocks API
import mongoose from "mongoose";

const requiredStockSchema = new mongoose.Schema(
    {
        securityId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Security",
            required: true,
            unique: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("RequiredStock", requiredStockSchema);