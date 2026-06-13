package com.home.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.home.backend.domain.Menu.Ingredient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExternalApiService {

    @Value("${nongsaro.api.key}")
    private String nongsaroKey;

    @Value("${naver.api.client-id}")
    private String naverClientId;

    @Value("${naver.api.client-secret}")
    private String naverClientSecret;

    private final WebClient webClient;

    private static final Map<String, String> NORMALIZE_MAP = Map.of(
            "돼지고기(앞다리살)", "돼지 앞다리살",
            "두부(찌개용)", "찌개용 두부",
            "김치(신김치)", "신김치"
    );

    public Integer fetchIngredientCost(String menuName) {
        log.info("▶ [External API] '{}' 식재료 원가 총합 계산 시작...", menuName);
        try {
            // 1. 농사로 API에서 레시피(재료 목록) 가져오기
            List<Ingredient> recipe = fetchRecipe(menuName);
            if (recipe == null || recipe.isEmpty()) return null;

            int totalCost = 0;
            // 2. 각 재료별로 네이버 쇼핑 최저가를 긁어와서 합산
            for (Ingredient ing : recipe) {
                Ingredient pricedIng = fetchPrice(ing);
                totalCost += pricedIng.getUnitPrice();
            }
            return totalCost > 0 ? totalCost : null;
        } catch (Exception e) {
            log.error("식재료비 총합 계산 중 오류: {}", e.getMessage());
            return null;
        }
    }
    public Integer fetchMealKitPrice(String menuName) {
        log.info("▶ [External API] '{} 밀키트' 최저가 조회 시작...", menuName);
        try {
            Ingredient searchTarget = Ingredient.builder().name(menuName + " 밀키트").build();
            Ingredient result = fetchPrice(searchTarget);
            
            if (result.getUnitPrice() == 500) return null; 
            return result.getUnitPrice();
        } catch (Exception e) {
            log.error("밀키트 API 조회 중 오류: {}", e.getMessage());
            return null;
        }
    }

    @SuppressWarnings("unchecked")
    public List<Ingredient> fetchRecipe(String menuName) {
        try {
            log.info("[H.O.M.E] 농사로 레시피 -> 키워드: {}", menuName);
            Map response = webClient.get()
                    .uri(u -> u.scheme("https").host("api.nongsaro.go.kr")
                            .path("/service/foodList/foodListInfo")
                            .queryParam("apiKey", nongsaroKey)
                            .queryParam("keyword", menuName)
                            .queryParam("numOfRows", 1)
                            .queryParam("dataFormat", "json").build())
                    .retrieve().bodyToMono(Map.class).block();

            if (response == null) return List.of();
            return normalizeIngredients(parseIngredients(response));
        } catch (Exception e) {
            log.error("[ExternalApiService] 레시피 API 최종 실패, fallback 가동: {}", e.getMessage(), e);
            return List.of();
        }
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, String>> parseIngredients(Map response) {
        try {
            Map responseMap = (Map) response.get("response");
            Map body = (Map) responseMap.get("body");
            Map itemsContainer = (Map) body.get("items");
            
            Object itemObj = itemsContainer.get("item");
            if (itemObj instanceof List) {
                return (List<Map<String, String>>) itemObj;
            } else if (itemObj instanceof Map) {
                return List.of((Map<String, String>) itemObj);
            }
            return List.of();
        } catch (Exception e) { 
            log.warn("[ExternalApiService] 농사로 API 에러: {}", e.getMessage());
            return List.of(); 
        }
    }

    private List<Ingredient> normalizeIngredients(List<Map<String, String>> rawList) {
        return rawList.stream().map(raw -> {
            String rawName = raw.getOrDefault("foodNm", "");
            String normalized = NORMALIZE_MAP.getOrDefault(rawName, rawName);
            double amount = parseAmount(raw.getOrDefault("irdntCpcty", "100"));
            return Ingredient.builder().name(normalized)
                    .unit(raw.getOrDefault("irdntUnit", "g"))
                    .amount(amount).unitPrice(0).build();
        }).collect(Collectors.toList());
    }
    
    // 2. 네이버 쇼핑 API 단가 조회
    @SuppressWarnings("unchecked")
    public Ingredient fetchPrice(Ingredient ingredient) {
        try {
            log.info("[H.O.M.E] 네이버 쇼핑 실시간 단가 추적 시작 -> 검색어: {}", ingredient.getName());
            Map response = webClient.get()
                    .uri(u -> u.scheme("https").host("openapi.naver.com")
                            .path("/v1/search/shop.json")
                            .queryParam("query", ingredient.getName())
                            .queryParam("display", 1).build())
                    .header("X-Naver-Client-Id", naverClientId)
                    .header("X-Naver-Client-Secret", naverClientSecret)
                    .retrieve().bodyToMono(Map.class).block();

            int price = parsePrice(response);
            
            return Ingredient.builder().name(ingredient.getName())
                    .unit(ingredient.getUnit()).amount(ingredient.getAmount())
                    .unitPrice(price).build();
        } catch (Exception e) {
            log.warn("[ExternalApiService] 네이버 쇼핑 API 통신 장애 [{}], fallback 500원 강제 주입", ingredient.getName());
            return Ingredient.builder().name(ingredient.getName())
                    .unit(ingredient.getUnit()).amount(ingredient.getAmount())
                    .unitPrice(500).build();
        }
    }

    @SuppressWarnings("unchecked")
    private int parsePrice(Map response) {
        try {
            if (response == null) return 500;
            
            List<Map<String, Object>> items = (List<Map<String, Object>>) response.get("items");
            if (items == null || items.isEmpty()) {
                log.warn("[ExternalApiService] 네이버 쇼핑 검색 결과 없음. 기본값 복구.");
                return 500;
            }
            
            // 첫 번째 매칭 아이템 최저가 추출
            Object lpriceObj = items.get(0).get("lprice");
            if (lpriceObj != null) {
                return Integer.parseInt(lpriceObj.toString());
            }
            return 500;
        } catch (Exception e) { 
            log.warn("[ExternalApiService] 네이버 파싱 예외 발생: {}", e.getMessage());
            return 500; 
        }
    }

    private double parseAmount(String amount) {
        try { return Double.parseDouble(amount.replaceAll("[^0-9.]", "")); }
        catch (NumberFormatException e) { return 100.0; }
    }
}