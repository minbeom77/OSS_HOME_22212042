import { useState } from "react";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import MenuSelectScreen from "./screens/MenuSelectScreen";
import CostInputScreen from "./screens/CostInputScreen";
import ResultScreen from "./screens/ResultScreen";
import ReportScreen from "./screens/ReportScreen";

// 1. apiClient.js 에서는 비용 연산 관련 API들을 가져옵니다.
import { apiCalculateCost, apiSaveSelection, apiGetAllLogs } from "./api/apiClient";

// 2. api.js 에서는 메뉴 상세 조회 기능을 가져옵니다. (기존 import 형식을 명확히 컴포넌트 함수로 변경)
import { apiGetMenuDetails } from "./api/api"; 

export default function Home() {
  const [screen, setScreen] = useState("LOGIN"); 
  const [user, setUser] = useState({ userId: "", name: "", isGuest: true });
  const [selectedCat, setSelectedCat] = useState("한식");
  const [selectedMenu, setSelectedMenu] = useState([]); 
  const [calculationResult, setCalculationResult] = useState(null);
  const [monthlyLogs, setMonthlyLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLoginDone = (userId, name, isGuest, token) => {
    if (token) localStorage.setItem("home_token", token);
    setUser({ userId, name, isGuest });
    setScreen("MENU"); 
  };

  const handleLogout = () => {
    localStorage.removeItem("home_token");
    setUser({ userId: "", name: "", isGuest: true });
    setSelectedMenu([]);
    setCalculationResult(null);
    setScreen("LOGIN");
  };

  const handleMenuSelectDone = async (cat, cartList) => {
    setLoading(true);
    setSelectedCat(cat);
    try {
      const combinedName = cartList.map(m => m.name).join(", ");
      // api.js 에서 가져온 안전한 엔드포인트 함수를 사용합니다.
      const resData = await apiGetMenuDetails(combinedName);
      const enrichedCart = cartList.map(item => ({ ...item, ...resData }));
      setSelectedMenu(enrichedCart);
      setScreen("INPUT");
    } catch (e) {
      console.warn("메뉴 데이터 로드 실패");
      setSelectedMenu(cartList);
      setScreen("INPUT");
    } finally {
      setLoading(false);
    }
  };

  const handleCostInputDone = async (inputData) => {
    setLoading(true);
    try {
      const combinedMenuName = selectedMenu.map(m => m.name).join(", ");
      
      const payload = {
        menuName: combinedMenuName, 
        foodPrice: inputData.foodPrice,
        deliveryCost: inputData.deliveryFee, 
        minOrder: inputData.minOrder,
        kitPrice: inputData.kitPrice,
        kitMin: inputData.kitMin,
        cookMin: inputData.cookMin,
        laborMin: inputData.laborMin,
        toolCost: inputData.toolCost,
        ingredientCost: inputData.ingredientCost
      };

      // apiClient.js 에서 가져온 연산 API를 사용합니다.
      const res = await apiCalculateCost(payload);
      setCalculationResult(res);
      setScreen("RESULT");
    } catch (e) {
      alert("연산 오류: " + (e.response?.data?.message || e.message));
    } finally {
      setLoading(false);
    }
  };

  const handleResultDone = async (chosenOption) => {
    if (user.isGuest) {
      setMonthlyLogs([]);
      setScreen("REPORT");
      return;
    }
    setLoading(true);
    try {
      const combinedMenuName = selectedMenu.map(m => m.name).join(", ");
      // apiClient.js의 결과 저장 및 로그 가져오기 API 호출
      await apiSaveSelection(combinedMenuName, chosenOption);
      
      const res = await apiGetAllLogs();
      setMonthlyLogs(res || []);
      setScreen("REPORT");
    } catch (e) {
      alert("리포트 데이터를 가져오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  switch (screen) {
    case "LOGIN": return <LoginScreen onLogin={(id, name, guest, token) => handleLoginDone(id, name, guest, token)} onGoSignup={() => setScreen("SIGNUP")} />;
    case "SIGNUP": return <SignupScreen onSignupDone={(id, name, token) => handleLoginDone(id, name, false, token)} onBack={() => setScreen("LOGIN")} />;
    case "MENU": return <MenuSelectScreen userName={user.name} isGuest={user.isGuest} onNext={handleMenuSelectDone} onLogout={handleLogout} />;
    case "INPUT": return <CostInputScreen cat={selectedCat} menu={selectedMenu} loading={loading} onNext={handleCostInputDone} onBack={() => setScreen("MENU")} />;
    case "RESULT": return <ResultScreen cat={selectedCat} menu={selectedMenu} costs={calculationResult} onNext={(chosen) => handleResultDone(chosen)} onBack={() => setScreen("INPUT")} />;
    case "REPORT": return <ReportScreen logs={monthlyLogs} isGuest={user.isGuest} onNewAnalysis={() => setScreen("MENU")} onGoToSignUp={() => setScreen("SIGNUP")} />;
    default: return <LoginScreen onLogin={handleLoginDone} onGoSignup={() => setScreen("SIGNUP")} />;
  }
}