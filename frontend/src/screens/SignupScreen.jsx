import { useState } from "react";
import { apiRegister } from "../api/apiClient";
import Button from "../components/Button";
import Input from "../components/Input";
import Field from "../components/Field";

export default function SignupScreen({ onSignupDone, onBack }) {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [pw, setPw] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!id.trim()) return "아이디를 입력해주세요.";
    if (id.length < 4) return "아이디는 4자 이상이어야 합니다.";
    if (!name.trim()) return "이름을 입력해주세요.";
    if (!pw) return "비밀번호를 입력해주세요.";
    if (pw.length < 6) return "비밀번호는 6자 이상이어야 합니다.";
    if (pw !== pwConfirm) return "비밀번호가 일치하지 않습니다.";
    return null;
  };

  const handleSignup = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    setError("");
    try {
     const user = await apiRegister(id.trim(), pw, name.trim());
      onSignupDone(user.userId, user.name, user.token);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const pwMatch = pwConfirm && pw === pwConfirm;
  const pwMismatch = pwConfirm && pw !== pwConfirm;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FCF9F2] px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] p-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-[#3D3A33]">회원가입</h1>
          <p className="text-sm text-[#7A7466] mt-2">H.O.M.E 계정을 만들어보세요</p>
        </div>

        <Field label="아이디 (4자 이상)">
          <Input type="text" value={id} onChange={e => { setId(e.target.value); setError(""); }} placeholder="사용할 아이디 입력" />
        </Field>
        <Field label="이름">
          <Input type="text" value={name} onChange={e => { setName(e.target.value); setError(""); }} placeholder="이름을 입력하세요" />
        </Field>
        <Field label="비밀번호 (6자 이상)">
          <div className="relative">
            <Input type={showPw ? "text" : "password"} value={pw} onChange={e => { setPw(e.target.value); setError(""); }} placeholder="비밀번호 입력" />
            <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#B0A996] bg-transparent border-none cursor-pointer">
              {showPw ? "🙈" : "👁️"}
            </button>
          </div>
        </Field>
        <Field label="비밀번호 확인">
          <div className="relative">
            <input
              type="password" value={pwConfirm}
              onChange={e => { setPwConfirm(e.target.value); setError(""); }}
              placeholder="비밀번호 재입력"
              className={`w-full py-2 px-3 pr-9 rounded-xl text-sm text-[#3D3A33] outline-none bg-[#F1EFE8] transition-all ${pwMismatch ? "border-2 border-[#D85A30]" : pwMatch ? "border-2 border-[#4A7047]" : "border border-[#D3D1C7]"}`}
            />
            {pwMatch && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm">✅</span>}
            {pwMismatch && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm">❌</span>}
          </div>
        </Field>

        {error && (
          <div className="text-xs text-[#D85A30] mb-3 px-3 py-2 bg-[#FAECE7] rounded-lg">⚠️ {error}</div>
        )}

        <Button onClick={handleSignup} disabled={loading} className="w-full py-3 mb-2">
          {loading ? "가입 중..." : "회원가입 완료"}
        </Button>
        <Button variant="secondary" onClick={onBack} className="w-full py-3">
          ← 로그인으로 돌아가기
        </Button>
      </div>
    </div>
  );
}
