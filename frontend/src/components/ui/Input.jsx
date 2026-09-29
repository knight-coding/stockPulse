import clsx from "clsx";

export default function Input({
    className = "",
    ...props
}) {
    return (
        <input
            className={clsx(
                "w-full rounded-xl border border-border bg-input px-4 py-2.5",
                "text-foreground placeholder:text-foreground-secondary",
                "outline-none",
                "transition-all",
                "focus:border-primary",
                "focus:ring-2",
                "focus:ring-primary/20",
                className
            )}
            {...props}
        />
    );
}