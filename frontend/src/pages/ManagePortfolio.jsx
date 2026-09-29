import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Pencil, Search, X, Loader2 } from "lucide-react";

import {
    getPortfolio,
    deletePortfolioById,
    addHolding,
    updateHolding,
    deleteHoldingBySymbol,
} from "../api/portfolioAPI";
import { searchSecurities } from "../api/securitiesAPI";

/* ---------- small helpers ---------- */

const btn =
    "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition disabled:opacity-60";
const btnPrimary = `${btn} bg-primary text-primary-foreground hover:bg-primary-hover`;
const btnGhost = `${btn} border border-border hover:bg-hover`;
const btnDanger = `${btn} bg-red-600 text-white hover:bg-red-700`;
const inputCls =
    "w-full rounded-xl border border-border bg-input px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/15";

const serverMessage = (err, fallback) =>
    err?.response?.data?.message || err?.response?.data?.error || fallback;

function ConfirmDialog({ open, title, message, onCancel, onConfirm, busy }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
            <div className="w-full max-w-sm rounded-xl border border-border bg-card p-5 shadow-xl">
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-foreground-secondary">{message}</p>
                <div className="mt-5 flex justify-end gap-2">
                    <button className={btnGhost} onClick={onCancel} disabled={busy}>
                        Cancel
                    </button>
                    <button className={btnDanger} onClick={onConfirm} disabled={busy}>
                        {busy && <Loader2 size={16} className="animate-spin" />}
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ---------- page ---------- */

export default function ManagePortfolio() {
    const navigate = useNavigate();
    const { portfolioId } = useParams();

    // portfolio
    const [portfolio, setPortfolio] = useState(null);
    const [holdings, setHoldings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("");
    const [pageError, setPageError] = useState("");

    // add / edit form
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [picked, setPicked] = useState(null);
    const [quantity, setQuantity] = useState("");
    const [purchasePrice, setPurchasePrice] = useState("");
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState("");

    // security search
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [searchError, setSearchError] = useState("");
    const [searchOpen, setSearchOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const searchRef = useRef(null);

    // deletes
    const [holdingToDelete, setHoldingToDelete] = useState(null);
    const [confirmPortfolio, setConfirmPortfolio] = useState(false);
    const [deleting, setDeleting] = useState(false);

    /* ----- load portfolio ----- */
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const res = await getPortfolio(portfolioId);
                const data = res.data.portfolio;
                setPortfolio(data);
                setHoldings(data.holdings || []);
            } catch (err) {
                console.error("Error fetching portfolio:", err);
            } finally {
                setLoading(false);
            }
        })();
    }, [portfolioId]);

    /* ----- debounced security search ----- */
    useEffect(() => {
        const q = query.trim();
        if (!q || picked) {
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
                const res = await searchSecurities(q);
                if (cancelled) return;
                setResults(res?.data?.data ?? []);
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
    }, [query, picked]);

    /* ----- close dropdown on outside click ----- */
    useEffect(() => {
        const onDown = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setSearchOpen(false);
            }
        };
        document.addEventListener("pointerdown", onDown);
        return () => document.removeEventListener("pointerdown", onDown);
    }, []);

    /* ----- derived ----- */
    const filteredHoldings = useMemo(
        () =>
            holdings.filter((h) =>
                h.symbol.toLowerCase().includes(filter.toLowerCase())
            ),
        [holdings, filter]
    );

    const heldSymbols = useMemo(
        () => new Set(holdings.map((h) => h.symbol)),
        [holdings]
    );

    /* ----- form open / close ----- */
    const resetForm = () => {
        setEditing(null);
        setPicked(null);
        setQuery("");
        setResults([]);
        setQuantity("");
        setPurchasePrice("");
        setFormError("");
    };

    const openAdd = () => {
        resetForm();
        setFormOpen(true);
    };

    const openEdit = (holding) => {
        resetForm();
        setEditing(holding);
        setPicked({ symbol: holding.symbol });
        setQuantity(String(holding.quantity ?? ""));
        setPurchasePrice(String(holding.purchasePrice ?? ""));
        setFormOpen(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const closeForm = () => {
        resetForm();
        setFormOpen(false);
    };

    const pickSecurity = (stock) => {
        if (heldSymbols.has(stock.symbol)) {
            setFormError(`${stock.symbol} is already in this portfolio. Edit it instead.`);
            return;
        }
        setFormError("");
        setPicked(stock);
        setQuery("");
        setResults([]);
        setSearchOpen(false);
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === "Enter") e.preventDefault();
        if (e.key === "Escape") return setSearchOpen(false);
        if (!results.length) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => (i + 1) % results.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1));
        } else if (e.key === "Enter" && activeIndex >= 0) {
            pickSecurity(results[activeIndex]);
        }
    };

    /* ----- save (add / update) ----- */
    const handleSave = async (e) => {
        e.preventDefault();
        setFormError("");

        const qty = Number(quantity);
        const price = Number(purchasePrice);

        if (!picked) return setFormError("Search and select a stock first.");
        if (!Number.isInteger(qty) || qty < 1)
            return setFormError("Quantity must be a whole number, at least 1.");
        if (purchasePrice === "" || !(price >= 0))
            return setFormError("Enter a valid purchase price.");

        // investedAmount is derived (quantity * purchasePrice); compute it in the backend controller.
        const payload = {
            securityId: picked._id,
            symbol: picked.symbol,
            quantity: qty,
            purchasePrice: price,
        };

        try {
            setSaving(true);
            if (editing) {
                const res = await updateHolding(portfolioId, editing.symbol, payload);
                const updated = res.data.holding;
                setHoldings((prev) =>
                    prev.map((h) => (h.symbol === editing.symbol ? updated : h))
                );
            } else {
                const res = await addHolding(portfolioId, payload);
                setHoldings((prev) => [...prev, res.data.holding]);
            }
            closeForm();
        } catch (err) {
            console.error("Error saving holding:", err.response?.data);
            setFormError(
                serverMessage(err, "Couldn't save the holding. Please try again.")
            );
        } finally {
            setSaving(false);
        }
    };

    /* ----- deletes ----- */
    const handleDeleteHolding = async () => {
        if (!holdingToDelete) return;
        try {
            setDeleting(true);
            await deleteHoldingBySymbol(portfolioId, holdingToDelete.symbol);
            setHoldings((prev) =>
                prev.filter((h) => h.symbol !== holdingToDelete.symbol)
            );
            setHoldingToDelete(null);
        } catch (err) {
            console.error("Error deleting holding:", err.response?.data);
            setPageError(serverMessage(err, `Couldn't delete ${holdingToDelete.symbol}.`));
            setHoldingToDelete(null);
        } finally {
            setDeleting(false);
        }
    };

    const handleDeletePortfolio = async () => {
        try {
            setDeleting(true);
            await deletePortfolioById(portfolioId);
            navigate("/manage");
        } catch (err) {
            console.error("Error deleting portfolio:", err.response?.data);
            setPageError(serverMessage(err, "Couldn't delete the portfolio."));
            setConfirmPortfolio(false);
        } finally {
            setDeleting(false);
        }
    };

    /* ----- states ----- */
    if (loading) {
        return (
            <div className="grid min-h-screen place-items-center">
                <Loader2 className="animate-spin text-primary" />
            </div>
        );
    }

    if (!portfolio) {
        return (
            <div className="mx-auto max-w-6xl p-6">
                <p className="text-foreground-secondary">Portfolio not found.</p>
                <button className={`${btnGhost} mt-4`} onClick={() => navigate("/manage")}>
                    <ArrowLeft size={18} /> Back
                </button>
            </div>
        );
    }

    const showDropdown = searchOpen && query.trim() && !picked;

    /* ----- UI ----- */
    return (
        <div className="mx-auto min-h-screen max-w-6xl p-6">
            <button className={btnGhost} onClick={() => navigate("/manage")}>
                <ArrowLeft size={18} /> Back
            </button>

            {/* Header */}
            <div className="mt-8 flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-foreground">{portfolio.name}</h1>
                    <p className="mt-2 text-foreground-secondary">{portfolio.description}</p>
                </div>
                {!formOpen && (
                    <button className={btnPrimary} onClick={openAdd}>
                        <Plus size={18} /> Add Holding
                    </button>
                )}
            </div>

            {pageError && (
                <p role="alert" className="mt-4 text-sm text-red-500">
                    {pageError}
                </p>
            )}

            {/* Add / Edit form (inline) */}
            {formOpen && (
                <form
                    onSubmit={handleSave}
                    className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm"
                >
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold">
                            {editing ? `Edit ${editing.symbol}` : "Add Holding"}
                        </h2>
                        <button
                            type="button"
                            onClick={closeForm}
                            aria-label="Close form"
                            className="rounded-md p-1.5 hover:bg-hover"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Security picker */}
                    <label className="mb-1 block text-sm font-medium">Stock</label>

                    {picked ? (
                        <div className="flex items-center justify-between rounded-xl border border-border bg-input px-3 py-2.5">
                            <div className="min-w-0">
                                <span className="font-semibold">{picked.symbol}</span>
                                {picked.companyName && (
                                    <span className="ml-2 truncate text-sm text-foreground-secondary">
                                        {picked.companyName}
                                    </span>
                                )}
                            </div>
                            {!editing && (
                                <button
                                    type="button"
                                    onClick={() => setPicked(null)}
                                    className="text-sm text-primary hover:underline"
                                >
                                    Change
                                </button>
                            )}
                        </div>
                    ) : (
                        <div ref={searchRef} className="relative">
                            <Search
                                size={16}
                                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-secondary"
                            />
                            <input
                                type="text"
                                role="combobox"
                                aria-expanded={!!showDropdown}
                                aria-controls="holding-search-results"
                                autoComplete="off"
                                spellCheck={false}
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setSearchOpen(true);
                                }}
                                onFocus={() => setSearchOpen(true)}
                                onKeyDown={handleSearchKeyDown}
                                placeholder="Search by symbol or company name…"
                                className={`${inputCls} pl-10 pr-10`}
                            />
                            {searching && (
                                <Loader2
                                    size={16}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 animate-spin text-primary"
                                />
                            )}

                            {showDropdown && (
                                <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-border bg-card shadow-xl">
                                    {searchError && (
                                        <p className="px-4 py-3 text-sm text-red-500">{searchError}</p>
                                    )}

                                    {!searching && !searchError && results.length === 0 && (
                                        <p className="px-4 py-3 text-sm text-foreground-secondary">
                                            No stocks match “{query.trim()}”.
                                        </p>
                                    )}

                                    {results.length > 0 && (
                                        <ul
                                            id="holding-search-results"
                                            role="listbox"
                                            className="max-h-72 overflow-y-auto py-1"
                                        >
                                            {results.map((stock, i) => {
                                                const held = heldSymbols.has(stock.symbol);
                                                return (
                                                    <li
                                                        key={stock._id ?? stock.symbol}
                                                        role="option"
                                                        aria-selected={i === activeIndex}
                                                        onMouseEnter={() => setActiveIndex(i)}
                                                        onClick={() => pickSecurity(stock)}
                                                        className={`flex cursor-pointer items-center gap-3 px-4 py-2.5 ${
                                                            i === activeIndex ? "bg-hover" : ""
                                                        } ${held ? "opacity-50" : ""}`}
                                                    >
                                                        <div className="min-w-0 flex-1">
                                                            <div className="truncate text-sm font-semibold">
                                                                {stock.symbol}
                                                            </div>
                                                            <div className="truncate text-xs text-foreground-secondary">
                                                                {stock.companyName}
                                                            </div>
                                                        </div>
                                                        <span className="text-xs text-foreground-secondary">
                                                            {held ? "Already added" : stock.exchange}
                                                        </span>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Quantity + price */}
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium">Quantity</label>
                            <input
                                type="number"
                                min="1"
                                step="1"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                className={inputCls}
                                placeholder="e.g. 10"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Purchase price
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="any"
                                value={purchasePrice}
                                onChange={(e) => setPurchasePrice(e.target.value)}
                                className={inputCls}
                                placeholder="e.g. 2450.50"
                            />
                        </div>
                    </div>

                    {formError && (
                        <p role="alert" className="mt-3 text-sm text-red-500">
                            {formError}
                        </p>
                    )}

                    <div className="mt-5 flex justify-end gap-2">
                        <button type="button" className={btnGhost} onClick={closeForm}>
                            Cancel
                        </button>
                        <button type="submit" className={btnPrimary} disabled={saving}>
                            {saving && <Loader2 size={16} className="animate-spin" />}
                            {editing ? "Save Changes" : "Add Holding"}
                        </button>
                    </div>
                </form>
            )}

            {/* Filter existing holdings */}
            <div className="my-8">
                <div className="relative">
                    <Search
                        size={16}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-secondary"
                    />
                    <input
                        type="text"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        placeholder="Search Holdings..."
                        className={`${inputCls} pl-10`}
                    />
                </div>
            </div>

            {/* Holdings */}
            <div className="space-y-3">
                {filteredHoldings.length === 0 && (
                    <p className="text-sm text-foreground-secondary">
                        {holdings.length === 0
                            ? "No holdings yet. Click “Add Holding” to get started."
                            : "No holdings match your search."}
                    </p>
                )}

                {filteredHoldings.map((h) => (
                    <div
                        key={h.symbol}
                        className="flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-3 shadow-sm"
                    >
                        <div className="min-w-0 flex-1">
                            <div className="truncate font-semibold">{h.symbol}</div>
                        </div>

                        <div className="hidden text-right text-sm sm:block">
                            <div>Qty: {h.quantity}</div>
                            <div className="text-foreground-secondary">
                                Price: {h.purchasePrice}
                            </div>
                            <div className="text-foreground-secondary">
                                Invested: {h.investedAmount ?? h.quantity * h.purchasePrice}
                            </div>
                        </div>

                        <button
                            onClick={() => openEdit(h)}
                            aria-label={`Edit ${h.symbol}`}
                            className="rounded-lg p-2 text-foreground-secondary hover:bg-hover hover:text-foreground"
                        >
                            <Pencil size={16} />
                        </button>
                        <button
                            onClick={() => setHoldingToDelete(h)}
                            aria-label={`Delete ${h.symbol}`}
                            className="rounded-lg p-2 text-foreground-secondary hover:bg-hover hover:text-red-500"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Delete portfolio */}
            <div className="mt-10 flex justify-end">
                <button className={btnDanger} onClick={() => setConfirmPortfolio(true)}>
                    <Trash2 size={18} /> Delete Portfolio
                </button>
            </div>

            <ConfirmDialog
                open={!!holdingToDelete}
                title="Delete Holding"
                message={
                    holdingToDelete
                        ? `Are you sure you want to delete ${holdingToDelete.symbol}?`
                        : ""
                }
                busy={deleting}
                onCancel={() => setHoldingToDelete(null)}
                onConfirm={handleDeleteHolding}
            />

            <ConfirmDialog
                open={confirmPortfolio}
                title="Delete Portfolio"
                message="All holdings inside this portfolio will also be deleted."
                busy={deleting}
                onCancel={() => setConfirmPortfolio(false)}
                onConfirm={handleDeletePortfolio}
            />
        </div>
    );
}