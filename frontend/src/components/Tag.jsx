export default function Tag({ type }) {
  const cfg = {
    ALL: { className: "bg-[#E9F0E8] text-[#085041]", label: "ALL 옵션" },
    NO_COOKING: { className: "bg-[#FAEDCD] text-[#633806]", label: "밀키트·배달" },
    DELIVERY_ONLY: { className: "bg-[#FAECE7] text-[#712B13]", label: "배달 전용" },
  }[type] || {};

  return (
    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}
