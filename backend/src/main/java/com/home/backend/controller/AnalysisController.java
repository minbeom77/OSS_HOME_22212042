package com.home.backend.controller;

import com.home.backend.dto.AnalysisDto;
import com.home.backend.service.CostCalculator;
import com.home.backend.service.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j; 
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j 
@RestController
@RequestMapping("/api/analysis") 
@RequiredArgsConstructor
public class AnalysisController {

    private final CostCalculator costCalculator;
    private final JwtService jwtService;

    @PostMapping
    public ResponseEntity<AnalysisDto.Response> analyze(
            @Valid @RequestBody AnalysisDto.Request dto,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        
        // 실제 회원 ID 또는 guest 확보
        String userId = extractUserId(authHeader);
        
        if ("guest".equalsIgnoreCase(userId)) {
            log.info("[GUEST 요청 감지] 비용 연산만 수행하고 DB 로그 저장은 안전하게 스킵합니다.");
        } else {
            log.info("🔐 유저 ID: {} - 비용 분석 연산 및 지출 로그 적재를 시작합니다", userId);
        }
        
        return ResponseEntity.ok(costCalculator.calculate(userId, dto));
    }

    private String extractUserId(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return "guest";
        try { 
            return jwtService.extractUserId(authHeader.substring(7)); 
        } catch (Exception e) { 
            log.warn("⚠️ 에러 발생 : guest 모드로 전환합니다.");
            return "guest"; 
        }
    }
}