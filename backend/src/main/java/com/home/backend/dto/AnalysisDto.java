package com.home.backend.dto;

import com.home.backend.domain.Menu.Ingredient;
import com.fasterxml.jackson.annotation.JsonProperty; 
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.util.List;

public class AnalysisDto {

    //비용 분석
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Request {
        private String menuName;
        
        @NotNull(message = "음식 가격은 필수입니다.")
        private int foodPrice;
        
        @JsonProperty("deliveryCost")
        private int deliveryFee;
        
        @NotNull(message = "최소주문금액은 필수입니다.")
        private int minOrder;
        
        private Integer kitPrice;
        private Integer kitMin;
        private Integer cookMin;
        private Integer laborMin;
        private Integer toolCost;
        private List<Ingredient> ingredientList;

        private String chickenOption;  // "뼈" / "순살"
        private String pizzaSize;      // "R" / "L"
        private String noodleSize;     // "보통" / "곱배기"
        private String portionSize;    // "소" / "중" / "대" / "특대"
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private int delivery;
        private Integer mealkit;
        private Integer cooking;
        private String best;
        private int saving;
        private Object breakdown;
    }
    @Getter
    @AllArgsConstructor
    public static class BreakdownItem {
        private String label;
        private int value;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class LoginRequest { private String userId; private String password; }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class RegisterRequest { private String userId; private String password; private String name; }

    @Getter @AllArgsConstructor @Builder
    public static class AuthResponse { private String token; private String userId; String name; }

    @Getter @AllArgsConstructor @Builder
    public static class Report { private int totalSaving; private String suggestion; private int analyzeCount; }

    @Getter @AllArgsConstructor @Builder
    public static class LogItem { private Long id; private String date; private String menu; private String chosen; private int chosenCost; private int deliveryCost; private int saving; }
}