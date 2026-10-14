import { Link } from "react-router-dom"

export default function Home() {
  return (
    <div className="bg-background text-foreground min-h-screen">

      {/* HERO - No header */}
      <section className="relative bg-mesh min-h- flex items-center">
        <div className="max-w-7xl mx-auto px-6 py-20 w-full">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border text-xs">
              <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
              No API calls on this page
            </div>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mt-8 leading-[0.9]">
              Portfolio tracking,<br /> finally <span className="text-primary">not boring.</span>
            </h1>
            <p className="text-foreground-secondary text-xl mt-6 max-w-2xl leading-relaxed">
              Manage multiple portfolios, get real XIRR, sector allocation and control everything by just typing. Built for traders who hate clutter.
            </p>
            <div className="flex gap-3 mt-10">
              <Link to="/portfolio" className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary-hover transition">
                Start Tracking Free
              </Link>
              <a href="#features" className="px-8 py-4 bg-card border rounded-xl font-medium hover:bg-hover transition">
                How it works
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-12 gap-4">
          <div className="md:col-span-7 p-8 rounded- bg-card border">
            <h3 className="text-2xl font-semibold">Multiple Portfolios, One View</h3>
            <p className="text-foreground-secondary mt-2">Long Term, Swing, Intraday - sab alag rakho, aggregated P&L ek jagah.</p>
          </div>
          <div className="md:col-span-5 p-8 rounded- bg-foreground text-background">
            <h3 className="text-2xl font-semibold">Talk to your portfolio</h3>
            <p className="text-white/60 mt-2 text-sm">Add 10 INFY @ 1500 to Long Term</p>
            <div className="mt-4 bg-white/10 rounded-xl p-3 font-mono text-xs">✓ Done. Average updated.</div>
          </div>
          <div className="md:col-span-5 p-8 rounded- bg-card border">
            <h3 className="text-xl font-semibold">Real Insights</h3>
            <p className="text-foreground-secondary mt-2 text-sm">XIRR, CAGR, Sector Allocation, Monthly P&L.</p>
          </div>
          <div className="md:col-span-7 p-8 rounded- bg-muted border">
            <h3 className="text-xl font-semibold">Private & Fast</h3>
            <p className="text-foreground-secondary mt-2 text-sm">Your data stays with you. Zero ads, zero tracking.</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-6 border-t pt-12">
          <div><p className="text-primary font-bold text-sm">01</p><p className="font-semibold mt-2">Create Portfolio</p><p className="text-sm text-foreground-secondary">Long term, swing jaise portfolios banao.</p></div>
          <div><p className="text-primary font-bold text-sm">02</p><p className="font-semibold mt-2">Add Stocks</p><p className="text-sm text-foreground-secondary">AI command ya manual entry se add karo.</p></div>
          <div><p className="text-primary font-bold text-sm">03</p><p className="font-semibold mt-2">Track & Grow</p><p className="text-sm text-foreground-secondary">Live insights dekho aur grow karo.</p></div>
        </div>
      </section>

      {/* CTA - No footer */}
      <section className="px-6 py-24 text-center bg-card border-t">
        <h2 className="text-5xl font-bold tracking-tighter">Ready to take control?</h2>
        <Link to="/portfolio" className="inline-block mt-8 px-10 py-4 bg-primary text-primary-foreground rounded-full font-medium text-lg">
          Go to Portfolio →
        </Link>
      </section>

    </div>
  )
}