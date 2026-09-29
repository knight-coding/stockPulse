import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    searchSecurities,
    addToWatchlist,
    removeFromWatchlist,
    getWatchlist,
} from "../api/securitiesAPI";

/* ---------- helpers ---------- */

// Watchlist entries may be plain securities or { security: {...} } — handle both.
const toSecurity = (item) => {
    if (!item?.securityId) return item;

    return {
        ...item.securityId,
        currentPrice: item.currentPrice,
        tradeDate: item.tradeDate,
        priceFetchedAt: item.priceFetchedAt,
    };
};

function Highlight({ text = "", query }) {
    const q = query.trim();
    const i = q ? text.toLowerCase().indexOf(q.toLowerCase()) : -1;
    if (i === -1) return <>{text}</>;
    return (
        <>
            {text.slice(0, i)}
            <mark className="bg-transparent font-semibold text-primary">
                {text.slice(i, i + q.length)}
            </mark>
            {text.slice(i + q.length)}
        </>
    );
}

const icon = "h-4 w-4";

const SearchIcon = () => (
    <svg viewBox="0 0 20 20" fill="none" className={icon} aria-hidden="true">
        <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="m13.5 13.5 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
);

const CloseIcon = () => (
    <svg viewBox="0 0 20 20" fill="none" className={icon} aria-hidden="true">
        <path d="m5.5 5.5 9 9m0-9-9 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
);

const PlusIcon = () => (
    <svg viewBox="0 0 20 20" fill="none" className={icon} aria-hidden="true">
        <path d="M10 4.5v11M4.5 10h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);

const CheckIcon = () => (
    <svg viewBox="0 0 20 20" fill="none" className={icon} aria-hidden="true">
        <path d="m4.5 10.5 3.5 3.5 7.5-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const TrashIcon = () => (
    <svg viewBox="0 0 20 20" fill="none" className={icon} aria-hidden="true">
        <path d="M4 6h12M8 6V4.5h4V6m-6 0 .6 9.5h6.8L14 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const Spinner = ({ className = "text-primary" }) => (
    <svg viewBox="0 0 20 20" className={`${icon} animate-spin ${className}`} aria-hidden="true">
        <circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
        <path d="M10 3a7 7 0 0 1 7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

function Message({ tone = "neutral", children }) {
    const color = tone === "error" ? "text-error" : "text-foreground-secondary";
    return <p className={`px-4 py-4 text-sm ${color}`}>{children}</p>;
}

function Badge({ stock }) {
    return (
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border bg-input text-xs font-semibold text-primary">
            {(stock.symbol || "?").slice(0, 2)}
        </span>
    );
}

/* ---------- component ---------- */

function Watchlist() {
    // search
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [searchError, setSearchError] = useState("");
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    // watchlist
    const [watchlist, setWatchlist] = useState([]);
    const [listLoading, setListLoading] = useState(true);
    const [listError, setListError] = useState("");
    const [pendingIds, setPendingIds] = useState(() => new Set()); // ids being added/removed
    const [actionError, setActionError] = useState("");

    const wrapperRef = useRef(null);
    const inputRef = useRef(null);

    const hasQuery = query.trim().length > 0;
    const watchedIds = new Set(watchlist.map((s) => s._id));

    /* ----- load watchlist ----- */
    const loadWatchlist = useCallback(async () => {
        try {
            setListLoading(true);
            setListError("");
            const response = await getWatchlist();
            const items = response.data?.data ?? [];

            setWatchlist(items.map(toSecurity).filter(Boolean));
        } catch (err) {
            console.error("Failed to load watchlist:", err);
            setListError("Couldn't load your watchlist.");
        } finally {
            setListLoading(false);
        }
    }, []);

    useEffect(() => {
        loadWatchlist();
    }, [loadWatchlist]);

    /* ----- debounced search ----- */
    useEffect(() => {
        if (!hasQuery) {
            setResults([]);
            setSearchError("");
            setSearching(false);
            setActiveIndex(-1);
            return;
        }

        let cancelled = false;

        const timer = setTimeout(async () => {
            try {
                setSearching(true);
                setSearchError("");

                const response = await searchSecurities(query);
                if (cancelled) return;

                setResults(response?.data?.data ?? []);
                setActiveIndex(-1);
            } catch (err) {
                if (cancelled) return;
                console.error("Security search failed:", err);
                setResults([]);
                setSearchError("Couldn't load results. Check your connection and try again.");
            } finally {
                if (!cancelled) setSearching(false);
            }
        }, 300);

        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [query, hasQuery]);

    /* ----- close on outside click ----- */
    useEffect(() => {
        const onPointerDown = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("pointerdown", onPointerDown);
        return () => document.removeEventListener("pointerdown", onPointerDown);
    }, []);

    /* ----- actions ----- */
    const setPending = (id, on) =>
        setPendingIds((prev) => {
            const next = new Set(prev);
            on ? next.add(id) : next.delete(id);
            return next;
        });

    const handleAdd = async (stock) => {
        if (watchedIds.has(stock._id) || pendingIds.has(stock._id)) return;

        setActionError("");
        setPending(stock._id, true);
        try {
            await addToWatchlist(stock._id);
            setWatchlist((prev) => [stock, ...prev]);
        } catch (err) {
            console.error("Add to watchlist failed:", err);
            setActionError(`Couldn't add ${stock.symbol}. Try again.`);
        } finally {
            setPending(stock._id, false);
        }
    };

    const handleRemove = async (stock) => {
        if (pendingIds.has(stock._id)) return;

        setActionError("");
        setPending(stock._id, true);
        try {
            await removeFromWatchlist(stock._id);
            setWatchlist((prev) => prev.filter((s) => s._id !== stock._id));
        } catch (err) {
            console.error("Remove from watchlist failed:", err);
            setActionError(`Couldn't remove ${stock.symbol}. Try again.`);
        } finally {
            setPending(stock._id, false);
        }
    };

    const clear = () => {
        setQuery("");
        setResults([]);
        setSearchError("");
        setActiveIndex(-1);
        inputRef.current?.focus();
    };

    const handleKeyDown = (e) => {
        if (e.key === "Escape") {
            setOpen(false);
            return;
        }
        if (!results.length) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
            setActiveIndex((i) => (i + 1) % results.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1));
        } else if (e.key === "Enter" && activeIndex >= 0) {
            e.preventDefault();
            handleAdd(results[activeIndex]);
        }
    };

    const showPanel = open && hasQuery;
    const showEmpty = !searching && !searchError && results.length === 0;

    return (
        <div className="bg-mesh min-h-screen bg-background px-4 py-10 text-foreground sm:py-16">
            <div className="mx-auto w-full max-w-xl">
                <header className="mb-6">
                    <h1 className="text-2xl font-semibold tracking-tight">Watchlist</h1>
                    <p className="mt-1 text-sm text-foreground-secondary">
                        Search by symbol or company name, then press + to add a stock.
                    </p>
                </header>

                {/* ---------- Search ---------- */}
                <div ref={wrapperRef} className="relative">
                    <div className="relative">
                        <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-foreground-secondary">
                            <SearchIcon />
                        </span>

                        <input
                            ref={inputRef}
                            type="text"
                            role="combobox"
                            aria-expanded={showPanel}
                            aria-controls="watchlist-results"
                            aria-activedescendant={
                                activeIndex >= 0 ? `stock-option-${activeIndex}` : undefined
                            }
                            aria-autocomplete="list"
                            autoComplete="off"
                            spellCheck={false}
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setOpen(true);
                            }}
                            onFocus={() => setOpen(true)}
                            onKeyDown={handleKeyDown}
                            placeholder="Search stocks…"
                            className="w-full rounded-xl border border-border bg-input py-3 pl-10 pr-11 text-sm text-foreground shadow-sm outline-none transition placeholder:text-foreground-secondary focus:border-primary focus:ring-4 focus:ring-primary/15"
                        />

                        <div className="absolute inset-y-0 right-2 flex items-center">
                            {searching ? (
                                <span className="p-1.5" role="status" aria-label="Searching">
                                    <Spinner />
                                </span>
                            ) : (
                                hasQuery && (
                                    <button
                                        type="button"
                                        onClick={clear}
                                        aria-label="Clear search"
                                        className="rounded-md p-1.5 text-foreground-secondary transition hover:bg-hover hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
                                    >
                                        <CloseIcon />
                                    </button>
                                )
                            )}
                        </div>
                    </div>

                    {showPanel && (
                        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-border bg-card shadow-xl">
                            {searchError && <Message tone="error">{searchError}</Message>}

                            {showEmpty && (
                                <Message>
                                    No stocks match “{query.trim()}”. Try a ticker symbol or a
                                    shorter name.
                                </Message>
                            )}

                            {results.length > 0 && (
                                <ul
                                    id="watchlist-results"
                                    role="listbox"
                                    className="max-h-80 overflow-y-auto py-1"
                                >
                                    {results.map((stock, index) => {
                                        const active = index === activeIndex;
                                        const added = watchedIds.has(stock._id);
                                        const pending = pendingIds.has(stock._id);

                                        return (
                                            <li
                                                key={stock._id}
                                                id={`stock-option-${index}`}
                                                role="option"
                                                aria-selected={active}
                                                onMouseEnter={() => setActiveIndex(index)}
                                                className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${
                                                    active ? "bg-hover" : ""
                                                }`}
                                            >
                                                <Badge stock={stock} />

                                                <div className="min-w-0 flex-1">
                                                    <div className="truncate text-sm font-semibold">
                                                        <Highlight text={stock.symbol} query={query} />
                                                    </div>
                                                    <div className="truncate text-xs text-foreground-secondary">
                                                        <Highlight text={stock.companyName} query={query} />
                                                    </div>
                                                </div>

                                                <span className="hidden shrink-0 rounded-md border border-border px-2 py-0.5 text-xs text-foreground-secondary sm:inline">
                                                    {stock.exchange}
                                                </span>

                                                <button
                                                    type="button"
                                                    tabIndex={-1}
                                                    onClick={() => handleAdd(stock)}
                                                    disabled={added || pending}
                                                    aria-label={
                                                        added
                                                            ? `${stock.symbol} is in your watchlist`
                                                            : `Add ${stock.symbol} to watchlist`
                                                    }
                                                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                                                        added
                                                            ? "cursor-default text-success"
                                                            : "bg-primary text-primary-foreground hover:bg-primary-hover disabled:opacity-70"
                                                    }`}
                                                >
                                                    {pending ? (
                                                        <Spinner className="text-primary-foreground" />
                                                    ) : added ? (
                                                        <CheckIcon />
                                                    ) : (
                                                        <PlusIcon />
                                                    )}
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}

                            {results.length > 0 && (
                                <div className="hidden items-center gap-3 border-t border-border px-4 py-2 text-xs text-foreground-secondary sm:flex">
                                    <span>↑↓ to move</span>
                                    <span>Enter to add</span>
                                    <span>Esc to close</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {actionError && (
                    <p role="alert" className="mt-3 text-sm text-error">
                        {actionError}
                    </p>
                )}

                {/* ---------- Watchlist ---------- */}
                <section className="mt-8" aria-labelledby="watchlist-heading">
                    <div className="mb-3 flex items-baseline justify-between">
                        <h2 id="watchlist-heading" className="text-sm font-semibold">
                            Watchlist
                        </h2>
                        {!listLoading && !listError && (
                            <span className="text-xs text-foreground-secondary">
                                {watchlist.length} {watchlist.length === 1 ? "stock" : "stocks"}
                            </span>
                        )}
                    </div>

                    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                        {listLoading && (
                            <ul aria-busy="true">
                                {[0, 1, 2].map((n) => (
                                    <li
                                        key={n}
                                        className="flex animate-pulse items-center gap-3 border-b border-border px-4 py-3 last:border-b-0"
                                    >
                                        <div className="h-9 w-9 rounded-lg bg-hover" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-3 w-20 rounded bg-hover" />
                                            <div className="h-3 w-40 rounded bg-hover" />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {!listLoading && listError && (
                            <div className="flex items-center justify-between gap-3 px-4 py-4">
                                <p className="text-sm text-error">{listError}</p>
                                <button
                                    type="button"
                                    onClick={loadWatchlist}
                                    className="rounded-lg border border-border px-3 py-1.5 text-sm transition hover:bg-hover focus-visible:outline-2 focus-visible:outline-primary"
                                >
                                    Retry
                                </button>
                            </div>
                        )}

                        {!listLoading && !listError && watchlist.length === 0 && (
                            <Message>
                                Your watchlist is empty. Search above and press + to add your
                                first stock.
                            </Message>
                        )}

                        {!listLoading && !listError && watchlist.length > 0 && (
                            <ul>
                                {watchlist.map((stock) => {
                                    const pending = pendingIds.has(stock._id);
                                    return (
                                        <li
                                            key={stock._id}
                                            className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-b-0"
                                        >
                                            <Badge stock={stock} />

                                            <div className="min-w-0 flex-1">
                                                <div className="truncate text-sm font-semibold">
                                                    {stock.symbol}
                                                </div>
                                                <div className="truncate text-xs text-foreground-secondary">
                                                    {stock.companyName}
                                                </div>
                                                <div className="mt-1 text-sm font-medium">
                                                    {stock.currentPrice != null
                                                        ? `₹${stock.currentPrice.toFixed(2)}`
                                                        : "Price unavailable"}
                                                </div>
                                            </div>

                                            <span className="hidden shrink-0 rounded-md border border-border px-2 py-0.5 text-xs text-foreground-secondary sm:inline">
                                                {stock.exchange}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() => handleRemove(stock)}
                                                disabled={pending}
                                                aria-label={`Remove ${stock.symbol} from watchlist`}
                                                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-foreground-secondary transition hover:bg-hover hover:text-error focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-60"
                                            >
                                                {pending ? <Spinner /> : <TrashIcon />}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Watchlist;