import React, { useState, useEffect } from "react";
import Button from "../components/Button"; 
import StepBar from "../components/StepBar";

export default function ResultScreen({ cat, menu, costs, onNext, onBack }) {
  const { delivery, mealkit, cooking, best, breakdown } = costs || {};
  const [selectedOption, setSelectedOption] = useState(best || "delivery");

  useEffect(() => {
    if (best) setSelectedOption(best);
  }, [best]);
  const opts = [
    { 
      key: "delivery", label: "배달 주문", cost: delivery || 0, icon: "🛵", 
      color: "bg-[#D85A30]", textColor: "text-[#D85A30]", 
      borderColor: "border-[#D85A30]", lightBg: "bg-[#FAECE7]", ringColor: "ring-[#F5C4B0]" 
    },
  ];
  
  if (mealkit !== null && mealkit !== undefined) {
    opts.push({ 
      key: "mealkit", label: "밀키트 조리", cost: mealkit, icon: "📦", 
      color: "bg-[#4A7047]", textColor: "text-[#4A7047]", 
      borderColor: "border-[#4A7047]", lightBg: "bg-[#E9F0E8]", ringColor: "ring-[#C6DCBF]" 
    });
  }
  if (cooking !== null && cooking !== undefined) {
    opts.push({ 
      key: "cooking", label: "직접 요리", cost: cooking, icon: "🍳", 
      color: "bg-[#BA7517]", textColor: "text-[#BA7517]", 
      borderColor: "border-[#BA7517]", lightBg: "bg-[#FAEDCD]", ringColor: "ring-[#F0D4B0]" 
    });
  }

  const maxCost = Math.max(...opts.map(o => o.cost), 1);

  const selectedOptData = opts.find(o => o.key === selectedOption) || opts[0];

  return (
    <div className="max-w-xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <span className="text-lg font-bold text-[#BA7517] tracking-wider select-none">H.O.M.E</span>
        <StepBar current={4} />
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#3D3A33] tracking-tight mb-1">비용 연산 결과</h2>
        <p className="text-sm text-[#7A7466]">가장 합리적인 식사 방식을 탭하여 선택한 후 리포트를 완성하세요.</p>
      </div>

      <div className="space-y-3.5 mb-8">
        {opts.map((o) => {
          const isSelected = selectedOption === o.key;
          const isBest = best === o.key;

          return (
            <div
              key={o.key}
              onClick={() => setSelectedOption(o.key)} 
              className={`relative rounded-2xl p-5 border-2 transition-all duration-300 cursor-pointer select-none shadow-sm
                ${isSelected 
                  ? `${o.borderColor} ${o.lightBg} scale-[1.01] ring-4 ${o.ringColor}/50` 
                  : "bg-white border-[#E9E4D9] hover:border-[#B0A996]"
                }
              `}
            >
              {isBest && (
                <span className={`absolute top-3 right-4 text-[10px] ${o.lightBg} ${o.textColor} font-black px-2 py-0.5 rounded-full tracking-wide`}>
                  ★ 최고 대안 추천
                </span>
              )}

              <div className={`absolute bottom-4 right-4 w-5 h-5 rounded-full border flex items-center justify-center bg-white ${isSelected ? o.borderColor : 'border-[#D3D1C7]'}`}>
                {isSelected && <div className={`w-2.5 h-2.5 rounded-full ${o.color}`} />}
              </div>

              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{o.icon}</span>
                <div>
                  <h3 className={`text-sm font-bold ${isSelected ? o.textColor : 'text-[#3D3A33]'}`}>{o.label}</h3>
                  <p className="text-xs text-[#7A7466] mt-0.5">최종 산출 비용</p>
                </div>
                <div className="ml-auto text-right pr-6">
                  <span className="text-base font-black text-[#3D3A33]">{o.cost.toLocaleString()}원</span>
                </div>
              </div>

              <div className={`h-2 ${isSelected ? 'bg-white/60' : o.lightBg} rounded-full overflow-hidden`}>
                <div 
                  className={`h-full rounded-full transition-all duration-700 ${o.color}`}
                  style={{ width: `${(o.cost / maxCost) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {breakdown && breakdown[selectedOption] && (
        <div className="mb-8">
          <h3 className="text-xs font-bold text-[#7A7466] mb-3 uppercase tracking-wider flex items-center gap-1.5">
            <span className="text-base">{selectedOptData.icon}</span> {selectedOptData.label} 세부 명세서
          </h3>
          <div className={`rounded-2xl p-5 space-y-3 transition-colors duration-300 border ${selectedOptData.lightBg} ${selectedOptData.borderColor} border-opacity-40 shadow-inner`}>
            {breakdown[selectedOption].map((item, idx) => (
              <div key={idx} className="flex justify-between text-xs my-1">
                <span className="text-[#7A7466]">
                  {item?.label?.includes("최소주문금액") ? "최소주문 미달 분 부족 금액" : item?.label || "비용 항목"}
                </span>
                <span className="font-semibold text-[#3D3A33]">{(item?.value || 0).toLocaleString()}원</span>
              </div>
            ))}
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-black/10">
              <span className="text-xs font-bold text-[#3D3A33]">총 산출 비용</span>
              <span className={`text-sm font-black ${selectedOptData.textColor}`}>
                {breakdown[selectedOption].reduce((sum, item) => sum + (item?.value || 0), 0).toLocaleString()}원
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-4 pt-5 border-t border-[#E9E4D9]">
        <Button 
          variant="secondary" 
          onClick={onBack} 
          className="flex-1 py-3.5 font-bold text-sm rounded-xl border-[#D3D1C7] text-[#5C584E] hover:bg-[#F1EFE8] transition-all text-center"
        >
          ← 다시 분석
        </Button>
        
        <Button 
          onClick={() => onNext(selectedOption)} 
          className="flex-1 py-3.5 font-bold text-sm rounded-xl bg-[#BA7517] hover:bg-[#8E5912] text-white transition-all shadow-md text-center"
        >
          {selectedOptData.label} 선택 완료 →
        </Button>
      </div>
    </div>
  );
}