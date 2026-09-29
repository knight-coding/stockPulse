import { Search } from "lucide-react";
import Input from "./Input";

export default function SearchBar(props) {
    return (
        <div className="relative w-full">

            <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-secondary"
            />

            <Input
                className="pl-11"
                placeholder="Search stocks..."
                {...props}
            />

        </div>
    );
}