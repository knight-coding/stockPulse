import Portfolio from "../models/Portfolio.model.js";
import User from "../models/User.model.js"
import { getPortfolioDashboard } from "../services/portfolioDashboard.service.js";

export const createPortfolio = async (req, res) => {
    try {
        const { name, description, brokerName } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        const existingPortfolio = await Portfolio.findOne({
            user: userId,
            name
        });

        if (existingPortfolio) {
            return res.status(409).json({
                message: "A portfolio with this name already exists."
            });
        }

        const portfolio = await Portfolio.create({
            user: userId,
            name,
            description,
            brokerName,
            holdings: []
        });

        return res.status(201).json({
            message: "Portfolio created successfully.",
            portfolio
        });

    } catch (error) {
        console.error("Error while creating portfolio:", error.message);

        return res.status(500).json({
            message: "Internal server error."
        });
    }
};

export const getUserPortfolios = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        const portfolios = await Portfolio.find({ user: userId });

        return res.status(200).json({
            message: "Portfolios fetched successfully.",
            portfolios
        });

    } catch (error) {
        console.error("Error fetching portfolios:", error.message);

        return res.status(500).json({
            message: "Internal server error."
        });
    }
};

export const deletePortfolio = async (req, res) => {
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
                message: "You are not authorized to delete this portfolio."
            });
        }

        await Portfolio.findByIdAndDelete(portfolioId);

        return res.status(200).json({
            message: "Portfolio deleted successfully."
        });

    } catch (error) {
        console.error("Error deleting portfolio:", error);

        return res.status(500).json({
            message: "Error deleting portfolio."
        });
    }
};

export const getPortfolioById = async (req, res) => {
    try {
        const userId = req.user.id;
        const { portfolioId } = req.params;
        const portfolio = await Portfolio.findById(portfolioId);

        if(!portfolio) {
            return res.status(404).json({
                message: "Portfolio not found."
            });
        }

        if (!portfolio.user.equals(userId)) {
            return res.status(403).json({message: "You are not authorized to access this portfolio"});
        }

        return res.status(200).json({
            message: "Portfolio fetched successfully.",
            portfolio
        });        
    } catch (error) {
        console.log("Error fetching portfolio with id");
        res.status(501).json({message: "Error fetching porfolio with id"});
    }
}

export const getPortfolioDashboardController = async (req, res) => {
    try {
        const userId = req.user.id;

        const { portfolioId, symbol } = req.query;

        const dashboard = await getPortfolioDashboard(userId, {
            portfolioId,
            symbol
        });

        return res.status(200).json({
            message: "Portfolio dashboard fetched successfully.",
            data: dashboard
        });

    } catch (error) {
        console.error(
            "Error fetching portfolio dashboard:",
            error.message
        );

        return res.status(500).json({
            message: "Internal server error."
        });
    }
};