import Card from "./Card";

export default function StatCard({
    title,
    value,
    change,
    subtitle,
    icon,
    positive,
    className = "",
}) {
    return (
        <Card className={`p-5 ${className}`}>

            <div className="flex items-start justify-between">

                <div className="min-w-0">

                    <p className="text-sm font-medium text-foreground-secondary">
                        {title}
                    </p>

                    <h2
                        className={`
                            mt-2
                            text-2xl
                            font-bold
                            tracking-tight
                            ${
                                positive === true
                                    ? "text-success"
                                    : positive === false
                                        ? "text-error"
                                        : "text-foreground"
                            }
                        `}
                    >
                        {value}
                    </h2>

                    {change && (
                        <span
                            className={`
                                mt-2
                                inline-flex
                                items-center
                                rounded-lg
                                px-2.5
                                py-1
                                text-xs
                                font-semibold
                                ${
                                    positive === true
                                        ? "bg-success/15 text-success"
                                        : positive === false
                                            ? "bg-error/15 text-error"
                                            : "bg-foreground/10 text-foreground-secondary"
                                }
                            `}
                        >
                            {change}
                        </span>
                    )}

                    {subtitle && (
                        <p className="mt-2 text-xs text-foreground-secondary">
                            {subtitle}
                        </p>
                    )}

                </div>

                {icon && (
                    <div
                        className="
                            ml-4
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-primary/10
                            text-primary
                        "
                    >
                        {icon}
                    </div>
                )}

            </div>

        </Card>
    );
}