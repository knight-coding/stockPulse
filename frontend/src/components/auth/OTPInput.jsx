import { useRef } from "react";

export default function OTPInput({ length = 6, value, onChange }) {
    const inputsRef = useRef([]);

    const digits = value.split("").concat(Array(length).fill("")).slice(0, length);

    const setDigit = (index, digit) => {
        const next = [...digits];
        next[index] = digit;
        onChange(next.join(""));
    };

    const handleChange = (e, index) => {
        const raw = e.target.value.replace(/\D/g, "");
        if (!raw) {
            setDigit(index, "");
            return;
        }
        setDigit(index, raw[raw.length - 1]);
        if (index < length - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !digits[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
        if (!pasted) return;
        onChange(pasted.padEnd(length, "").slice(0, length).trimEnd());
        const nextIndex = Math.min(pasted.length, length - 1);
        inputsRef.current[nextIndex]?.focus();
    };

    return (
        <div className="flex gap-2.5 justify-between" onPaste={handlePaste}>
            {digits.map((digit, index) => (
                <input
                    key={index}
                    ref={(el) => (inputsRef.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-11 h-12 rounded-lg bg-[#131A24] border border-[#1F2937]
                    text-center text-lg font-mono text-[#E8EDF2] outline-none
                    focus:border-[#00D9A0]/70 transition-colo[rs duration-150"
                />
            ))}
        </div>
    );
}