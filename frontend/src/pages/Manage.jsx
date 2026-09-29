import { useState, useEffect } from "react";
import { Plus } from "lucide-react";

import Button from "../components/ui/Button";
import PortfolioCard from "../components/manage/PortfolioCard";
import CreatePortfolioModal from "../components/manage/CreatePortfolioModal";

import { getUserPortfolios, createPortfolio } from "../api/portfolioAPI";

// import { portfolios } from "../data/Portfolio";

export default function Manage() {
    const [portfolioList, setPortfolioList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openCreateModal, setOpenCreateModal] = useState(false);

    useEffect(() => {
        fetchPortfolios();
    }, []);

    const fetchPortfolios = async () => {
        try {
            const { data } = await getUserPortfolios();

            setPortfolioList(data.portfolios);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePortfolio = async (portfolio) => {
        const { data } = await createPortfolio(portfolio);

        setPortfolioList((prev) => [
            ...prev,
            data.portfolio,
        ]);
    };

    return (
        <div className="mx-auto min-h-screen max-w-7xl p-6">

            {/* Header */}

            <div className="mb-10 flex items-center justify-between">

                <div>

                    <h1 className="text-4xl font-bold text-foreground">
                        Manage Portfolios
                    </h1>

                    <p className="mt-2 text-foreground-secondary">
                        Create and manage your investment portfolios.
                    </p>

                </div>

                <Button onClick={() => setOpenCreateModal(true)}>
                    <Plus size={18} />
                    <span className="ml-2">
                        New Portfolio
                    </span>
                </Button>

            </div>

            {/* Portfolio List */}

            {portfolioList.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border p-10 text-center">
                    <h2 className="text-xl font-semibold">
                        No portfolios yet
                    </h2>

                    <p className="mt-2 text-foreground-secondary">
                        Create your first portfolio to start tracking your investments.
                    </p>
                </div>
            ) : (
                <div className="space-y-5">

                    {portfolioList.map((portfolio) => (
                        <PortfolioCard
                            key={portfolio._id}
                            portfolio={portfolio}
                        />
                    ))}

                </div>
            )}

            {/* Create Portfolio */}

            <CreatePortfolioModal
                open={openCreateModal}
                onClose={() => setOpenCreateModal(false)}
                onCreate={handleCreatePortfolio}
            />

        </div>
    );
}
