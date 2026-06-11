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
        
        String tempName = req.getMenuName();
        if (tempName != null && tempName.contains(",")) {
            tempName = tempName.split(",")[0].trim();
        }
        final String targetName = tempName;   
        Menu menu = menuRepository.findByMenuName(targetName)
                .orElseGet(() -> createDynamicFallbackMenu(targetName, null, req.getFoodPrice()));

        int deliveryCost = calcDelivery(req);
        Integer mealkitCost = null;
        if (menu.getMenuType() != MenuType.DELIVERY_ONLY) {
            mealkitCost = calcMealKit(req, menu); 
        }

        Integer cookingCost = null;
        if (menu.getMenuType() == MenuType.ALL) {
            cookingCost = calcCooking(req, menu);
        }

        String bestOpt = getBestOption(deliveryCost, mealkitCost, cookingCost);
        Map<String, List<BreakdownItem>> bd = buildBreakdown(req, mealkitCost, cookingCost, resolveIngredientCost(req, menu), menu);
        AnalysisLog log = AnalysisLog.create(
                userId, req.getMenuName(), bestOpt,
                getChosenCost(bestOpt, deliveryCost, mealkitCost, cookingCost),
                deliveryCost, mealkitCost, cookingCost,
                Math.max(0, deliveryCost - getChosenCost(bestOpt, deliveryCost, mealkitCost, cookingCost))
        );

        if (!"guest".equals(userId)) {
            analysisLogRepository.save(log);
        }

        return AnalysisDto.Response.builder()
                .delivery(deliveryCost)
                .mealkit(mealkitCost)
                .cooking(cookingCost)
                .best(bestOpt)
                .saving(log.getSaving())
                .breakdown(bd)
                .build();
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

    private int calcDelivery(AnalysisDto.Request req) {
        int lack = Math.max(0, req.getMinOrder() - req.getFoodPrice());
        return req.getFoodPrice() + lack + req.getDeliveryFee();
    }

    private int calcMealKit(AnalysisDto.Request req, Menu menu) {
        int kitPrice = (req.getKitPrice() != null && req.getKitPrice() > 0) ? req.getKitPrice() : 
                (menu.getKitPrice() != null ? menu.getKitPrice() : (int)(req.getFoodPrice() * 0.55));
        int kitMin = req.getKitMin() != null ? req.getKitMin() : 15;
        int oppCost = (int) Math.round((kitMin / 60.0) * 0.2 * minWage);
        return kitPrice + oppCost;
    }

    private int calcCooking(AnalysisDto.Request req, Menu menu) {
        int ingredientCost = resolveIngredientCost(req, menu);
        int cookMin = req.getCookMin() != null ? req.getCookMin() : menu.getDefaultCookMin();
        int laborMin = req.getLaborMin() != null ? req.getLaborMin() : 15;
        int toolCost = req.getToolCost() != null ? req.getToolCost() : 0;

        int oppCost = (int) Math.round((cookMin / 60.0) * 0.2 * minWage);
        int laborCost = (int) Math.round((laborMin / 60.0) * minWage);
        return ingredientCost + oppCost + laborCost + toolCost;
    }

    private int resolveIngredientCost(AnalysisDto.Request req, Menu menu) {
        if (req.getIngredientCost() != null && req.getIngredientCost() > 0) {
            return req.getIngredientCost();
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
                new BreakdownItem("기본가 및 옵션가", req.getFoodPrice()),
                new BreakdownItem("최소주문 부족금액", Math.max(0, req.getMinOrder() - req.getFoodPrice())),
                new BreakdownItem("배달팁", req.getDeliveryFee())
        ));

        if (mealkit != null) {
            bd.put("mealkit", List.of(
                    new BreakdownItem("밀키트 구매가", (int)(req.getFoodPrice() * 0.55)),
                    new BreakdownItem("조리 기회비용", (int) Math.round((15 / 60.0) * 0.2 * minWage))
            ));
        }
        if (cooking != null) {
            bd.put("cooking", List.of(
                    new BreakdownItem("식재료비", ingredientCost),
                    new BreakdownItem("조리 기회비용", (int) Math.round((menu.getDefaultCookMin() / 60.0) * 0.2 * minWage)),
                    new BreakdownItem("가사노동비", (int) Math.round((15 / 60.0) * minWage)),
                    new BreakdownItem("도구비용", req.getToolCost() != null ? req.getToolCost() : 0)
            ));
        }
        return bd;
    }
}