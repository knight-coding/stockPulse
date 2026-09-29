import { useState } from "react";

export default function PasswordInput({
    label = "Password",
    id,
    value,
    onChange,
    placeholder = "••••••••",
    error,
    autoComplete = "current-password",
}) {
    const [visible, setVisible] = useState(false);

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={id}
                    className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[#7A8699]"
                >
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    id={id}
                    type={visible ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    className={`w-full rounded-lg bg-[#131A24] border px-3.5 py-2.5 pr-11 text-sm text-[#E8EDF2]
            placeholder:text-[#7A8699]/70 outline-none transition-colors duration-150
            focus:border-[#00D9A0]/70
            ${error ? "border-[#FF4D6A]" : "border-[#1F2937]"}`}
                />
                <button
                    type="button"
                    onClick={() => setVisible((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7A8699] hover:text-[#E8EDF2] transition-colors"
                    tabIndex={-1}
                >
                    {visible ? "Hide" : "Show"}
                </button>
            </div>
            {error && <p className="mt-1.5 text-xs text-[#FF4D6A]">{error}</p>}
        </div>
    );
}