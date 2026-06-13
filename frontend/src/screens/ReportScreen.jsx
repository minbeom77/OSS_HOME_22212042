import React from "react";
import StepBar from "../components/StepBar";
import Button from "../components/Button";

export default function ReportScreen({ logs, isGuest, onNewAnalysis, onGoToSignUp }) {
  const safeLogs = logs || [];
  const totalSaving = safeLogs.reduce((s, l) => s + (l.saving || 0), 0);
  const maxSaving = Math.max(...safeLogs.map(l => l.saving || 0), 1);

  const suggestions = [
    { threshold: 50000, msg: "OTT 구독 3개월치를 낼 수 있어요! 🎬" },
    { threshold: 30000, msg: "아이스 아메리카노 15잔을 마실 수 있어요! ☕" },
    { threshold: 10000, msg: "편의점 간식을 마음껏 살 수 있어요! 🍫" },
    { threshold: 0, msg: "조금씩 쌓이고 있어요! 계속해봐요 💪" },
  ];
  const currentMessage = suggestions.find(s => totalSaving >= s.threshold)?.msg || suggestions[3].msg;

  const getOptionLabel = (opt) => opt === 'delivery' ? '배달' : opt === 'mealkit' ? '밀키트' : '직접요리';
  const getBadgeStyle = (opt) => opt === 'delivery' ? 'bg-[#FAECE7] text-[#D85A30] border-[#F5C4B0]' : opt === 'mealkit' ? 'bg-[#E9F0E8] text-[#4A7047] border-[#C6DCBF]' : 'bg-[#FAEDCD] text-[#BA7517] border-[#F0D4B0]';
  const getBarColor = (opt) => opt === 'delivery' ? 'bg-[#D85A30]' : opt === 'mealkit' ? 'bg-[#4A7047]' : 'bg-[#BA7517]';

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <span className="text-lg font-bold text-[#BA7517] tracking-wider select-none">H.O.M.E</span>
        <StepBar current={5} />
      </div>

      <h2 className="text-2xl font-bold text-[#3D3A33] mb-2 tracking-tight">Hidden Opportunity Report</h2>
      <p className="text-sm text-[#7A7466] mb-8">내가 아낀 비용과 경제적 가치를 확인하세요.</p>

      <div className="bg-[#BA7517] rounded-3xl p-8 text-white mb-8 shadow-[0_10px_25px_rgba(186,117,23,0.15)] border border-[#8E5912]/20">
        <p className="text-sm text-[#F7E6D0] mb-2 font-medium tracking-wide">
          {isGuest ? "현재 세션 누적 절약액" : "이번 달 총 절약액"}
        </p>
        <div className="flex items-end gap-2 mb-4">
          <span className="text-4xl font-black tracking-tight">{totalSaving.toLocaleString()}</span>
          <span className="text-xl font-bold mb-1 text-[#F7E6D0]">원</span>
        </div>
        <p className="text-sm text-[#FFFDF9] opacity-95 flex items-center gap-1 bg-black/10 px-3 py-1.5 rounded-xl w-max">
            {currentMessage}
        </p>
      </div>

      {safeLogs.length > 0 ? (
        <div className="mb-8">
          <h3 className="text-sm font-bold text-[#7A7466] mb-4 uppercase tracking-wider">분석 내역 History</h3>
          {safeLogs.map((log, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 mb-3 shadow-sm border border-[#E9E4D9]">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-sm font-bold text-[#3D3A33] mb-1.5">{log.menuName}</p>
                  <div className="flex items-center gap-2 text-[11px] text-[#A39C8A]">
                    <span>{log.date}</span>
                    <span className={`px-2 py-0.5 rounded-md font-bold border ${getBadgeStyle(log.chosen)}`}>
                      {getOptionLabel(log.chosen)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-[#BA7517]">+{log.saving.toLocaleString()}원</p>
                </div>
              </div>
              <div className="h-1.5 bg-[#FCF9F2] rounded-full overflow-hidden border border-[#F1EFE8]">
                <div className={`h-full rounded-full transition-all duration-700 ${getBarColor(log.chosen)}`} style={{ width: `${((log.saving || 0) / maxSaving) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#FCF9F2] border border-dashed border-[#D3D1C7] rounded-xl p-8 text-center mb-8">
          <p className="text-sm font-bold text-[#3D3A33] mb-1.5">아직 분석 내역이 없습니다.</p>
        </div>
      )}

      {isGuest && (
        <div className="bg-[#FDFBF7] border border-[#D3D1C7] rounded-2xl p-5 text-center mb-8">
          <p className="text-sm font-bold text-[#3D3A33] mb-1">회원가입하고 기록을 영구 보관하세요!</p>
          <p className="text-xs text-[#7A7466] mb-3">비로그인 기록은 브라우저를 닫으면 사라집니다.</p>
          
          <Button onClick={onGoToSignUp} className="w-full bg-[#3D3A33] hover:bg-[#201E1A] py-2.5 text-xs text-white rounded-xl">
            회원가입하러 가기 →
          </Button>
        </div>
      )}

      <Button onClick={onNewAnalysis} className="w-full shadow-md bg-[#BA7517] hover:bg-[#8E5912] text-white py-3.5 rounded-xl font-bold">
        새로운 비용 분석 시작하기
      </Button>
    </div>
  );
}