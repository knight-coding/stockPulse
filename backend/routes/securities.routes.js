// routes/security.routes.js

import express from "express";
import { searchSecurities } from "../controllers/securities.controller.js";

const securitiesRouter = express.Router();

securitiesRouter.get("/search", searchSecurities);

export default securitiesRouter;