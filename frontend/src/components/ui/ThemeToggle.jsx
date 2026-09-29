import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle() {

    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card transition-all duration-300 hover:bg-hover hover:scale-105 active:scale-95"
        >
            {theme === "dark"
                ? <Sun size={18} />
                : <Moon size={18} />}
        </button>
    );
}