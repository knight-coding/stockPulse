import { useState } from "react";
import {
    Wallet,
    TrendingUp,
    Search,
    FolderOpen,
} from "lucide-react";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import StatCard from "../components/ui/StatCard";
import SearchBar from "../components/ui/SearchBar";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Badge from "../components/ui/Badge";
import Table from "../components/ui/Table";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import Modal from "../components/ui/Modal";

export default function Dashboard() {
    const [open, setOpen] = useState(false);

    const data = [
        { symbol: "RELIANCE",   qty: 50,  avg: "₹2,450.50", ltp: "₹2,891.30", pnl: "+₹22,040" },
        { symbol: "TCS",        qty: 20,  avg: "₹3,620.00", ltp: "₹3,945.75", pnl: "+₹6,515" },
        { symbol: "INFY",       qty: 60,  avg: "₹1,520.25", ltp: "₹1,489.10", pnl: "-₹1,869" },
        { symbol: "HDFCBANK",   qty: 40,  avg: "₹1,650.00", ltp: "₹1,712.40", pnl: "+₹2,496" },
        { symbol: "ITC",        qty: 200, avg: "₹410.30",   ltp: "₹468.85",   pnl: "+₹11,710" },
        { symbol: "TATAMOTORS", qty: 75,  avg: "₹945.60",   ltp: "₹912.20",   pnl: "-₹2,505" },
        { symbol: "SBIN",       qty: 100, avg: "₹610.80",   ltp: "₹802.45",   pnl: "+₹19,165" },
        { symbol: "WIPRO",      qty: 120, avg: "₹480.00",   ltp: "₹452.30",   pnl: "-₹3,324" },
        { symbol: "ICICIBANK",  qty: 60,  avg: "₹1,020.75", ltp: "₹1,185.90", pnl: "+₹9,909" },
        { symbol: "ADANIPORTS", qty: 30,  avg: "₹1,310.40", ltp: "₹1,402.60", pnl: "+₹2,766" },
    ];

    const columns = [
        { key: "symbol", title: "Symbol" },
        { key: "qty", title: "Qty" },
        { key: "avg", title: "Avg Price" },
        { key: "ltp", title: "LTP" },
        { key: "pnl", title: "P/L" },
    ];

    return (
        <div className="mx-auto max-w-7xl space-y-8 p-6">
            
            {/* Title */}
            <div>
                <h1 className="text-4xl font-bold text-foreground">
                    Dashboard
                </h1>

                <p className="mt-2 text-foreground-secondary">
                    UI Playground for StockPulse Components
                </p>
            </div>

            {/* Stat Cards */}

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                <StatCard
                    title="Portfolio Value"
                    value="₹12,45,200"
                    change="+2.34%"
                    icon={<Wallet size={28} />}
                />

                <StatCard
                    title="Today's Profit"
                    value="+₹8,420"
                    change="+1.15%"
                    icon={<TrendingUp size={28} />}
                />

                <StatCard
                    title="Loss"
                    value="-₹520"
                    change="-0.42%"
                    positive={false}
                    icon={<TrendingUp size={28} />}
                />

                <StatCard
                    title="Holdings"
                    value="28"
                    change="Across 5 portfolios"
                    icon={<FolderOpen size={28} />}
                />

            </div>

            {/* Inputs */}

            <Card>

                <h2 className="mb-5 text-xl font-semibold">
                    Form Components
                </h2>

                <div className="grid gap-5 md:grid-cols-2">

                    <SearchBar />

                    <Input placeholder="Enter Portfolio Name" />

                    <Select
                        options={[
                            {
                                value: "all",
                                label: "All Portfolios",
                            },
                            {
                                value: "groww",
                                label: "Groww",
                            },
                            {
                                value: "zerodha",
                                label: "Zerodha",
                            },
                        ]}
                    />

                </div>

            </Card>

            {/* Buttons */}

            <Card>

                <h2 className="mb-5 text-xl font-semibold">
                    Buttons
                </h2>

                <div className="flex flex-wrap gap-4">

                    <Button>
                        Primary
                    </Button>

                    <Button variant="secondary">
                        Secondary
                    </Button>

                    <Button variant="success">
                        Success
                    </Button>

                    <Button variant="danger">
                        Danger
                    </Button>

                    <Button
                        variant="ghost"
                        onClick={() => setOpen(true)}
                    >
                        Open Modal
                    </Button>

                </div>

            </Card>

            {/* Badges */}

            <Card>

                <h2 className="mb-5 text-xl font-semibold">
                    Badges
                </h2>

                <div className="flex gap-3">

                    <Badge>
                        Profit
                    </Badge>

                    <Badge variant="danger">
                        Loss
                    </Badge>

                    <Badge variant="warning">
                        Pending
                    </Badge>

                    <Badge variant="info">
                        Synced
                    </Badge>

                </div>

            </Card>

            {/* Table */}

            <Card>

                <h2 className="mb-5 text-xl font-semibold">
                    Holdings Table
                </h2>

                <Table
                    columns={columns}
                    data={data}
                />

            </Card>

            {/* Loader */}

            <Card>

                <h2 className="mb-5 text-xl font-semibold">
                    Loader
                </h2>

                <Loader />

            </Card>

            {/* Empty State */}

            <EmptyState
                title="No Watchlist Found"
                description="Add your favorite stocks to start tracking them."
            />

            {/* Modal */}

            <Modal
                open={open}
                onClose={() => setOpen(false)}
                title="Example Modal"
            >

                <p className="text-foreground-secondary">
                    This is a reusable modal component.
                </p>

                <div className="mt-6 flex justify-end">

                    <Button onClick={() => setOpen(false)}>
                        Close
                    </Button>

                </div>

            </Modal>

        </div>
    );
}