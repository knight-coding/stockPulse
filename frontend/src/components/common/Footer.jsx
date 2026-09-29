import {
    FaGithub,
    FaLinkedin,
    FaXTwitter,
} from "react-icons/fa6";

export default function Footer() {
    return (
        <footer className="border-t border-border bg-card/90 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-5 py-12">

                <div className="grid md:grid-cols-3 gap-10">

                    <div>
                        <h2 className="text-xl font-bold text-foreground">
                            StockPulse
                        </h2>

                        <p className="mt-3 text-sm text-foreground-secondary leading-7">
                            Track all your stock portfolios from one place,
                            monitor profits, visualize performance and stay
                            updated after every trading session.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4 text-foreground">
                            Quick Links
                        </h3>

                        <div className="space-y-3 text-sm">

                            <a href="/" className="block text-foreground-secondary hover:text-primary transition-colors">
                                Dashboard
                            </a>

                            <a href="/portfolio" className="block text-foreground-secondary hover:text-primary transition-colors">
                                Portfolio
                            </a>

                            <a href="/analytics" className="block text-foreground-secondary hover:text-primary transition-colors">
                                Analytics
                            </a>

                            <a href="/watchlist" className="block text-foreground-secondary hover:text-primary transition-colors">
                                Watchlist
                            </a>

                        </div>
                    </div>

                    <div>

                        <h3 className="font-semibold mb-4 text-foreground">
                            Connect
                        </h3>

                        <div className="flex gap-3">

                            <a
                                href="#"
                                aria-label="GitHub"
                                className="h-10 w-10 rounded-lg bg-background border border-border hover:bg-hover hover:text-primary transition flex items-center justify-center focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
                            >
                                <FaGithub size={18} />
                            </a>

                            <a
                                href="#"
                                aria-label="LinkedIn"
                                className="h-10 w-10 rounded-lg bg-background border border-border hover:bg-hover hover:text-primary transition flex items-center justify-center focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
                            >
                                <FaLinkedin size={18} />
                            </a>

                            <a
                                href="#"
                                aria-label="X (Twitter)"
                                className="h-10 w-10 rounded-lg bg-background border border-border hover:bg-hover hover:text-primary transition flex items-center justify-center focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
                            >
                                <FaXTwitter size={18} />
                            </a>

                        </div>

                    </div>

                </div>

                <div className="mt-10 border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center gap-4">

                    <p className="text-sm text-foreground-secondary">
                        © {new Date().getFullYear()} StockPulse. All rights reserved.
                    </p>

                    <p className="text-sm text-foreground-secondary">
                        Built with React + Tailwind CSS
                    </p>

                </div>

            </div>
        </footer>
    );
}