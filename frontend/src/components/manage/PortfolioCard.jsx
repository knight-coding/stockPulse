import { FolderOpen, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Card from "../ui/Card";

export default function PortfolioCard({ portfolio }) {
    const navigate = useNavigate();

    return (
        <Card
            className="cursor-pointer hover:border-primary transition-all"
            onClick={() => navigate(`/manage/${portfolio._id}`)}
        >
            <div className="flex items-center justify-between">

                <div className="flex items-center gap-4">

                    <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <FolderOpen />
                    </div>

                    <div>

                        <h2 className="text-lg font-semibold text-foreground">
                            {portfolio.name}
                        </h2>

                        <p className="text-sm text-foreground-secondary">
                            {portfolio.description}
                        </p>

                        <div className="mt-2 flex gap-4 text-sm text-foreground-secondary">

                            <span>
                                {portfolio.holdings?.length || 0} Holdings
                            </span>

                            <span>
                                {portfolio.value}
                            </span>

                        </div>

                    </div>

                </div>

                <ChevronRight className="text-foreground-secondary" />

            </div>
        </Card>
    );
}