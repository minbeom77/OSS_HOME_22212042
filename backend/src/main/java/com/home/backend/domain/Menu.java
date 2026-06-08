package com.home.backend.domain;

import jakarta.persistence.*;                     
import lombok.*;                                        
import java.util.List;                                   

@Entity
@Table(name = "menus")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Menu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 20)
    private String category;       // 한식, 중식, 일식 등 상위 카테고리

    @Column(nullable = false, length = 30)
    private String subCategory;    // 찌개, 구이, 탕 등 하위 세부 분류

    @Column(nullable = false, length = 60)
    private String menuName;       // 상세 메뉴명 (예: 김치찌개)

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MenuType menuType;     // ALL / DELIVERY_ONLY 등 조리 가능 여부 제어

    // VirtualMart 가격들
    private Integer deliveryPrice;  // 배달 음식 기준 평단가
    private Integer minOrder;       // 배달 최소 주문 금액 기준선
    private Integer ingredientCost; // 외부 API 장애 시 대체할 기본 식재료비
    private Integer defaultCookMin; // 레시피 API 장애 시 대체할 기본 조리 시간
    private Integer kitPrice;       // 시판 밀키트 표준 가격

    @Embeddable
    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Ingredient {
        private String name;       // 재료명 (정규화 후)
        private String unit;       // 단위 (g, ml, 개 등)
        private double amount;     // 수량
        private int unitPrice;     // 단위가격 (쇼핑 API 조회 결과)

        public int getTotalPrice() {
            return (int) (unitPrice * amount);
        }
    }
}