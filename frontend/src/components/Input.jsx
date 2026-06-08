import { useState } from "react";

export default function Input({ value, onChange, suffix, type = "number", placeholder, onKeyDown }) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`w-full py-2 px-3 rounded-xl text-sm text-[#3D3A33] outline-none transition-all duration-150 box-border
          ${suffix ? "pr-9" : ""}
          ${focused
            ? "bg-white border-2 border-[#BA7517] shadow-[0_0_0_3px_#F7E6D0]"
            : "bg-[#F1EFE8] border border-[#D3D1C7]"
          }
        `}
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#B0A996]">
          {suffix}
        </span>
      )}
    </div>
  );
}
