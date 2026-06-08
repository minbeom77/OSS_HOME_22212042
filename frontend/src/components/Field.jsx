export default function Field({ label, children }) {
  return (
    <div className="mb-3">
      <div className="text-xs text-[#7A7466] font-medium mb-1.5">{label}</div>
      {children}
    </div>
  );
}
