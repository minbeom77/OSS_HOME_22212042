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
        AnalysisDto.Response response = costCalculator.calculate(resolvedUid, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/select")
    public ResponseEntity<Map<String, String>> saveFinalSelection(
            @AuthenticationPrincipal String userId,
            @RequestBody Map<String, String> payload) {
        
        String resolvedUid = (userId == null) ? "guest" : userId;
        String menuName = payload.get("menuName");
        String chosen = payload.get("chosen"); 

        if (!"guest".equals(resolvedUid)) {
            List<AnalysisLog> recentLogs = analysisLogRepository.findByUserIdOrderByDateDesc(resolvedUid);
            
            if (!recentLogs.isEmpty()) {
                AnalysisLog lastLog = recentLogs.get(0); 
                
                int chosenCost = lastLog.getDeliveryCost(); 
                if ("mealkit".equals(chosen) && lastLog.getMealkitCost() != null) {
                    chosenCost = lastLog.getMealkitCost();
                } else if ("cooking".equals(chosen) && lastLog.getCookingCost() != null) {
                    chosenCost = lastLog.getCookingCost();
                }
                
                int saving = Math.max(0, lastLog.getDeliveryCost() - chosenCost);

                lastLog.setChosen(chosen);
                lastLog.setChosenCost(chosenCost);
                lastLog.setSaving(saving);

                analysisLogRepository.save(lastLog);
                log.info("[Analysis] 최종 선택 DB 업데이트 완료 - 아낀금액: {}", saving);
            }
        }

        return ResponseEntity.ok(Map.of("status", "success"));
    }

    @GetMapping("/logs")
    public ResponseEntity<List<AnalysisLog>> getAnalysisLogs(@AuthenticationPrincipal String userId) {
        if (userId == null || userId.equals("guest")) {
            return ResponseEntity.ok(List.of());
        }
        
        List<AnalysisLog> logs = analysisLogRepository.findByUserIdOrderByDateDesc(userId);
        return ResponseEntity.ok(logs);
    }
}