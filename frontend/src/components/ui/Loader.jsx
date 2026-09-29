import { LoaderCircle } from "lucide-react";

export default function Loader({
    size = 40,
}) {
    return (
        <div className="flex items-center justify-center py-10">
            <LoaderCircle
                size={size}
                className="animate-spin text-primary"
            />
        </div>
    );
}