import { useState } from "react";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import MenuSelectScreen from "./screens/MenuSelectScreen";
import CostInputScreen from "./screens/CostInputScreen";
import ResultScreen from "./screens/ResultScreen";
import ReportScreen from "./screens/ReportScreen";

import { apiCalculateCost, apiGetMonthlyReport } from "./api/apiClient";
import axios from "axios"; // 🎯 전 품목 실시간 단가 조회를 위한 통신 라이브러리

export default function Home() {
  const [screen, setScreen] = useState("LOGIN"); 
  const [user, setUser] = useState({ userId: "", name: "", isGuest: true });
  
  const [selectedCat, setSelectedCat] = useState("한식");
  const [selectedMenu, setSelectedMenu] = useState([]); 
  const [calculationResult, setCalculationResult] = useState(null);
  const [monthlyLogs, setMonthlyLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLoginDone = (userId, name, isGuest) => {
    setUser({ userId, name, isGuest });
    setScreen("MENU"); 
  };

  const handleLogout = () => {
    setUser({ userId: "", name: "", isGuest: true });
    setSelectedMenu([]);
    setCalculationResult(null);
    setScreen("LOGIN");
  };

  // ── 🎯 [전체 아이템 동기화 스캔 엔진 완벽 리팩토링] ──
  const handleMenuSelectDone = async (cat, cartList) => {
    setLoading(true);
    setSelectedCat(cat);
    
    try {
      if (cartList.length > 0) {
        // 💡 Promise.all을 가동하여 장바구니에 담긴 모든 아이템 각각의 백엔드 details API를 동시 타격
        const synchronizedCart = await Promise.all(
          cartList.map(async (item) => {
            try {
              // 💡 로컬 개발 환경 통신선 연결
              const res = await axios.get(`http://localhost:8080/api/menu/details?menuName=${encodeURIComponent(item.name)}`);
              
              // 백엔드 DB에 데이터가 무사히 존재할 경우 도킹 규격
              return {
                ...item,
                menuName: item.name,
                kitPrice: res.data.kitPrice !== undefined ? res.data.kitPrice : (item.kitPrice || 0),
                kitMin: res.data.kitMin || (item.kitMin || 15),
                cookMin: res.data.cookMin || (item.cookMin || 20),
                menuType: res.data.menuType || item.type || item.menuType || "ALL",
                deliveryPrice: res.data.deliveryPrice !== undefined ? res.data.deliveryPrice : (item.deliveryPrice || item.price || 0),
                minOrder: res.data.minOrder !== undefined ? res.data.minOrder : (item.minOrder || 0)
              };
            } 
            catch (err) {
              console.warn(`[HOME] ${item.name} 단가 조회 실패, 로컬 데이터로 계산`);
              

              return { 
                ...item, 
                menuName: item.name,
                menuType: item.type || item.menuType || "DELIVERY_ONLY", // 치킨/족발은 기본 배달전용 처리
                deliveryPrice: item.deliveryPrice || item.price || 0,     // constants.js에 기입된 배달 총액 연동
                minOrder: item.minOrder || 0,                                // constants.js에 기입된 최소주문금액 연동
                kitPrice: item.kitPrice || 0, 
                kitMin: item.kitMin || 15, 
                cookMin: item.cookMin || 20 
              };
            }
          })
        );
        
        console.log("장바구니 전 품목 API 연동 완료 패킷:", synchronizedCart);
        setSelectedMenu(synchronizedCart);
      } else {
        setSelectedMenu(cartList);
      }
      setScreen("INPUT");
    } catch (e) {
      console.error("장바구니 일괄 동기화 프로세스 최종 붕괴, 세이프 플랜 가동:", e);
      setSelectedMenu(cartList); 
      setScreen("INPUT");
    } finally {
      setLoading(false);
    }
  };

  const handleCostInputDone = async (payload) => {
    setLoading(true);
    try {
      let targetMenuName = "선택 메뉴";
      if (Array.isArray(selectedMenu) && selectedMenu.length > 0) {
        targetMenuName = selectedMenu[0].name; 
      }

      const requestData = {
        userId: user.userId || "guest",
        menuName: targetMenuName,
        deliveryFee: Number(payload.deliveryFee) || 0,
        deliveryCost: Number(payload.deliveryFee) || 0,
        foodPrice: Number(payload.foodPrice) || 0,
        minOrder: Number(payload.minOrder) || 0,
        kitPrice: Number(payload.kitPrice) || 0, 
        kitMin: Number(payload.kitMin) || 0,
        cookMin: Number(payload.cookMin) || 0,
        laborMin: Number(payload.laborMin) || 0,
        toolCost: Number(payload.toolCost) || 0,
        chickenOption: payload.chickenOption,
        pizzaSize: payload.pizzaSize,
        noodleSize: payload.noodleSize,
        portionSize: payload.portionSize
      };

      const res = await apiCalculateCost(requestData);
      setCalculationResult(res);
      setScreen("RESULT");
    } catch (e) {
      alert("연산 오류: " + (e.response?.data?.message || e.message));
    } finally {
      setLoading(false);
    }
  };

  const handleResultDone = async () => {
    if (user.isGuest) {
      setMonthlyLogs([]);
      setScreen("REPORT");
      return;
    }
    setLoading(true);
    try {
      const res = await apiGetMonthlyReport(user.userId);
      setMonthlyLogs(res.logs || res || []);
      setScreen("REPORT");
    } catch (e) {
      alert("리포트 데이터를 가져오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  switch (screen) {
    case "LOGIN": return <LoginScreen onLogin={handleLoginDone} onGoSignup={() => setScreen("SIGNUP")} />;
    case "SIGNUP": return <SignupScreen onSignupDone={(id, name) => handleLoginDone(id, name, false)} onBack={() => setScreen("LOGIN")} />;
    case "MENU": return <MenuSelectScreen userName={user.name} isGuest={user.isGuest} onNext={handleMenuSelectDone} onLogout={handleLogout} />;
    case "INPUT": return <CostInputScreen cat={selectedCat} menu={selectedMenu} loading={loading} onNext={handleCostInputDone} onBack={() => setScreen("MENU")} />;
    case "RESULT": return <ResultScreen cat={selectedCat} menu={selectedMenu} costs={calculationResult} onNext={handleResultDone} onBack={() => setScreen("INPUT")} />;
    case "REPORT": return <ReportScreen logs={monthlyLogs} onNewAnalysis={() => setScreen("MENU")} />;
    default: return <LoginScreen onLogin={handleLoginDone} onGoSignup={() => setScreen("SIGNUP")} />;
  }
}