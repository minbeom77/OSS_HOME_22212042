package com.home.backend.service;

import com.home.backend.domain.AnalysisLog;
import com.home.backend.domain.MenuType;
import com.home.backend.domain.Menu;
import com.home.backend.domain.Menu.Ingredient;
import com.home.backend.dto.AnalysisDto;
import com.home.backend.dto.AnalysisDto.BreakdownItem;
import com.home.backend.repository.AnalysisLogRepository;
import com.home.backend.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class CostCalculator {

    @Value("${home.min-wage}")
    private int minWage;

    private final MenuRepository menuRepository;
    private final AnalysisLogRepository analysisLogRepository;
    private final ExternalApiService externalApiService;

    @Transactional
    public AnalysisDto.Response calculate(String userId, AnalysisDto.Request req) {
        Menu menu = menuRepository.findByMenuName(req.getMenuName())
                .orElseGet(() -> createDynamicFallbackMenu(req.getMenuName(), req.getCategory(), req.getFoodPrice()));

        int deliveryCost = calcDelivery(req);

        Integer mealkitCost = null;
        if (menu.getMenuType() != MenuType.DELIVERY_ONLY) {
            mealkitCost = calcMealKit(req, menu); 
        }

        Integer cookingCost = null;
        int ingredientCost = 0;
        if (menu.getMenuType() == MenuType.ALL) {
            ingredientCost = resolveIngredientCost(req, menu);
            cookingCost = calcCooking(req, ingredientCost, menu); 
        }

        String best = getBestOption(deliveryCost, mealkitCost, cookingCost);
        int chosenCost = getChosenCost(best, deliveryCost, mealkitCost, cookingCost);
        int saving = Math.max(0, deliveryCost - chosenCost);

        if (userId != null && !userId.equals("guest")) {
            analysisLogRepository.save(AnalysisLog.create(
                    userId, req.getMenuName(), best,
                    chosenCost, deliveryCost, mealkitCost, cookingCost, saving));
        }

        return AnalysisDto.Response.builder()
                .delivery(deliveryCost)
                .mealkit(mealkitCost)
                .cooking(cookingCost)
                .best(best)
                .saving(saving)
                .breakdown(buildBreakdown(req, mealkitCost, cookingCost, ingredientCost, menu))
                .build();
    }

    private Menu createDynamicFallbackMenu(String menuName, String category, int foodPrice) {
        log.info("메뉴가 DB에 없어 입력가 {}원 기준으로 연산합니다.", menuName, foodPrice);
        int referencePrice = foodPrice > 0 ? foodPrice : 15000;

        int estimatedKitPrice = (int)(referencePrice * 0.55);       
        int estimatedIngredientCost = (int)(referencePrice * 0.40); 

        Menu fallbackMenu = new Menu();
        fallbackMenu.setMenuName(menuName);
        fallbackMenu.setCategory(category != null ? category : "한식");
        fallbackMenu.setMenuType(MenuType.ALL);
        fallbackMenu.setKitPrice(estimatedKitPrice);
        fallbackMenu.setDeliveryPrice(referencePrice); 
        fallbackMenu.setIngredientCost(estimatedIngredientCost);
        fallbackMenu.setDefaultCookMin(20);
        return fallbackMenu;
    }

    private int calcDelivery(AnalysisDto.Request req) {
        int finalFoodPrice = req.getFoodPrice();
        String menu = req.getMenuName();

        if ("순살".equals(req.getChickenOption())) finalFoodPrice += 2000;
        if ("L".equals(req.getPizzaSize())) finalFoodPrice += 4000;
        if ("곱배기".equals(req.getNoodleSize())) finalFoodPrice += 1000;

        if (req.getPortionSize() != null) {
            switch (req.getPortionSize()) {
                case "중" -> finalFoodPrice += 5000;
                case "대" -> {
                    if (menu.contains("보쌈")) finalFoodPrice += 18000;
                    else if (menu.contains("탕수육")) finalFoodPrice += 20000;
                    else finalFoodPrice += 10000;
                }
                case "특대" -> {
                    if (menu.contains("보쌈")) finalFoodPrice += 27000;
                    else finalFoodPrice += 20000;
                }
            }
        }

        //최소주문금액에 도달하기 위해 모자란 부족 금액 추가
        int missingCost = Math.max(0, req.getMinOrder() - finalFoodPrice);

        return finalFoodPrice + missingCost + req.getDeliveryFee();
    }

    private int calcMealKit(AnalysisDto.Request req, Menu menu) {
        int baseKitPrice = 0;
        if (req.getKitPrice() != null && req.getKitPrice() > 0) {
            baseKitPrice = req.getKitPrice();
        } else if (menu.getKitPrice() != null && menu.getKitPrice() > 0) {
            baseKitPrice = menu.getKitPrice();
        } else {
            baseKitPrice = (int)(req.getFoodPrice() * 0.55);
        }

        double perServingKitPrice = baseKitPrice / 2.0;
        int deliveryComparePrice = menu.getDeliveryPrice() != null ? menu.getDeliveryPrice() : req.getFoodPrice();
        int totalQuantity = Math.max(1, req.getFoodPrice() / (deliveryComparePrice > 0 ? deliveryComparePrice : 15000));
        int finalCalculatedKitPrice = (int)(perServingKitPrice * totalQuantity);

        int kitMin = (req.getKitMin() != null && req.getKitMin() > 0) ? req.getKitMin() : 15;
        return finalCalculatedKitPrice + (int)((kitMin / 60.0) * 0.2 * minWage);
    }

    private int calcCooking(AnalysisDto.Request req, int ingredientCost, Menu menu) {
        int cookMin = 20;
        if (req.getCookMin() != null && req.getCookMin() > 0) {
            cookMin = req.getCookMin();
        } else if (menu.getDefaultCookMin() != null) {
            cookMin = menu.getDefaultCookMin();
        }

        int laborMin = (req.getLaborMin() != null && req.getLaborMin() > 0) ? req.getLaborMin() : 10;
        int toolCost = req.getToolCost() != null ? req.getToolCost() : 0;
        
        return ingredientCost + (int)((cookMin / 60.0) * 0.2 * minWage)
                + (int)((laborMin / 60.0) * minWage) + toolCost;
    }

    private int resolveIngredientCost(AnalysisDto.Request req, Menu menu) {
        List<Ingredient> ingredients = req.getIngredientList();
        if (ingredients != null && !ingredients.isEmpty()) {
            return ingredients.stream()
                    .map(externalApiService::fetchPrice)
                    .mapToInt(Ingredient::getTotalPrice).sum();
        }
        
        try {
            List<Ingredient> fetched = externalApiService.fetchRecipe(req.getMenuName());
            if (fetched != null && !fetched.isEmpty()) {
                return fetched.stream()
                        .map(externalApiService::fetchPrice)
                        .mapToInt(Ingredient::getTotalPrice).sum();
            }
        } catch (Exception e) {
            log.warn("외부 API 레시피 연동 실패: 비례식 가격 적용");
        }
        
        return menu.getIngredientCost() != null ? menu.getIngredientCost() : (int)(req.getFoodPrice() * 0.40);
    }

    private String getBestOption(int delivery, Integer mealkit, Integer cooking) {
        Map<String, Integer> costs = new LinkedHashMap<>();
        costs.put("delivery", delivery);
        if (mealkit != null) costs.put("mealkit", mealkit);
        if (cooking != null) costs.put("cooking", cooking);
        return costs.entrySet().stream()
                .min(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey).orElse("delivery");
    }

    private int getChosenCost(String best, int delivery, Integer mealkit, Integer cooking) {
        return switch (best) {
            case "mealkit" -> mealkit != null ? mealkit : delivery;
            case "cooking" -> cooking != null ? cooking : delivery;
            default -> delivery;
        };
    }

    private Map<String, List<BreakdownItem>> buildBreakdown(
            AnalysisDto.Request req, Integer mealkit, Integer cooking, int ingredientCost, Menu menu) {
        Map<String, List<BreakdownItem>> bd = new LinkedHashMap<>();
    
        bd.put("delivery", List.of(
                new BreakdownItem("선택 메뉴 기본가 및 옵션가", req.getFoodPrice()),
                new BreakdownItem("최소주문 미달 분 부족 금액", Math.max(0, req.getMinOrder() - req.getFoodPrice())),
                new BreakdownItem("배달팁", req.getDeliveryFee())
        ));
        
        if (mealkit != null) {
            int baseKitPrice = (req.getKitPrice() != null && req.getKitPrice() > 0) ? req.getKitPrice() : (menu.getKitPrice() != null ? menu.getKitPrice() : (int)(req.getFoodPrice() * 0.55));
            double perServingKitPrice = baseKitPrice / 2.0;
            int deliveryComparePrice = menu.getDeliveryPrice() != null ? menu.getDeliveryPrice() : req.getFoodPrice();
            int totalQuantity = Math.max(1, req.getFoodPrice() / (deliveryComparePrice > 0 ? deliveryComparePrice : 15000));
            int displayKitPrice = (int)(perServingKitPrice * totalQuantity);

            int kitMin = (req.getKitMin() != null && req.getKitMin() > 0) ? req.getKitMin() : 15;
            bd.put("mealkit", List.of(
                    new BreakdownItem("밀키트 1인분 환산가 합산", displayKitPrice),
                    new BreakdownItem("기회비용 (조리시간 × 0.2 × 최저임금)", (int)((kitMin / 60.0) * 0.2 * minWage))
                ));
        }
        
        if (cooking != null) {
            int cookMin = (req.getCookMin() != null && req.getCookMin() > 0) ? req.getCookMin() : (menu.getDefaultCookMin() != null ? menu.getDefaultCookMin() : 20);
            int laborMin = (req.getLaborMin() != null && req.getLaborMin() > 0) ? req.getLaborMin() : 10;
            int toolCost = req.getToolCost() != null ? req.getToolCost() : 0;
            bd.put("cooking", List.of(
                    new BreakdownItem("식재료비", ingredientCost),
                    new BreakdownItem("기회비용 (조리시간 × 0.2 × 최저임금)", (int)((cookMin / 60.0) * 0.2 * minWage)),
                    new BreakdownItem("가사노동비 (설거지시간 × 0.2 x 최저임금)", (int)((laborMin / 60.0) * 0.2 * minWage)),
                    new BreakdownItem("도구 비용", toolCost)
            ));
        }
        return bd;
    }
}