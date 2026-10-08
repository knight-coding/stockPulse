import Portfolio from "../models/Portfolio.model.js";
import { getStockPrice } from "./stockCache.service.js";

const round = (value) =>
    Math.round((value + Number.EPSILON) * 100) / 100;

export const getPortfolioDashboard = async (
    userId,
    filters = {}
) => {
    const { portfolioId, symbol } = filters;

    const query = {
        user: userId
    };

    /*
     * If a portfolio is selected,
     * only consider holdings from that portfolio.
     *
     * Otherwise, consider all user portfolios.
     */
    if (portfolioId) {
        query._id = portfolioId;
    }

    const portfolios = await Portfolio
        .find(query)
        .lean();

    /*
     * Aggregate holdings by stock symbol.
     *
     * Example:
     *
     * Portfolio A:
     * RELIANCE → 10 shares @ ₹1000
     *
     * Portfolio B:
     * RELIANCE → 20 shares @ ₹1100
     *
     * Result:
     * RELIANCE → 30 shares, ₹32000 invested
     */
    const holdingMap = new Map();

    for (const portfolio of portfolios) {
        for (const holding of portfolio.holdings) {

            if (
                symbol &&
                holding.symbol !== symbol
            ) {
                continue;
            }

            const existing =
                holdingMap.get(holding.symbol);

            if (existing) {
                existing.quantity +=
                    holding.quantity;

                existing.investedAmount +=
                    holding.investedAmount;
            } else {
                holdingMap.set(
                    holding.symbol,
                    {
                        securityId:
                            holding.securityId,

                        symbol:
                            holding.symbol,

                        quantity:
                            holding.quantity,

                        investedAmount:
                            holding.investedAmount
                    }
                );
            }
        }
    }

    const holdings = Array.from(
        holdingMap.values()
    );

    /*
     * Get unique symbols.
     *
     * Since holdings are already aggregated,
     * each symbol appears only once here.
     */
    const uniqueSymbols = holdings.map(
        (holding) => holding.symbol
    );

    /*
     * Fetch all stock prices from Redis
     * in parallel.
     */
    const priceResults = await Promise.all(
        uniqueSymbols.map(async (symbol) => {
            const price =
                await getStockPrice(symbol);

            return {
                symbol,
                price
            };
        })
    );

    /*
     * Convert price results into a Map.
     */
    const priceMap = new Map(
        priceResults.map(
            ({ symbol, price }) => [
                symbol,
                price
            ]
        )
    );

    let totalInvestment = 0;
    let currentValue = 0;
    let pricedHoldings = 0;

    /*
     * Calculate metrics for each unique stock.
     */
    const dashboardHoldings =
        holdings.map((holding) => {

            const stockPrice =
                priceMap.get(
                    holding.symbol
                );

            const investedAmount =
                holding.investedAmount;

            /*
             * Redis does not have the
             * current stock price.
             */
            if (!stockPrice) {
                return {
                    ...holding,

                    purchasePrice:
                        investedAmount /
                        holding.quantity,

                    currentPrice: null,
                    currentValue: null,
                    profitLoss: null,
                    profitLossPercentage: null
                };
            }

            pricedHoldings++;

            const currentPrice =
                stockPrice.closePrice;

            /*
             * Weighted average purchase price.
             *
             * Example:
             *
             * 10 × ₹1000
             * 20 × ₹1100
             *
             * Average =
             * ₹32000 / 30
             */
            const averagePurchasePrice = investedAmount / holding.quantity;

            const holdingCurrentValue =
                round(
                    holding.quantity *
                    currentPrice
                );

            const profitLoss =
                round(
                    holdingCurrentValue -
                    investedAmount
                );

            const profitLossPercentage =
                round(
                    investedAmount > 0
                        ? (
                              profitLoss /
                              investedAmount
                          ) * 100
                        : 0
                );

            totalInvestment +=
                investedAmount;

            currentValue +=
                holdingCurrentValue;

            return {
                ...holding,

                purchasePrice:
                    round(
                        averagePurchasePrice
                    ),

                currentPrice,

                currentValue:
                    holdingCurrentValue,

                profitLoss,

                profitLossPercentage
            };
        });

    /*
     * Round aggregate values.
     */
    totalInvestment =
        round(totalInvestment);

    currentValue =
        round(currentValue);

    const totalProfitLoss =
        round(
            currentValue -
            totalInvestment
        );

    const totalProfitLossPercentage =
        round(
            totalInvestment > 0
                ? (
                      totalProfitLoss /
                      totalInvestment
                  ) * 100
                : 0
        );

    return {
        summary: {
            totalInvestment,
            currentValue,
            profitLoss: totalProfitLoss,
            profitLossPercentage: totalProfitLossPercentage,

            /*
             * Number of UNIQUE stocks,
             * not number of portfolio positions.
             */
            totalHoldings: holdings.length,
            pricedHoldings
        },

        holdings: dashboardHoldings
    };
};