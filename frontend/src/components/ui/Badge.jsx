export default function Badge({
    children,
    variant = "success",
}) {
    const colors = {
        success:
            "bg-success/10 text-success",

        danger:
            "bg-error/10 text-error",

        warning:
            "bg-warning/10 text-warning",

        info:
            "bg-info/10 text-info",
    };

    return (
        <span
            className={`
                rounded-full
                px-3
                py-1
                text-xs
                font-semibold
                ${colors[variant]}
            `}
        >
            {children}
        </span>
    );
}