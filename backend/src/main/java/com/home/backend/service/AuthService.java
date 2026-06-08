package com.home.backend.service;

import com.home.backend.domain.AnalysisLog;
import com.home.backend.domain.User;
import com.home.backend.dto.AnalysisDto;
import com.home.backend.repository.AnalysisLogRepository;
import com.home.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final AnalysisLogRepository analysisLogRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public AnalysisDto.AuthResponse login(AnalysisDto.LoginRequest dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("존재하지 않는 아이디입니다."));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        String token = jwtService.generateToken(user.getUserId());
        return AnalysisDto.AuthResponse.builder()
                .token(token)
                .userId(user.getUserId())
                .name(user.getName())
                .build();
    }

    @Transactional
    public AnalysisDto.AuthResponse register(AnalysisDto.RegisterRequest dto) {
        if (userRepository.existsById(dto.getUserId())) {
            throw new RuntimeException("이미 존재하는 아이디입니다.");
        }

        User user = User.create(
                dto.getUserId(),
                passwordEncoder.encode(dto.getPassword()),
                dto.getName()
        );
        userRepository.save(user);

        String token = jwtService.generateToken(user.getUserId());
        return AnalysisDto.AuthResponse.builder()
                .token(token)
                .userId(user.getUserId())
                .name(user.getName())
                .build();
    }

    public AnalysisDto.Report getMonthlyReport(String userId) {
        LocalDate startDate = LocalDate.now().minusDays(30);
        List<AnalysisLog> logs = analysisLogRepository.findByUserIdAndDateAfter(userId, startDate);
        int totalSaving = logs.stream().mapToInt(AnalysisLog::getSaving).sum();

        return AnalysisDto.Report.builder()
                .totalSaving(totalSaving)
                .analyzeCount(logs.size())
                .suggestion(totalSaving > 30000 ? "훌륭한 절약 습관입니다!" : "조금 더 절약할 수 있어요!")
                .build();
    }
    
    public List<AnalysisDto.LogItem> getAllLogs(String userId) {
        List<AnalysisLog> logs = analysisLogRepository.findByUserIdOrderByDateDesc(userId);
        return toLogItems(logs);
    }

    private List<AnalysisDto.LogItem> toLogItems(List<AnalysisLog> logs) {
        return logs.stream()
                .map(log -> AnalysisDto.LogItem.builder()
                        .id(log.getId())
                        .date(log.getDate().toString())
                        .menu(log.getMenuName())
                        .chosen(log.getBestOption())
                        .chosenCost(log.getChosenCost())
                        .deliveryCost(log.getDeliveryCost())
                        .saving(log.getSaving())
                        .build())
                .collect(Collectors.toList());
    }
}