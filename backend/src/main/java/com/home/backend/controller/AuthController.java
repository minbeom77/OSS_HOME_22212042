package com.home.backend.controller;

import com.home.backend.dto.AnalysisDto;
import com.home.backend.service.AuthService;
import com.home.backend.service.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    // POST /api/auth/login
    @PostMapping("/api/auth/login")
    public ResponseEntity<AnalysisDto.AuthResponse> login(
            @RequestBody AnalysisDto.LoginRequest dto) {
        return ResponseEntity.ok(authService.login(dto));
    }

    // POST /api/auth/register
    @PostMapping("/api/auth/register")
    public ResponseEntity<AnalysisDto.AuthResponse> register(
            @RequestBody AnalysisDto.RegisterRequest dto) {
        return ResponseEntity.ok(authService.register(dto));
    }

    // GET /api/report/monthly
    @GetMapping("/api/report/monthly")
    public ResponseEntity<AnalysisDto.Report> getMonthlyReport(
            @RequestHeader("Authorization") String authHeader) {
        String userId = jwtService.extractUserId(authHeader.substring(7));
        return ResponseEntity.ok(authService.getMonthlyReport(userId));
    }

    // GET /api/report/logs
    @GetMapping("/api/report/logs")
    public ResponseEntity<List<AnalysisDto.LogItem>> getAllLogs(
            @RequestHeader("Authorization") String authHeader) {
        String userId = jwtService.extractUserId(authHeader.substring(7));
        return ResponseEntity.ok(authService.getAllLogs(userId));
    }
}