import express from "express";

import authRoute from "./auth.routes.js";
import userRoute from "./user.routes.js";
import portfolioRoute from "./portfolio.routes.js";
import verifyJWT from "../middleware/auth.middleware.js";
import securitiesRouter from "./securities.routes.js";
import watchlistRoute from "./watchlist.routes.js";

const router = express.Router();
router.use("/auth", authRoute);
router.use("/securities", securitiesRouter);

router.use(verifyJWT);
router.use("/users", userRoute);
router.use("/watchlist", watchlistRoute);
router.use("/portfolio", portfolioRoute);

export default router;