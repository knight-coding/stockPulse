import mongoose from "mongoose";


const securitySchema = new mongoose.Schema({
    symbol: {
        type: String,
        required: true,
    },

    companyName: {
        type: String,
        required: true,
    },
    
    series: String,
    listingDate: String,
    paidUpValue: Number,
    marketLot: Number,

    isin: {
        type: String,
        index: true,
    },

    faceValue: Number,

    exchange: {
        type: String,
        enum: ["NSE", "BSE"],
        required: true,
        default: "NSE",
    },

    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });


securitySchema.index({ symbol: 1 });
securitySchema.index({ companyName: 1 });

export default mongoose.model("Security", securitySchema);