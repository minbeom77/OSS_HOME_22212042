import StepBar from "../components/StepBar";
import Button from "../components/Button";

export default function ReportScreen({ logs, onNewAnalysis }) {
  const totalSaving = logs.reduce((s, l) => s + (l.saving || 0), 0);

  const suggestions = [
    { threshold: 50000, msg: "OTT 구독 3개월치를 낼 수 있어요! 🎬" },
    { threshold: 30000, msg: "아이스 아메리카노 15잔을 마실 수 있어요! ☕" },
    { threshold: 10000, msg: "편의점 간식을 마음껏 살 수 있어요! 🍫" },
    { threshold: 0, msg: "조금씩 쌓이고 있어요! 계속해봐요 💪" },
  ];
  const suggestion = suggestions.find(s => totalSaving >= s.threshold)?.msg || suggestions[3].msg;
  const maxSaving = Math.max(...logs.map(l => l.saving || 0), 1);

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <span className="text-lg font-medium text-[#BA7517]">H.O.M.E</span>
        <StepBar current={5} />
      </div>

      <h2 className="text-xl font-medium text-[#3D3A33] mb-1">Hidden Opportunity Report</h2>
      <p className="text-sm text-[#7A7466] mb-6">총 아낀 금액이에요.</p>

      <div className="bg-[#BA7517] rounded-2xl px-8 py-6 mb-4 text-white">
        <p className="text-sm opacity-80 mb-1.5">이번 달 총 절약액</p>
        <p className="text-4xl font-semibold mb-3">{totalSaving.toLocaleString()}원</p>
        <div className="inline-block bg-white/20 rounded-lg px-3 py-1.5 text-sm">
          💡 {suggestion}
        </div>
      </div>

      {/* 분석 내역 */}
      {logs.length > 0 ? (
        <div className="bg-white border border-[#D3D1C7] rounded-xl p-6 mb-4">
          <p className="text-xs font-medium text-[#7A7466] mb-4">분석 내역</p>
          {logs.map((log, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between items-start mb-1.5">
                <div>
                  <p className="text-sm font-medium text-[#3D3A33]">{log.menu}</p>
                  <p className="text-xs text-[#7A7466]">{log.date} · {log.chosen} 선택</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-[#4A7047]">+{(log.saving || 0).toLocaleString()}원</p>
                  <p className="text-xs text-[#7A7466]">{log.chosenCost.toLocaleString()}원 지출</p>
                </div>
              </div>
              <div className="h-1.5 bg-[#FCF9F2] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#4A7047] transition-all duration-700"
                  style={{ width: `${((log.saving || 0) / maxSaving) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#FCF9F2] border border-dashed border-[#D3D1C7] rounded-xl p-8 text-center mb-4">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-sm text-[#7A7466]">아직 분석 내역이 없어요.</p>
          <p className="text-xs text-[#B0A996] mt-1">첫 번째 분석을 시작해보세요!</p>
        </div>
      )}

      <Button onClick={onNewAnalysis} className="w-full py-3">
        새 분석 시작하기 →
      </Button>
    </div>
  );
}
