export default function Select({
    options = [],
    className = "",
    ...props
}) {
    return (
        <select
            className={`
                w-full
                rounded-xl
                border
                border-border
                bg-input
                px-4
                py-2.5
                text-foreground
                outline-none
                focus:border-primary
                focus:ring-2
                focus:ring-primary/20
                ${className}
            `}
            {...props}
        >
            {options.map((option) => (
                <option
                    key={option.value}
                    value={option.value}
                >
                    {option.label}
                </option>
            ))}
        </select>
    );
}