export default function StepBar({ current }) {
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <div
          key={s}
          className={`w-7 h-1 rounded-sm transition-all duration-300
            ${s < current ? "bg-[#4A7047]" : s === current ? "bg-[#BA7517]" : "bg-[#D3D1C7]"}
          `}
        />
      ))}
    </div>
  );
}
