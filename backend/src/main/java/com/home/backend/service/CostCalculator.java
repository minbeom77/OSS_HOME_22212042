package com.home.backend.service;

import com.home.backend.domain.AnalysisLog;
import com.home.backend.domain.MenuType;
import com.home.backend.domain.Menu;
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
        
        String tempName = req.getMenuName();
        if (tempName != null && tempName.contains(",")) {
            tempName = tempName.split(",")[0].trim();
        }
        final String targetName = tempName;   
        
        Menu menu = menuRepository.findByMenuName(targetName)
                .orElseGet(() -> createDynamicFallbackMenu(targetName, null, req.getFoodPrice()));
      
        int lack = Math.max(0, req.getMinOrder() - req.getFoodPrice());
        int deliveryCost = req.getFoodPrice() + lack + req.getDeliveryFee();

        Integer mealkitCost = null;
        int mkPrice = 0, mkOppCost = 0;
        
        if (menu.getMenuType() != MenuType.DELIVERY_ONLY) {
            mkPrice = resolveMealKitPrice(targetName, req, menu);
            int kitMin = req.getKitMin() != null ? req.getKitMin() : 15;
            mkOppCost = (int) Math.round((kitMin / 60.0) * 0.2 * minWage);
            mealkitCost = mkPrice + mkOppCost;
        }

        Integer cookingCost = null;
        int ingCost = 0, ckOppCost = 0, ckLaborCost = 0, ckToolCost = 0;
        
        if (menu.getMenuType() == MenuType.ALL) {
            ingCost = resolveIngredientCost(targetName, req, menu);
            int cookMin = req.getCookMin() != null ? req.getCookMin() : menu.getDefaultCookMin();
            int laborMin = req.getLaborMin() != null ? req.getLaborMin() : 15;
            ckToolCost = req.getToolCost() != null ? req.getToolCost() : 0;

            ckOppCost = (int) Math.round((cookMin / 60.0) * 0.2 * minWage);
            ckLaborCost = (int) Math.round((laborMin / 60.0) * minWage);
            cookingCost = ingCost + ckOppCost + ckLaborCost + ckToolCost;
        }
        Map<String, List<BreakdownItem>> bd = new LinkedHashMap<>();
        
        bd.put("delivery", List.of(
                new BreakdownItem("기본가 및 옵션가", req.getFoodPrice()),
                new BreakdownItem("최소주문 미달 부족금액", lack),
                new BreakdownItem("배달팁", req.getDeliveryFee())
        ));

        if (mealkitCost != null) {
            bd.put("mealkit", List.of(
                    new BreakdownItem("밀키트 구매가", mkPrice),
                    new BreakdownItem("조리 기회비용", mkOppCost)
            ));
        }

        if (cookingCost != null) {
            bd.put("cooking", List.of(
                    new BreakdownItem("순수 식재료비", ingCost),
                    new BreakdownItem("조리 기회비용", ckOppCost),
                    new BreakdownItem("가사노동비(설거지 등)", ckLaborCost),
                    new BreakdownItem("소모 도구 비용", ckToolCost)
            ));
        }


        String bestOpt = getBestOption(deliveryCost, mealkitCost, cookingCost);
        
        AnalysisLog logData = AnalysisLog.create(
                userId, req.getMenuName(), bestOpt,
                getChosenCost(bestOpt, deliveryCost, mealkitCost, cookingCost),
                deliveryCost, mealkitCost, cookingCost,
                Math.max(0, deliveryCost - getChosenCost(bestOpt, deliveryCost, mealkitCost, cookingCost))
        );

        if (!"guest".equals(userId)) {
            analysisLogRepository.save(logData);
        }

        return AnalysisDto.Response.builder()
                .delivery(deliveryCost)
                .mealkit(mealkitCost)
                .cooking(cookingCost)
                .best(bestOpt)
                .saving(logData.getSaving())
                .breakdown(bd) 
                .build();
    }

    private int resolveIngredientCost(String menuName, AnalysisDto.Request req, Menu menu) {
        // 1순위: 사용자가 직접 입력한 값이 있으면 우선 적용
        if (req.getIngredientCost() != null && req.getIngredientCost() > 0) return req.getIngredientCost();
        
        // 2순위: 백엔드에서 외부 API(농촌진흥청/네이버 등)를 직접 호출
        try {
            Integer apiCost = externalApiService.fetchIngredientCost(menuName);
            if (apiCost != null && apiCost > 0) return apiCost;
        } catch (Exception e) {
            log.warn("외부 API 식재료비 조회 실패, DB 데이터로 폴백합니다. 메뉴: {}", menuName);
        }

        return menu.getIngredientCost() != null ? menu.getIngredientCost() : (int)(req.getFoodPrice() * 0.40);
    }

    private int resolveMealKitPrice(String menuName, AnalysisDto.Request req, Menu menu) {
        if (req.getKitPrice() != null && req.getKitPrice() > 0) return req.getKitPrice();
        
        try {
            Integer apiCost = externalApiService.fetchMealKitPrice(menuName);
            if (apiCost != null && apiCost > 0) return apiCost;
        } catch (Exception e) {
            log.warn("외부 API 밀키트비 조회 실패, DB 데이터로 폴백합니다. 메뉴: {}", menuName);
        }

        return menu.getKitPrice() != null ? menu.getKitPrice() : (int)(req.getFoodPrice() * 0.55);
    }

    private Menu createDynamicFallbackMenu(String name, String subCat, int foodPrice) {
        return Menu.builder()
                .menuName(name)
                .subCategory(subCat != null ? subCat : "기타")
                .menuType(MenuType.ALL) 
                .deliveryPrice((int)(foodPrice * 1.1))
                .minOrder(15000)
                .ingredientCost((int)(foodPrice * 0.4))
                .defaultCookMin(20)
                .build();
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
}