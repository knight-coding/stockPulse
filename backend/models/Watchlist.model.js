import mongoose from "mongoose";

const watchlistSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        securityId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Security",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

watchlistSchema.index(
    { userId: 1, securityId: 1 },
    { unique: true }
);

export default mongoose.model("Watchlist", watchlistSchema);