import { Link, NavLink } from "react-router-dom";
import { Menu, X, BarChart3 } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "../ui/ThemeToggle";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    const { isAuthenticated, logout } = useAuth();

    const navLinks = [
        { name: "Dashboard", path: "/" },
        { name: "Portfolio", path: "/portfolio" },
        { name: "Watchlist", path: "/watchlist" },
        { name: "Manage", path: "/manage" },
        { name: "Analytics", path: "/analytics" },
    ];

    const handleLogout = async () => {
        await logout();
        setIsOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
                {/* Logo */}

                <Link
                    to="/"
                    className="flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
                        <BarChart3 size={22} />
                    </div>

                    <div>
                        <h1 className="text-lg font-bold text-foreground">
                            StockPulse
                        </h1>

                        <p className="text-xs text-foreground-secondary">
                            Portfolio Tracker
                        </p>
                    </div>
                </Link>

                {/* Desktop Navigation */}

                <nav className="hidden items-center gap-8 md:flex">
                    {navLinks.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                `relative rounded font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4 ${
                                    isActive
                                        ? "text-primary"
                                        : "text-foreground-secondary hover:text-foreground"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {item.name}

                                    {isActive && (
                                        <span className="absolute -bottom-2 left-0 h-0.5 w-full rounded bg-primary" />
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Right Section */}

                <div className="flex items-center gap-3">
                    <ThemeToggle />

                    {isAuthenticated ? (
                        <button
                            onClick={handleLogout}
                            className="hidden rounded-xl border border-border px-4 py-2 text-sm font-medium text-error transition hover:bg-hover focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 md:block"
                        >
                            Logout
                        </button>
                    ) : (
                        <div className="hidden items-center gap-3 md:flex">
                            <Link
                                to="/login"
                                className="rounded-xl border border-border px-4 py-2 text-sm font-medium transition hover:bg-hover focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
                            >
                                Login
                            </Link>

                            <Link
                                to="/signup"
                                className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}

                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label={isOpen ? "Close menu" : "Open menu"}
                        aria-expanded={isOpen}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card transition hover:bg-hover focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 md:hidden"
                    >
                        {isOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}

            <div
                className={`overflow-hidden border-border bg-background/95 backdrop-blur-md transition-all duration-300 md:hidden ${
                    isOpen ? "max-h-112 border-t" : "max-h-0"
                }`}
            >
                {navLinks.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                            `block px-6 py-4 font-medium transition ${
                                isActive
                                    ? "bg-hover text-primary"
                                    : "text-foreground hover:bg-hover"
                            }`
                        }
                    >
                        {item.name}
                    </NavLink>
                ))}

                <div className="border-t border-border">
                    {isAuthenticated ? (
                        <button
                            onClick={handleLogout}
                            className="block w-full px-6 py-4 text-left font-medium text-error transition hover:bg-hover"
                        >
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                onClick={() => setIsOpen(false)}
                                className="block px-6 py-4 font-medium transition hover:bg-hover"
                            >
                                Login
                            </Link>

                            <Link
                                to="/signup"
                                onClick={() => setIsOpen(false)}
                                className="block px-6 py-4 font-medium text-primary transition hover:bg-hover"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}