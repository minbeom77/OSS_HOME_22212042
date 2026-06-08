import { useState } from "react";
import { apiLogin } from "../api/apiClient"; 
import Input from "../components/Input";
import Field from "../components/Field";

export default function LoginScreen({ onLogin, onGoSignup }) {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!id || !pw) { setError("아이디와 비밀번호를 입력해주세요."); return; }
    setLoading(true);
    setError("");
    try {
      const user = await apiLogin(id, pw);
      onLogin(user.userId, user.name, false);
    } catch (e) {
      setError(e.response?.data?.message || "로그인에 실패했습니다.");
      if (e.response?.data?.code === "WRONG_PW") setPw("");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleLogin(); };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-[0_8px_40px_rgba(186,117,23,0.12)] border border-[#EDE9E0] overflow-hidden">
        <div className="flex justify-center items-center bg-[#FAF7F2] border-b border-[#EDE9E0] py-7 px-6">
          <img src="/HOME_logo.png" className="w-48 h-auto" alt="H.O.M.E Logo" />
        </div>
        <div className="px-8 py-7">
          <Field label="아이디">
            <Input type="text" value={id} onChange={e => { setId(e.target.value); setError(""); }} placeholder="아이디를 입력하세요" onKeyDown={handleKeyDown} />
          </Field>
          <Field label="비밀번호">
            <div className="relative">
              <Input type={showPw ? "text" : "password"} value={pw} onChange={e => { setPw(e.target.value); setError(""); }} placeholder="비밀번호를 입력하세요" onKeyDown={handleKeyDown} />
              <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#B0A996] bg-transparent border-none cursor-pointer">{showPw ? "🙈" : "👁️"}</button>
            </div>
          </Field>
          {error && <div className="flex items-center gap-2 text-xs text-[#C0440E] mb-4 px-3 py-2.5 bg-[#FEF0EA] border border-[#F5C4B0] rounded-xl">⚠️ {error}</div>}
          <button onClick={handleLogin} disabled={loading} className="w-full py-3.5 rounded-xl bg-[#BA7517] hover:bg-[#9A6010] active:scale-[0.98] text-white text-sm font-semibold tracking-wide transition-all duration-150 shadow-[0_4px_14px_rgba(186,117,23,0.3)] disabled:opacity-50 disabled:cursor-not-allowed mb-3">{loading ? "로그인 중..." : "로그인"}</button>
          <div className="flex items-center gap-3 my-4"><div className="flex-1 h-px bg-[#EDE9E0]" /><span className="text-xs text-[#C4BFBA] font-medium">또는</span><div className="flex-1 h-px bg-[#EDE9E0]" /></div>
          <button onClick={() => onLogin("guest", "게스트", true)} className="w-full py-3 rounded-xl border border-[#D9D4CB] hover:bg-[#F7F3EC] text-[#7A7466] text-sm font-medium transition-all duration-150">비로그인으로 시작하기</button>
          <p className="text-center mt-5 text-sm text-[#9E9890]">아직 계정이 없으신가요? <span onClick={onGoSignup} className="text-[#BA7517] font-semibold cursor-pointer hover:underline underline-offset-2">회원가입</span></p>
        </div>
      </div>
    </div>
  );
}