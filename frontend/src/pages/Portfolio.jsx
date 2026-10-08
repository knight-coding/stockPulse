import { useEffect, useMemo, useState } from "react";

import { Wallet, TrendingUp, FolderOpen } from "lucide-react";

import Card from "../components/ui/Card";
import StatCard from "../components/ui/StatCard";
import Select from "../components/ui/Select";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";

import {
    getUserPortfolios,
    getPortfolioDashboard,
} from "../api/portfolioAPI";

/* ---------- Formatters ---------- */

const formatCurrency = (value) => {
    if (value === null || value === undefined) return "—";

    return `₹${value.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};

const formatPercentage = (value) => {
    if (value === null || value === undefined) return "—";

    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
};

/* ---------- Single holding row ---------- */

function HoldingRow({ holding }) {
    const pct = holding.profitLossPercentage;

    const pnlColor =
        pct === null || pct === undefined || pct === 0
            ? "text-foreground-secondary"
            : pct > 0
                ? "text-green-500"
                : "text-red-500";

    return (
        <li className="flex items-center justify-between gap-4 py-3">
            {/* Left: symbol + qty × avg price */}
            <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground sm:text-base">
                    {holding.symbol}
                </p>

                <p className="mt-0.5 truncate text-xs text-foreground-secondary sm:text-sm">
                    {holding.quantity} × {formatCurrency(holding.purchasePrice)}
                </p>
            </div>

            {/* Right: current value + P/L % */}
            <div className="shrink-0 text-right">
                <p className="text-sm font-semibold text-foreground sm:text-base">
                    {formatCurrency(holding.currentValue)}
                </p>

                <p className={`mt-0.5 text-xs font-medium sm:text-sm ${pnlColor}`}>
                    {formatPercentage(pct)}
                </p>
            </div>
        </li>
    );
}

export default function Portfolio() {
    const [portfolios, setPortfolios] = useState([]);
    const [selectedPortfolio, setSelectedPortfolio] = useState("all");
    const [selectedSymbol, setSelectedSymbol] = useState("all");

    const [dashboard, setDashboard] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    /* Fetch user's portfolios */
    useEffect(() => {
        const fetchPortfolios = async () => {
            try {
                const response = await getUserPortfolios();
                setPortfolios(response.data.portfolios || []);
            } catch (err) {
                console.error("Error fetching portfolios:", err);
                setError("Failed to load portfolios.");
            }
        };

        fetchPortfolios();
    }, []);

    /* Fetch dashboard whenever a filter changes */
    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getPortfolioDashboard({
                    portfolioId: selectedPortfolio,
                    symbol: selectedSymbol,
                });

                setDashboard(response.data.data);
            } catch (err) {
                console.error("Error fetching portfolio dashboard:", err);
                setError("Failed to load portfolio dashboard.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, [selectedPortfolio, selectedSymbol]);

    const portfolioOptions = useMemo(
        () => [
            { value: "all", label: "All Portfolios" },
            ...portfolios.map((p) => ({ value: p._id, label: p.name })),
        ],
        [portfolios]
    );

    const symbolOptions = useMemo(() => {
        const base = [{ value: "all", label: "All Stocks" }];

        if (!dashboard?.holdings) return base;

        const uniqueSymbols = [...new Set(dashboard.holdings.map((h) => h.symbol))];

        return [
            ...base,
            ...uniqueSymbols.map((symbol) => ({ value: symbol, label: symbol })),
        ];
    }, [dashboard]);

    /* Reset stock filter if it no longer exists after a portfolio change */
    useEffect(() => {
        const exists = symbolOptions.some((o) => o.value === selectedSymbol);
        if (!exists) setSelectedSymbol("all");
    }, [symbolOptions, selectedSymbol]);

    const summary = dashboard?.summary;
    const holdings = dashboard?.holdings ?? [];

    /*
     * Full-page loader only on the very first load.
     * On filter changes the page stays mounted so the dropdowns
     * don't disappear/flicker while new data is fetched.
     */
    if (loading && !dashboard) {
        return (
            <div className="mx-auto w-full max-w-7xl p-4 sm:p-6">
                <Loader />
            </div>
        );
    }

    if (error && !dashboard) {
        return (
            <div className="mx-auto w-full max-w-7xl p-4 sm:p-6">
                <EmptyState title="Unable to load portfolio" description={error} />
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6 overflow-hidden p-4 sm:space-y-8 sm:p-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
                    Portfolio
                </h1>

                <p className="mt-1 text-sm text-foreground-secondary sm:mt-2 sm:text-base">
                    Track your investments and portfolio performance.
                </p>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
                <StatCard
                    title="Total Investment"
                    value={formatCurrency(summary?.totalInvestment)}
                    icon={<Wallet size={22} />}
                />

                <StatCard
                    title="Current Value"
                    value={formatCurrency(summary?.currentValue)}
                    icon={<TrendingUp size={22} />}
                />

                <StatCard
                    title="Profit / Loss"
                    value={
                        summary?.profitLoss !== null &&
                        summary?.profitLoss !== undefined
                            ? `${summary.profitLoss >= 0 ? "+" : ""}${formatCurrency(
                                  summary.profitLoss
                              )}`
                            : "—"
                    }
                    change={formatPercentage(summary?.profitLossPercentage)}
                    positive={
                        summary?.profitLoss > 0
                            ? true
                            : summary?.profitLoss < 0
                                ? false
                                : undefined
                    }
                    icon={<TrendingUp size={22} />}
                />

                <StatCard
                    title="Holdings"
                    value={holdings.length}
                    subtitle={`${summary?.pricedHoldings ?? 0} currently priced`}
                    icon={<FolderOpen size={22} />}
                />
            </div>

            {/* Holdings */}
            <Card className="overflow-hidden">
                {/* Title + compact dropdowns on one row */}
                <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
                    <h2 className="text-lg font-semibold text-foreground sm:text-xl">
                        Holdings
                    </h2>

                    <div className="flex items-center gap-2">
                        <Select
                            options={portfolioOptions}
                            value={selectedPortfolio}
                            onChange={(e) => setSelectedPortfolio(e.target.value)}
                            className="w-auto max-w-[130px] py-1 text-xs sm:max-w-[170px] sm:text-sm"
                        />

                        <Select
                            options={symbolOptions}
                            value={selectedSymbol}
                            onChange={(e) => setSelectedSymbol(e.target.value)}
                            className="w-auto max-w-[110px] py-1 text-xs sm:max-w-[150px] sm:text-sm"
                        />
                    </div>
                </div>

                {/* List */}
                {holdings.length > 0 ? (
                    <ul
                        className={`divide-y divide-border transition-opacity ${
                            loading ? "opacity-50" : "opacity-100"
                        }`}
                    >
                        {holdings.map((holding) => (
                            <HoldingRow
                                key={`${holding.portfolioName}-${holding.symbol}`}
                                holding={holding}
                            />
                        ))}
                    </ul>
                ) : (
                    <div className="py-8">
                        <EmptyState
                            title="No holdings found"
                            description="There are no holdings matching the selected filters."
                        />
                    </div>
                )}
            </Card>
        </div>
    );
}