package com.home.backend.controller;

import com.home.backend.dto.AnalysisDto;
import com.home.backend.service.CostCalculator;
import com.home.backend.repository.AnalysisLogRepository;
import com.home.backend.domain.AnalysisLog;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/analysis")
@RequiredArgsConstructor
public class AnalysisController {

    private final CostCalculator costCalculator;
    private final AnalysisLogRepository analysisLogRepository;

    @PostMapping
    public ResponseEntity<AnalysisDto.Response> calculateCost(
            @AuthenticationPrincipal String userId,
            @RequestBody AnalysisDto.Request request) {
        
        String resolvedUid = (userId == null) ? "guest" : userId;
        return ResponseEntity.ok(costCalculator.calculate(resolvedUid, request));
    }

    @PostMapping("/select")
    public ResponseEntity<Map<String, String>> saveFinalSelection(
            @AuthenticationPrincipal String userId,
            @RequestBody Map<String, String> payload) {
        
        String resolvedUid = (userId == null) ? "guest" : userId;
        
        String chosen = payload.get("chosen"); 

        if (!"guest".equals(resolvedUid)) {
            List<AnalysisLog> recentLogs = analysisLogRepository.findByUserIdOrderByIdDesc(resolvedUid);
            
            if (!recentLogs.isEmpty()) {
                AnalysisLog lastLog = recentLogs.get(0); 
                
                int chosenCost = lastLog.getDeliveryCost(); // 기본 배달가 세팅

                if ("mealkit".equals(chosen) && lastLog.getMealkitCost() != null) {
                    chosenCost = lastLog.getMealkitCost();
                } else if ("cooking".equals(chosen) && lastLog.getCookingCost() != null) {
                    chosenCost = lastLog.getCookingCost();
                }

                lastLog.setChosen(chosen);
                lastLog.setChosenCost(chosenCost);
                lastLog.setSaving(Math.max(0, lastLog.getDeliveryCost() - chosenCost));

                analysisLogRepository.save(lastLog);
                log.info("[Analysis] 최종 선택 저장 완료 - 유저의 순수 선택: {}", chosen);
            }
        }

        return ResponseEntity.ok(Map.of("status", "success"));
    }

    @GetMapping("/logs")
    public ResponseEntity<List<AnalysisLog>> getAnalysisLogs(@AuthenticationPrincipal String userId) {
        if (userId == null || userId.equals("guest")) {
            return ResponseEntity.ok(List.of());
        }
        return ResponseEntity.ok(analysisLogRepository.findByUserIdOrderByIdDesc(userId));
    }
}