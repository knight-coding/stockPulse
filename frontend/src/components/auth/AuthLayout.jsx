export default function AuthLayout({ title, subtitle, children }) {
    return (
        <div className="min-h-screen w-full flex bg-[#0B0F14]">
            {/* Left branding panel — hidden on small screens */}
            <div className="hidden lg:flex lg:w-5/12 flex-col justify-between p-12 border-r border-[#1F2937] bg-[#0E141C]">
                <div className="flex items-center gap-2">
                    <span className="text-[#00D9A0] font-mono text-lg">▲</span>
                    <span
                        className="text-xl font-semibold tracking-tight text-[#E8EDF2]"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                        StockPulse
                    </span>
                </div>

                <div>
                    <p
                        className="text-3xl leading-snug text-[#E8EDF2]"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                        Markets move in
                        <br />
                        <span className="text-[#00D9A0]">milliseconds.</span>
                        <br />
                        Your access shouldn't slow you down.
                    </p>
                    <p className="mt-4 text-sm text-[#7A8699] max-w-sm">
                        Real-time quotes, portfolio tracking, and alerts — secured behind
                        a login built for speed.
                    </p>
                </div>

                <p className="text-xs text-[#7A8699]">
                    © {new Date().getFullYear()} StockPulse. All rights reserved.
                </p>
            </div>

            {/* Right form panel */}
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
                <div className="w-full max-w-sm">
                    <div className="mb-8 lg:hidden flex items-center gap-2 justify-center">
                        <span className="text-[#00D9A0] font-mono text-lg">▲</span>
                        <span
                            className="text-xl font-semibold text-[#E8EDF2]"
                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                            StockPulse
                        </span>
                    </div>

                    <h1
                        className="text-2xl font-semibold text-[#E8EDF2] mb-1.5"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-sm text-[#7A8699] mb-8">{subtitle}</p>
                    )}

                    {children}
                </div>
            </div>
        </div>
    );
}