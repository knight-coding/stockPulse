import { motion } from "framer-motion";
import Card from "./Card";

export default function StatCard({
    title,
    value,
    change,
    icon,
    positive = true,
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{
                y: -6,
                transition: { duration: 0.2 },
            }}
        >
            <Card className="cursor-pointer">

                <div className="flex items-start justify-between">

                    <div className="space-y-2">

                        <p className="text-sm font-medium text-foreground-secondary">
                            {title}
                        </p>

                        <h2 className="text-3xl font-bold text-foreground">
                            {value}
                        </h2>

                        <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                                positive
                                    ? "bg-success/15 text-success"
                                    : "bg-error/15 text-error"
                            }`}
                        >
                            {change}
                        </span>

                    </div>

                    <div
                        className="
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            rounded-2xl
                            bg-primary/10
                            text-primary
                        "
                    >
                        {icon}
                    </div>

                </div>

            </Card>
        </motion.div>
    );
}