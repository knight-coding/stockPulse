import clsx from "clsx";

export default function Button({
    children,
    variant = "primary",
    size = "md",
    className = "",
    ...props
}) {
    const base =
        "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
        primary:
            "bg-primary text-primary-foreground hover:bg-primary-hover",

        secondary:
            "bg-card border border-border text-foreground hover:bg-hover",

        success:
            "bg-success text-white hover:opacity-90",

        danger:
            "bg-error text-white hover:opacity-90",

        ghost:
            "text-foreground hover:bg-hover",
    };

    const sizes = {
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-5 text-sm",
        lg: "h-12 px-6 text-base",
    };

    return (
        <button
            className={clsx(
                base,
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}