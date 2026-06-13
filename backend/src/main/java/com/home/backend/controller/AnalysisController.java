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
@CrossOrigin(origins = {"http://localhost:5173", "https://oss-home-22212042-gtpn.vercel.app"})
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
        String menuName = payload.get("menuName"); 

        if (!"guest".equals(resolvedUid)) {
            List<AnalysisLog> recentLogs = analysisLogRepository.findByUserIdOrderByIdDesc(resolvedUid);
            
            AnalysisLog targetLog = recentLogs.stream()
                    .filter(log -> log.getMenuName().equals(menuName))
                    .findFirst()
                    .orElse(null);

            if (targetLog != null) {
                int chosenCost = targetLog.getDeliveryCost(); 
                
                if ("mealkit".equals(chosen) && targetLog.getMealkitCost() != null) {
                    chosenCost = targetLog.getMealkitCost();
                } else if ("cooking".equals(chosen) && targetLog.getCookingCost() != null) {
                    chosenCost = targetLog.getCookingCost();
                }

                targetLog.setChosen(chosen);
                targetLog.setChosenCost(chosenCost);
                targetLog.setSaving(Math.max(0, targetLog.getDeliveryCost() - chosenCost));

                analysisLogRepository.save(targetLog);
                log.info("최종 선택 저장 완료 - 메뉴: {}, 유저 선택: {}", menuName, chosen);
            } else {
                log.warn("업데이트할 대상 로그를 찾지 못했습니다. - 메뉴: {}", menuName);
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