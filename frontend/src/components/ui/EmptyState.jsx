import { FolderOpen } from "lucide-react";

export default function EmptyState({
    title,
    description,
    icon = <FolderOpen size={50} />,
}) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-14">

            <div className="text-primary">
                {icon}
            </div>

            <h3 className="mt-4 text-xl font-semibold text-foreground">
                {title}
            </h3>

            <p className="mt-2 max-w-md text-center text-foreground-secondary">
                {description}
            </p>

        </div>
    );
}