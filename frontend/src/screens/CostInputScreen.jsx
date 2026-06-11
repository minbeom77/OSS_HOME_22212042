import { useState, useEffect } from "react";

function PriceInput({ value, onChange, suffix = "원", step = 1000 }) {
  return (
    <div className="flex items-center gap-1.5">
      <button 
        type="button" 
        onClick={() => onChange(Math.max(0, value - step))} 
        className="w-7 h-7 rounded-lg bg-[#F1EFE8] border border-[#D3D1C7] text-[#7A7466] text-sm font-bold flex items-center justify-center select-none"
      >
        -
      </button>
      <div className="relative flex-1">
        <input 
          type="text" 
          inputMode="numeric"
          value={value} 
          onChange={e => {
            const num = Number(e.target.value.replace(/[^0-9]/g, ''));
            onChange(num);
          }} 
          className="w-full py-2 px-3 pr-8 rounded-xl text-sm text-[#3D3A33] text-right bg-[#F1EFE8] border border-[#D3D1C7] outline-none font-medium" 
        />
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#B0A996] select-none">{suffix}</span>
      </div>
      <button 
        type="button" 
        onClick={() => onChange(value + step)} 
        className="w-7 h-7 rounded-lg bg-[#F1EFE8] border border-[#D3D1C7] text-[#7A7466] text-sm font-bold flex items-center justify-center select-none"
      >
        +
      </button>
    </div>
  );
}

function CostInputField({ label, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2.5 border-b border-[#E9E4D9] last:border-0">
      <span className="text-sm font-medium text-[#7A7466]">{label}</span>
      <div className="w-full sm:w-48">{children}</div>
    </div>
  );
}

export default function CostInputScreen({ cat, menu, loading, onNext, onBack }) {
  const cartItems = Array.isArray(menu) ? menu : [];
  const combinedNames = cartItems.map(m => m.name).join(", ");
  const primaryItem = cartItems[0] || {};

  const [foodPrice, setFoodPrice] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(3000); 
  const [minOrder, setMinOrder] = useState(0);
  const [kitPrice, setKitPrice] = useState(0);
  const [kitMin, setKitMin] = useState(15);
  
  const [ingredientCost, setIngredientCost] = useState(0);
  const [cookMin, setCookMin] = useState(20);
  const [laborMin, setLaborMin] = useState(10);
  const [toolCost, setToolCost] = useState(0);

  const [chickenOption, setChickenOption] = useState("뼈");
  const [pizzaSize, setPizzaSize] = useState("R");
  const [noodleSize, setNoodleSize] = useState("보통");
  const [portionSize, setPortionSize] = useState("소");

  const totalQty = cartItems.reduce((acc, cur) => acc + (cur.quantity || 1), 0);

  useEffect(() => {
    if (cartItems.length > 0) {
      const totalBasePrice = cartItems.reduce((acc, cur) => {
        const base = cur.deliveryPrice || cur.price || 0;
        const qty = cur.quantity || 1;
        return acc + (base * qty);
      }, 0);
      
      setFoodPrice(totalBasePrice);
      setMinOrder(primaryItem.minOrder || 0);
      setKitPrice(primaryItem.kitPrice || 0);
      setKitMin(primaryItem.kitMin || 15);
      
      setIngredientCost((primaryItem.ingredientCost || 2000) * totalQty);
      setCookMin(primaryItem.cookMin || 25);
      setLaborMin(primaryItem.laborMin || 10);
    }
  }, [menu]);

  const isChicken = cat === "프랜차이즈" && combinedNames.match(/(치킨|후라이드|양념|뿌링클|맛쵸킹|황금올리브|슈프림|바사삭|구이|닭)/) && !combinedNames.includes("버거");
  const isPizza = combinedNames.includes("피자");
  const isNoodle = !!primaryItem.hasNoodleOpt || combinedNames.match(/(짜장|짬뽕|면)/); // 짜장면도 곱배기 뜨게 보강
  const isPortion = !!primaryItem.hasPortion || combinedNames.match(/(족발|보쌈|탕수육|깐풍기)/);

  const hasMealkit = primaryItem.menuType !== "DELIVERY_ONLY" && primaryItem.type !== "DELIVERY_ONLY";
  const hasCooking = hasMealkit && primaryItem.menuType !== "NO_COOKING" && primaryItem.type !== "NO_COOKING";

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext({
      menuName: combinedNames, 
      foodPrice,
      deliveryFee,
      minOrder,
      kitPrice,
      kitMin,
      ingredientCost, 
      cookMin,
      laborMin,
      toolCost,
      chickenOption: isChicken ? chickenOption : null,
      pizzaSize: isPizza ? pizzaSize : null,
      noodleSize: isNoodle ? noodleSize : null,
      portionSize: isPortion ? portionSize : null,
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-trendy border border-[#E9E4D9] overflow-hidden">
      <div className="px-6 py-4 bg-[#FCF9F2] border-b border-[#E9E4D9] flex items-center justify-between">
        <button type="button" onClick={onBack} className="text-sm font-semibold text-[#7A7466] hover:text-[#3D3A33] transition-colors">← 이전</button>
        <span className="text-xs font-bold text-[#B0A996] tracking-widest uppercase">Step 02 / Cost Input</span>
        <div className="w-10"></div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#3D3A33] mb-1">비용 분석</h2>
          <p className="text-xs text-[#7A7466]">선택하신 <span className="font-semibold text-[#BA7517]">[{combinedNames}]</span> 메뉴의 가격입니다.</p>
        </div>

        <div className="mb-5 bg-[#FDFBF7] border border-[#E9E4D9] rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-bold text-[#BA7517] uppercase mb-2"> 배달 합산 정보</p>
          <CostInputField label="음식 총액">
            <PriceInput value={foodPrice} onChange={setFoodPrice} step={1000} />
          </CostInputField>
          <CostInputField label="배달팁">
            <PriceInput value={deliveryFee} onChange={setDeliveryFee} step={500} />
          </CostInputField>
          <CostInputField label="최소주문금액">
            <PriceInput value={minOrder} onChange={setMinOrder} step={1000} />
          </CostInputField>
        </div>

        {(isChicken || isPizza || isNoodle || isPortion) && (
          <div className="mb-5 bg-[#FDFBF7] border border-[#EADCC9] rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-bold text-[#BA7517] uppercase mb-3"> 🛵 배달 선택사항</p>
            
            {isChicken && (
              <CostInputField label="뼈 / 순살 선택">
                <div className="flex gap-2">
                  {["뼈", "순살"].map(o => (
                    <button 
                      key={o} type="button" 
                      onClick={() => {
                        if (chickenOption !== o) {
                          setChickenOption(o);
                          setFoodPrice(prev => o === "순살" ? prev + (2000 * totalQty) : prev - (2000 * totalQty));
                        }
                      }} 
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${chickenOption === o ? "bg-[#BA7517] text-white border-[#BA7517]" : "bg-white text-[#7A7466] border-[#D3D1C7] hover:bg-[#F1EFE8]"}`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </CostInputField>
            )}

            {isPizza && (
              <CostInputField label="피자 사이즈 선택">
                <div className="flex gap-2">
                  {["R", "L"].map(o => (
                    <button 
                      key={o} type="button" 
                      onClick={() => {
                        if (pizzaSize !== o) {
                          setPizzaSize(o);
                          setFoodPrice(prev => o === "L" ? prev + (4000 * totalQty) : prev - (4000 * totalQty));
                        }
                      }} 
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${pizzaSize === o ? "bg-[#BA7517] text-white border-[#BA7517]" : "bg-white text-[#7A7466] border-[#D3D1C7] hover:bg-[#F1EFE8]"}`}
                    >
                      {o} 사이즈
                    </button>
                  ))}
                </div>
              </CostInputField>
            )}

            {isNoodle && (
              <CostInputField label="곱배기 추가 선택">
                <div className="flex gap-2">
                  {["보통", "곱배기"].map(o => (
                    <button 
                      key={o} type="button" 
                      onClick={() => {
                        if (noodleSize !== o) {
                          setNoodleSize(o);
                          setFoodPrice(prev => o === "곱배기" ? prev + (1000 * totalQty) : prev - (1000 * totalQty));
                        }
                      }} 
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${noodleSize === o ? "bg-[#BA7517] text-white border-[#BA7517]" : "bg-white text-[#7A7466] border-[#D3D1C7] hover:bg-[#F1EFE8]"}`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </CostInputField>
            )}

            {isPortion && (
              <CostInputField label="사이즈 선택">
                <div className="flex gap-1.5">
                  {["소", "중", "대", "특대"].map(o => {
                    const getOffset = (size) => {
                      if (size === "중") return 5000 * totalQty;
                      if (size === "대") return (combinedNames.includes("보쌈") ? 18000 : (combinedNames.includes("탕수육") ? 20000 : 10000)) * totalQty;
                      if (size === "특대") return (combinedNames.includes("보쌈") ? 27000 : 20000) * totalQty;
                      return 0;
                    };
                    return (
                      <button 
                        key={o} type="button" 
                        onClick={() => {
                          if (portionSize !== o) {
                            const currentOffset = getOffset(portionSize);
                            const nextOffset = getOffset(o);
                            setPortionSize(o);
                            setFoodPrice(prev => prev - currentOffset + nextOffset);
                          }
                        }} 
                        className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${portionSize === o ? "bg-[#BA7517] text-white border-[#BA7517]" : "bg-white text-[#7A7466] border-[#D3D1C7] hover:bg-[#F1EFE8]"}`}
                      >
                        {o}
                      </button>
                    );
                  })}
                </div>
              </CostInputField>
            )}
          </div>
        )}

        <div className="mb-5 bg-[#FDFBF7] border border-[#E9E4D9] rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-bold text-[#4A7047] uppercase mb-2"> 밀키트 대체 옵션</p>
          {hasMealkit ? (
            <>
              <CostInputField label="밀키트 표준 단가 (2인분 기준)">
                <PriceInput value={kitPrice} onChange={setKitPrice} step={1000} />
              </CostInputField>
              <CostInputField label="예상 조리 시간 (분)">
                <PriceInput value={kitMin} onChange={setKitMin} suffix="분" step={5} />
              </CostInputField>
            </>
          ) : (
            <div className="py-2 text-center text-xs text-[#7A7466] font-medium flex items-center justify-center gap-1">
              🚫 밀키트 옵션 없음 (배달 전용 메뉴)
            </div>
          )}
        </div>

        <div className="mb-6 bg-[#FDFBF7] border border-[#E9E4D9] rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-bold text-[#D85A30] uppercase mb-2"> 직접 요리 대체 옵션</p>
          {hasCooking ? (
            <>
              <CostInputField label="예상 식재료비 총액">
                <PriceInput 
                  value={ingredientCost} 
                  onChange={setIngredientCost} 
                  suffix="원" 
                  step={1000} 
                />
              </CostInputField>
              <CostInputField label="순수 조리 시간 (분)">
                <PriceInput value={cookMin} onChange={setCookMin} suffix="분" step={5} />
              </CostInputField>
              <CostInputField label="설거지 및 정리 시간 (분)">
                <PriceInput value={laborMin} onChange={setLaborMin} suffix="분" step={5} />
              </CostInputField>
            </>
          ) : (
            <div className="py-2 text-center text-xs text-[#7A7466] font-medium flex items-center justify-center gap-1">
              🚫 직접 조리 불가 (배달/밀키트 전용)
            </div>
          )}
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-[#BA7517] hover:bg-[#8E5912] disabled:bg-[#B0A996] text-white text-base font-bold shadow-md hover:shadow-lg transition-all text-center select-none"
        >
          {loading ? "통합 비교 연산 중..." : "비교 시작"}
        </button>
      </form>
    </div>
  );
}