package com.home.backend.dto;

import com.home.backend.domain.Menu.Ingredient;
import com.fasterxml.jackson.annotation.JsonProperty; 
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.util.List;

public class AnalysisDto {

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
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
        private Integer ingredientCost; 
        
        private List<Ingredient> ingredientList;

        private String chickenOption;  
        private String pizzaSize;      
        private String noodleSize;     
        private String portionSize;    
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class Response {
        private int delivery;
        private Integer mealkit;
        private Integer cooking;
        private String best;
        private int saving;
        private Object breakdown;
    }

    @Getter @AllArgsConstructor
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
    public static class LogItem { 
        private Long id; 
        private String date; 
        private String menuName; 
        private String bestOption;
        private String chosen; 
        private int chosenCost; 
        private int deliveryCost; 
        private int saving; 
    }
}