import api from "./axios";

export const getUserPortfolios = () => {
    return api.get("/portfolio");
};

export const createPortfolio = (data) => {
    return api.post("/portfolio", data);
};

export const getPortfolio = (portfolioId) => {
    return api.get(`/portfolio/${portfolioId}`);
};

export const deletePortfolioById = (portfolioId) => {
    return api.delete(`/portfolio/${portfolioId}`);
};

export const getPortfolioDashboard = (filters = {}) => {
    const params = {};

    if (filters.portfolioId && filters.portfolioId !== "all") {
        params.portfolioId = filters.portfolioId;
    }

    if (filters.symbol && filters.symbol !== "all") {
        params.symbol = filters.symbol;
    }

    return api.get("/portfolio/dashboard", { params });
};

export const addHolding = (portfolioId, holdingData) => {
    return api.post(
        `/portfolio/holdings/${portfolioId}`,
        holdingData
    );
};

export const getHoldings = (portfolioId) => {
    return api.get(`/portfolio/holdings/${portfolioId}`);
}

export const updateHolding = (
    portfolioId,
    symbol,
    holdingData
) => {
    return api.patch(
        `/portfolio/holdings/${portfolioId}/${symbol}`,
        holdingData
    );
};

export const deleteHoldingBySymbol = (
    portfolioId,
    symbol
) => {
    return api.delete(
        `/portfolio/holdings/${portfolioId}/${symbol}`
    );
};