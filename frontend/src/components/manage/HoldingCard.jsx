import { Pencil, Trash2 } from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";

export default function HoldingCard({
    holding,
    onEdit,
    onDelete,
}) {
    return (
        <Card>

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-xl font-semibold text-foreground">
                        {holding.symbol}
                    </h2>

                    <div className="mt-3 flex flex-wrap gap-6 text-sm text-foreground-secondary">

                        <span>
                            Qty:{" "}
                            <strong>
                                {holding.quantity}
                            </strong>
                        </span>

                        <span>
                            Avg:{" "}
                            <strong>
                                ₹{holding.purchasePrice}
                            </strong>
                        </span>

                        <span>
                            Invested:{" "}
                            <strong>
                                ₹{holding.investedAmount}
                            </strong>
                        </span>

                    </div>

                </div>

                <div className="flex gap-2">

                    <Button
                        variant="secondary"
                        onClick={onEdit}
                    >
                        <Pencil size={16} />
                    </Button>

                    <Button
                        variant="danger"
                        onClick={onDelete}
                    >
                        <Trash2 size={16} />
                    </Button>

                </div>

            </div>

        </Card>
    );
}