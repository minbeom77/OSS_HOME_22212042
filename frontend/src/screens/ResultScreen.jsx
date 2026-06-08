import React from "react";
import Button from "../components/Button"; 
import StepBar from "../components/StepBar";

const CAT_ICONS = {
  한식: "🍚",
  일식: "🍣",
  중식: "🥢",
  양식: "🍝",
  프랜차이즈: "⏱️",
};

export default function ResultScreen({ cat, menu, costs, onNext, onBack }) {
  const { delivery, mealkit, cooking, best, breakdown } = costs || {};

  const opts = [
    { key: "delivery", label: "배달 주문", cost: delivery || 0, icon: "🛵", color: "bg-[#D85A30]" },
  ];
  
  if (mealkit !== null && mealkit !== undefined) {
    opts.push({ key: "mealkit", label: "밀키트 조리", cost: mealkit, icon: "📦", color: "bg-[#4A7047]" });
  }
  if (cooking !== null && cooking !== undefined) {
    opts.push({ key: "cooking", label: "직접 요리", cost: cooking, icon: "🍳", color: "bg-[#D4A373]" });
  }

  const maxCost = Math.max(...opts.map(o => o.cost), 1);
  const bestOpt = opts.find(o => o.key === best);
  const netSaving = (delivery || 0) - (bestOpt ? bestOpt.cost : (delivery || 0));
  const targetMenu = Array.isArray(menu) ? (menu[0] || {}) : (menu || {});

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <span className="text-lg font-bold text-[#BA7517] tracking-wider select-none">H.O.M.E</span>
        <StepBar current={4} />
      </div>

      <div className="inline-flex items-center gap-1.5 bg-[#F7E6D0] rounded-full px-3.5 py-1.5 mb-2 shadow-sm border border-[#F4DCBF]">
        <span>{CAT_ICONS[cat] || "🍔"}</span>
        <span className="text-xs font-semibold text-[#8E5912]">
          {targetMenu.name || "선택 메뉴"} {Array.isArray(menu) && menu.length > 1 ? `외 ${menu.length - 1}개` : ""} · {cat}
        </span>
      </div>

      <h2 className="text-2xl font-bold text-[#3D3A33] mb-4 tracking-tight">비용 비교 결과</h2>

      <h3 className="text-base font-bold text-[#3D3A33] mb-4 flex items-center gap-1.5">
        <span className="w-1.5 h-3.5 bg-[#BA7517] rounded-full"></span>
        총 비용 비교
      </h3>

      <div className="bg-white border border-[#E9E4D9] rounded-2xl p-6 mb-5 shadow-sm">
        <p className="text-[11px] font-semibold text-[#A39C8A] mb-4 tracking-wide uppercase">한 끼 식사 기준 예상 지출 비용</p>
        {opts.map(o => (
          <div key={o.key} className="mb-5 last:mb-0">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg select-none">{o.icon}</span>
                <span className={`text-sm ${o.key === best ? "font-bold text-[#4A7047]" : "font-medium text-[#5C584E]"}`}>
                  {o.label}
                </span>
                {o.key === best && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E9F0E8] text-[#085041] font-bold border border-[#D5E5D2]">
                    최적의 대안 ✓
                  </span>
                )}
              </div>
              <span className="text-sm font-bold text-[#3D3A33]">{o.cost.toLocaleString()}원</span>
            </div>
            <div className="h-2.5 bg-[#FCF9F2] rounded-full overflow-hidden border border-[#E9E4D9]">
              <div
                className={`h-full rounded-full transition-all duration-700 ${o.key === best ? "bg-[#4A7047]" : o.color}`}
                style={{ width: `${(o.cost / maxCost) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#E9F0E8] border border-[#C6DCBF] rounded-2xl px-6 py-4.5 mb-6 flex justify-between items-center shadow-sm">
        <div>
          <p className="text-sm font-bold text-[#085041]">가장 경제적인 선택</p>
          <p className="text-xs text-[#2A6B53] mt-0.5">
            {best === "delivery" ? "배달보다 더 저렴한 대안이 없습니다." : `[${bestOpt?.label || "최적 대안"}] 이용 시 배달 대비 금액을 절약할 수 있습니다.`}
          </p>
        </div>
        <p className="text-2xl font-black text-[#085041] tracking-tight">
          {netSaving > 0 ? `${netSaving.toLocaleString()}원 절약` : "동일"}
        </p>
      </div>

      <h3 className="text-base font-bold text-[#3D3A33] mb-4 flex items-center gap-1.5">
        <span className="w-1.5 h-3.5 bg-[#BA7517] rounded-full"></span>
        지출 항목별 상세 내역
      </h3>
      
      {breakdown && (
        <div className="bg-white border border-[#E9E4D9] rounded-2xl px-6 py-5 mb-8 shadow-sm">
          <p className="text-[11px] font-semibold text-[#A39C8A] mb-4 tracking-wide uppercase">수단별 지출 비용 분석 결과</p>
          {Object.entries(breakdown).map(([key, items]) => {
            const opt = opts.find(o => o.key === key);
            if (!opt || !items || !items.length) return null;
            return (
              <div key={key} className="mb-5 last:mb-0 pb-1 border-b border-[#FCF9F2] last:border-b-0">
                <div className="flex items-center gap-1.5 text-sm font-bold text-[#3D3A33] mb-2.5">
                  <span className="select-none">{opt.icon}</span>
                  <span>{opt.label} 비용 구성</span>
                </div>
                {items
                  .filter(item => !item.label.includes("최소주문금액"))
                  .map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-xs py-2 text-[#7A7466] border-b border-dashed border-[#F1EFE8] last:border-0">
                      <span className="font-medium text-[#6B6554]">{item.label}</span>
                      <span className="text-[#3D3A33] font-semibold">{item.value.toLocaleString()}원</span>
                    </div>
                  ))}
              </div>
            );
          })}
        </div>
      )}

      <div className="flex justify-between gap-3 pt-6 border-t border-[#E9E4D9]">
        <Button variant="secondary" onClick={onBack} className="w-auto px-6 py-3 font-bold text-sm rounded-xl border-[#D3D1C7] text-[#5C584E] hover:bg-[#F1EFE8] transition-all">
          ← 다시 분석
        </Button>
        <Button onClick={onNext} className="w-auto px-6 py-3 font-bold text-sm rounded-xl bg-[#BA7517] hover:bg-[#8E5912] text-white shadow-md hover:shadow-lg transition-all">
          리포트 보기 →
        </Button>
      </div>
    </div>
  );
}