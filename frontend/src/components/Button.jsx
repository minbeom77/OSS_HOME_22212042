export default function Button({ children, onClick, variant = "primary", disabled = false, className = "" }) {
  const base = "py-3 px-6 rounded-xl text-sm font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-[#BA7517] text-white hover:bg-[#8E5912] cursor-pointer",
    secondary: "bg-transparent text-[#7A7466] border border-[#D3D1C7] hover:bg-[#F7E6D0] cursor-pointer",
    ghost: "bg-[#F7E6D0] text-[#BA7517] border border-[#BA7517] hover:bg-[#f0d4b0] cursor-pointer",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
