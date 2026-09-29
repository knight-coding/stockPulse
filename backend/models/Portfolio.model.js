import mongoose from 'mongoose';

const PortfolioSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    name: {
        type: String,
        required: true,
    },

    brokerName: {
        type: String,
        enum: ["Groww", "Zerodha", "Upstox", "Angel One"],
        required: true
    },

    description: {
        type: String,
        default: ""
    },

    holdings: [
        {
            securityId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Security",
                required: true
            },

            symbol: {
                type: String,
                required: true
            },

            quantity: {
                type: Number,
                required: true,
                min: 1
            },

            purchasePrice: {
                type: Number,
                required: true,
                min: 0
            },

            investedAmount: { // quantity * purchasePrice
                type: Number,
                min: 0,
            }
        }
    ]
}, {
    timestamps: true
});

// Indexes
PortfolioSchema.index(
    { user: 1, name: 1 },
    { unique: true }
);

const Portfolio = mongoose.model("Portfolio", PortfolioSchema);

export default Portfolio;