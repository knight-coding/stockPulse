import api from "./axios";

export const searchSecurities = (query) => {
    return api.get("/securities/search", {
        params: {
            q: query,
        },
    });
};

export const addToWatchlist = (securityId) => {
    return api.post("/watchlist", { securityId });
};

export const getWatchlist = () => {
    return api.get("/watchlist");
};

export const removeFromWatchlist = (securityId) => {
    return api.delete(`/watchlist/${securityId}`);
};