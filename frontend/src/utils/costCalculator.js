import { apiCalculateCost } from "../api/apiClient"; 

export async function calcCosts(menu, input, ingredientList = []) {
  try {
    const res = await apiCalculateCost({
      menuName: menu.name, 
      foodPrice: input.foodPrice, 
      deliveryFee: input.deliveryFee, 
      minOrder: input.minOrder, 
      kitPrice: input.kitPrice, 
      kitMin: input.kitMin, 
      cookMin: input.cookMin, 
      laborMin: input.laborMin, 
      toolCost: input.toolCost, 
      ingredientList, 
    });

    return res; 

  } catch (error) {
    console.error("[calcCosts] 백엔드 엔진 호출 실패, 로컬 연산으로 fallback:", error); 
    return calcCostsLocal(menu, input); 
  }
}

const MIN_WAGE = 10320; 

export function calcCostsLocal(menu, input) {
  const foodPrice = input.foodPrice || 15000;
  const deliveryFee = input.deliveryFee || 0;
  const minOrder = input.minOrder || 0;

  // 입력가가 없거나 0원일 때 배달 가격 기준 시장 실거래가 비율(55%, 40%)로 동적 역산
  const kitPrice = (input.kitPrice && input.kitPrice > 0) ? input.kitPrice : Math.round(foodPrice * 0.55);
  const ingredientCost = (menu.ingredientCost && menu.ingredientCost > 0) ? menu.ingredientCost : Math.round(foodPrice * 0.40);

  const kitMin = (input.kitMin && input.kitMin > 0) ? input.kitMin : 15;
  const cookMin = (input.cookMin && input.cookMin > 0) ? input.cookMin : 20;
  const laborMin = (input.laborMin && input.laborMin > 0) ? input.laborMin : 10;
  const toolCost = input.toolCost || 0;

  const deliveryCost = foodPrice + deliveryFee + Math.max(0, minOrder - foodPrice); 
  const mType = menu.menuType || menu.type || "ALL"; 

  const mealKitCost = mType !== "DELIVERY_ONLY" 
    ? kitPrice + (kitMin / 60) * 0.2 * MIN_WAGE 
    : null; 

  const cookingCost = mType === "ALL" 
    ? ingredientCost + (cookMin / 60) * 0.2 * MIN_WAGE
      + (laborMin / 60) * MIN_WAGE + toolCost 
    : null; 

  const available = { delivery: deliveryCost, mealkit: mealKitCost, cooking: cookingCost }; 
  const filtered = Object.entries(available).filter(([, v]) => v !== null); 
  const best = filtered.reduce((a, b) => a[1] < b[1] ? a : b)[0]; 

  const breakdown = {
    delivery: [
      { label: "음식 기본가 및 옵션가 합산", value: foodPrice }, 
      { label: "배달팁", value: deliveryFee }, 
      { label: "최소주문 금액 미달 추가 비용", value: Math.max(0, minOrder - foodPrice) }
    ],
    mealkit: mealKitCost !== null ? [ 
      { label: "밀키트 1인분 환산가 합산", value: kitPrice }, 
      { label: "기회비용 (조리시간 × 0.2 × 최저임금)", value: Math.round((kitMin / 60) * 0.2 * MIN_WAGE) }, 
    ] : [],
    cooking: cookingCost !== null ? [ 
      { label: "식재료비", value: ingredientCost }, 
      { label: "기회비용 (조리시간 × 0.2 × 최저임금)", value: Math.round((cookMin / 60) * 0.2 * MIN_WAGE) }, 
      { label: "가사노동비 (설거지시간 × 0.2 x 최저임금)", value: Math.round((laborMin / 60) * 0.2 * MIN_WAGE) }, 
      { label: "도구 비용", value: toolCost }, 
    ] : [],
  };

  return {
    delivery: Math.round(deliveryCost), 
    mealkit: mealKitCost !== null ? Math.round(mealKitCost) : null, 
    cooking: cookingCost !== null ? Math.round(cookingCost) : null, 
    best, 
    saving: Math.max(0, deliveryCost - (available[best] || deliveryCost)), 
    breakdown, 
  };
}