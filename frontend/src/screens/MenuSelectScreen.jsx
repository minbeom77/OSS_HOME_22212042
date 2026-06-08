import { useState } from "react";
import { MENU_DATA, CAT_ICONS } from "../constants/index.js"; 
import StepBar from "../components/StepBar";
import Button from "../components/Button";
import Tag from "../components/Tag";

export default function MenuSelectScreen({ onNext, onLogout, userName, isGuest }) {
  const [cat, setCat] = useState("한식");
  const [subCat, setSubCat] = useState("");      
  const [brandGroup, setBrandGroup] = useState(""); 
  const [cart, setCart] = useState([]); 

  const handleCategoryClick = (selectedCategory) => {
    setCat(selectedCategory);
    setSubCat("");
    setBrandGroup("");
  };

  const handleSubCatClick = (s) => {
    setSubCat(s);
    setBrandGroup("");
  };

  const handleBrandGroupClick = (b) => {
    setBrandGroup(b);
  };

  const handleUpdateQuantity = (targetMenu, amount) => {
    setCart(prev => {
      const existing = prev.find(item => item.name === targetMenu.name);
      
      if (existing) {
        const nextQty = existing.quantity + amount;
        if (nextQty <= 0) {
          return prev.filter(item => item.name !== targetMenu.name);
        }
        return prev.map(item => item.name === targetMenu.name ? { ...item, quantity: nextQty } : item);
      }
      
      if (amount > 0) {
        return [...prev, { ...targetMenu, quantity: 1 }];
      }
      return prev;
    });
  };

  const currentStructure = MENU_DATA[cat] || {};
  const subCatKeys = Object.keys(currentStructure);

  let finalMenuList = [];
  let showBrandGroupSelector = false;
  let brandGroupKeys = [];

  if (subCat && currentStructure[subCat]) {
    const targetNode = currentStructure[subCat];
    if (Array.isArray(targetNode)) {
      finalMenuList = targetNode;
    } else {
      showBrandGroupSelector = true;
      brandGroupKeys = Object.keys(targetNode);
      if (brandGroup && targetNode[brandGroup]) {
        finalMenuList = targetNode[brandGroup];
      }
    }
  }

  const totalCartPrice = cart.reduce((sum, item) => sum + (item.deliveryPrice * item.quantity), 0);
  const targetMinOrder = cart.length > 0 ? Math.max(...cart.map(item => item.minOrder || 0)) : 0;
  const isMinOrderSatisfied = totalCartPrice >= targetMinOrder;

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <span className="text-lg font-medium text-[#BA7517]">H.O.M.E</span>
        <div className="flex items-center gap-3">
          <StepBar current={2} />
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F7E6D0] rounded-full">
            <span className="text-xs text-[#8E5912] font-medium">
              {isGuest ? "👤 비로그인" : `👋 ${userName}`}
            </span>
            <span onClick={onLogout} className="text-xs text-[#7A7466] cursor-pointer underline hover:text-[#3D3A33]">로그아웃</span>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-medium text-[#3D3A33] mb-1">어떤 음식을 분석할까요?</h2>
      <p className="text-sm text-[#7A7466] mb-6">오늘 먹을 메뉴들을 담아 기회비용을 비교해 보세요. </p>

      <div className="grid grid-cols-5 gap-2.5 mb-6">
        {Object.keys(CAT_ICONS).map(c => (
          <div
            key={c} onClick={() => handleCategoryClick(c)}
            className={`border rounded-xl py-3 px-2 text-center cursor-pointer transition-all duration-150
              ${cat === c ? "border-2 border-[#BA7517] bg-[#F7E6D0] shadow-sm" : "border border-[#D3D1C7] bg-white hover:bg-[#FCF9F2]"}`}
          >
            <div className="text-2xl mb-1">{CAT_ICONS[c]}</div>
            <div className="text-xs font-medium text-[#3D3A33]">{c}</div>
          </div>
        ))}
      </div>

      {subCatKeys.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {subCatKeys.map(s => (
              <button
                key={s} type="button" onClick={() => handleSubCatClick(s)}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${subCat === s ? "bg-[#BA7517] text-white shadow-sm" : "bg-white border border-[#D3D1C7] text-[#3D3A33] hover:bg-[#FCF9F2]"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {showBrandGroupSelector && subCat && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {brandGroupKeys.map(b => (
              <button
                key={b} type="button" onClick={() => handleBrandGroupClick(b)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${brandGroup === b ? "bg-[#8E5912] text-white shadow-sm" : "bg-white border border-[#D3D1C7] text-[#7A7466] hover:bg-[#FCF9F2]"}`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs font-semibold text-[#BA7517] uppercase tracking-wider mb-2">실전 메뉴판 (카드를 클릭하거나 버튼으로 개수를 조절하세요)</p>
      {finalMenuList.length > 0 ? (
        <div className="grid grid-cols-3 gap-2.5 mb-6">
          {finalMenuList.map((m, idx) => {
            const cartItem = cart.find(item => item.name === m.name);
            const currentQty = cartItem ? cartItem.quantity : 0;

            return (
              <div
                key={idx}
                className={`border rounded-xl p-3.5 transition-all duration-150 relative flex flex-col justify-between min-h-[115px] ${
                  currentQty > 0 
                    ? "border-2 border-[#BA7517] bg-[#FFFDF9] shadow-sm" 
                    : "border border-[#D3D1C7] bg-white hover:bg-[#FCF9F2]"
                }`}
              >
                <div onClick={() => handleUpdateQuantity(m, 1)} className="cursor-pointer flex-1">
                  <div className="text-sm font-semibold text-[#3D3A33] mb-0.5 break-all">{m.name}</div>
                  <div className="text-xs text-[#BA7517] font-bold mb-2">{m.deliveryPrice.toLocaleString()}원</div>
                  <Tag type={m.type} />
                </div>

                <div className="mt-2.5 flex items-center justify-between bg-[#F1EFE8] rounded-lg p-1">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleUpdateQuantity(m, -1); }}
                    className="w-5 h-5 bg-white border border-[#D3D1C7] text-[#7A7466] text-xs font-bold rounded shadow-xs flex items-center justify-center hover:bg-red-50"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold text-[#3D3A33] px-2 whitespace-nowrap">
                    {currentQty}개
                  </span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleUpdateQuantity(m, 1); }}
                    className="w-5 h-5 bg-white border border-[#D3D1C7] text-[#7A7466] text-xs font-bold rounded shadow-xs flex items-center justify-center hover:bg-green-50"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#FCF9F2] border border-dashed border-[#D3D1C7] rounded-xl p-6 text-center text-xs text-[#7A7466] mb-6">
          위의 카테고리를 선택하시면 메뉴판이 나옵니다.
        </div>
      )}

      {cart.length > 0 && (
        <div className="mb-8 bg-[#FDFBF7] border-2 border-[#EADCC9] rounded-2xl p-4 shadow-xs animate-fadeIn">
          <div className="flex justify-between items-center mb-2.5 border-b border-[#EDE9E0] pb-2">
            <span className="text-xs font-bold text-[#BA7517] uppercase">🛒 총 선택한 품목 리스트 ({cart.length}종)</span>
            <span onClick={() => setCart([])} className="text-xs text-[#7A7466] underline cursor-pointer hover:text-red-500">전체 비우기</span>
          </div>
          <div className="text-xs text-[#7A7466] space-y-1 max-h-24 overflow-y-auto">
            {cart.map(i => (
              <div key={i.name} className="flex justify-between">
                <span>• {i.name} ({i.quantity}개)</span>
                <span className="font-medium text-[#8E5912]">{(i.deliveryPrice * i.quantity).toLocaleString()}원</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#EDE9E0] flex justify-between items-center text-xs">
            <div className="text-[#7A7466]">
              총음식값: <strong className="text-[#3D3A33] text-sm">{totalCartPrice.toLocaleString()}원</strong> | 최소주문액: {targetMinOrder.toLocaleString()}원
            </div>
            {isMinOrderSatisfied ? (
              <span className="text-[10px] bg-[#E9F0E8] text-[#4A7047] font-bold px-2 py-0.5 rounded-full">주문 가능 ✓</span>
            ) : (
              <span className="text-[10px] bg-[#FAECE7] text-[#D85A30] font-bold px-2 py-0.5 rounded-full">{(targetMinOrder - totalCartPrice).toLocaleString()}원 부족</span>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t border-[#D3D1C7]">
        <p className="text-sm text-[#7A7466]">
          {cart.length > 0 ? `총 ${cart.reduce((s,i)=>s+i.quantity,0)}개 품목이 대기선에 안착함` : "조합할 메뉴의 개수를 올려 담아주십시오."}
        </p>
        <Button 
          onClick={() => onNext(cat, cart)} 
          disabled={cart.length === 0 || !isMinOrderSatisfied} 
          className="px-6 py-2.5 w-auto"
        >
          다음 단계 (비용 기입) →
        </Button>
      </div>
    </div>
  );
}