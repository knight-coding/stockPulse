import { useEffect, useMemo, useState } from "react";
import { Wallet, TrendingUp, PieChart, Trophy, TrendingDown } from "lucide-react";
import Card from "../components/ui/Card";
import StatCard from "../components/ui/StatCard";
import Select from "../components/ui/Select";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import { getUserPortfolios, getPortfolioDashboard } from "../api/portfolioAPI";

// --- Static Meta - No API needed ---
const stockMeta = {
  INFY: { sector: "IT" }, TCS: { sector: "IT" }, WIPRO: { sector: "IT" },
  HDFCBANK: { sector: "Banking" }, ICICIBANK: { sector: "Banking" },
  RELIANCE: { sector: "Energy" },
  //... baki add karte jana, nahi mila toh 'Others' me jayega
};

export default function Analytics() {
  const [portfolios, setPortfolios] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState("all");
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserPortfolios().then(res => setPortfolios(res.data.portfolios || []));
  }, []);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const res = await getPortfolioDashboard({ portfolioId: selectedPortfolio, symbol: "all" });
      setDashboard(res.data.data);
      setLoading(false);
    };
    fetch();
  }, [selectedPortfolio]);

  // --- ALL CALCULATION IS LOCAL, NO API ---
  const analytics = useMemo(() => {
    if (!dashboard?.holdings) return null;
    const holdings = dashboard.holdings;
    let sectorMap = {};
    let totalInv = 0;

    holdings.forEach(h => {
      const invested = h.quantity * h.purchasePrice;
      totalInv += invested;
      const sector = stockMeta[h.symbol]?.sector || "Others";
      sectorMap[sector] = (sectorMap[sector] || 0) + invested;
    });

    const sectorData = Object.entries(sectorMap).map(([name, val]) => ({
      name, pct: totalInv? ((val / totalInv) * 100).toFixed(1) : 0
    })).sort((a,b) => b.pct - a.pct);

    const winners = [...holdings].filter(h => h.profitLossPercentage > 0).sort((a,b) => b.profitLossPercentage - a.profitLossPercentage).slice(0, 3);
    const losers = [...holdings].filter(h => h.profitLossPercentage < 0).sort((a,b) => a.profitLossPercentage - b.profitLossPercentage).slice(0, 3);

    // Simple XIRR approximation
    const pnl = dashboard.summary?.profitLoss || 0;
    const xirr = totalInv? ((pnl / totalInv) * 100) : 0;

    return { sectorData, winners, losers, xirr };
  }, [dashboard]);

  if (loading &&!dashboard) return <div className="p-6"><Loader /></div>;
  if (!dashboard?.holdings?.length) return <div className="p-6"><EmptyState title="No data for analytics" description="Add holdings first" /></div>;

  const summary = dashboard.summary;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Insights</h1>
          <p className="text-sm text-foreground-secondary">Calculated from your existing portfolio data</p>
        </div>
        <Select
          options={[{ value: "all", label: "All Portfolios" },...portfolios.map(p => ({ value: p._id, label: p.name }))]}
          value={selectedPortfolio}
          onChange={e => setSelectedPortfolio(e.target.value)}
          className="w-auto max-w-"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="XIRR (Approx)" value={`${analytics?.xirr.toFixed(2)}%`} icon={<TrendingUp size={22} />} positive={analytics?.xirr > 0} />
        <StatCard title="Total P&L" value={`₹${summary?.profitLoss?.toLocaleString()}`} change={`${summary?.profitLossPercentage?.toFixed(2)}%`} positive={summary?.profitLoss > 0} icon={<Wallet size={22} />} />
        <StatCard title="Diversification" value={`${analytics?.sectorData.length} Sectors`} subtitle="Based on holdings" icon={<PieChart size={22} />} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-6">
          <h2 className="font-semibold mb-4">Sector Allocation</h2>
          <div className="space-y-3">
            {analytics?.sectorData.map(s => (
              <div key={s.name}>
                <div className="flex justify-between text-sm mb-1"><span>{s.name}</span><span>{s.pct}%</span></div>
                <div className="h-2 bg-muted rounded-full"><div className="h-full bg-primary rounded-full" style={{ width: `${s.pct}%` }}></div></div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-6">
            <h2 className="font-semibold mb-3 flex items-center gap-2"><Trophy size={18} className="text-success" /> Top Winners</h2>
            {analytics?.winners.map(h => (
              <div key={h.symbol} className="flex justify-between py-2 text-sm border-b last:border-0"><span className="font-medium">{h.symbol}</span><span className="text-success">+{h.profitLossPercentage?.toFixed(2)}%</span></div>
            ))}
          </Card>
          <Card className="p-6">
            <h2 className="font-semibold mb-3 flex items-center gap-2"><TrendingDown size={18} className="text-error" /> Top Losers</h2>
            {analytics?.losers.map(h => (
              <div key={h.symbol} className="flex justify-between py-2 text-sm border-b last:border-0"><span className="font-medium">{h.symbol}</span><span className="text-error">{h.profitLossPercentage?.toFixed(2)}%</span></div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}