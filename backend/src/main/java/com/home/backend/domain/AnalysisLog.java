package com.home.backend.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "analysis_logs")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class AnalysisLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String userId;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false, length = 60)
    private String menuName;

    @Column(nullable = false)
    private String bestOption;   // 시스템이 추천한 최적의 대안 (DELIVERY / MEALKIT / COOKING)

    @Column(nullable = false)
    private int chosenCost;      // 유저가 최종 선택한 방식의 실제 비용

    @Column(nullable = false)
    private int deliveryCost;    // 비교 기준이 되는 배달 총비용

    private Integer mealkitCost; 
    private Integer cookingCost; 

    @Column(nullable = false)
    private int saving;          

    public static AnalysisLog create(String userId, String menuName,
                                     String bestOption, int chosenCost,
                                     int deliveryCost, Integer mealkitCost,
                                     Integer cookingCost, int saving) {
        return AnalysisLog.builder()
                .userId(userId)
                .date(LocalDate.now()) 
                .menuName(menuName)
                .bestOption(bestOption)
                .chosenCost(chosenCost)
                .deliveryCost(deliveryCost)
                .mealkitCost(mealkitCost)
                .cookingCost(cookingCost)
                .saving(saving)      
                .build();
    }
}