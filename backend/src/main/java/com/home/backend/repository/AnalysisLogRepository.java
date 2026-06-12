package com.home.backend.repository;

import com.home.backend.domain.AnalysisLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface AnalysisLogRepository extends JpaRepository<AnalysisLog, Long> {

    List<AnalysisLog> findByUserIdOrderByIdDesc(String userId);

    @Query("SELECT a FROM AnalysisLog a WHERE a.userId = :userId AND a.date >= :startDate ORDER BY a.id DESC")
    List<AnalysisLog> findByUserIdAndDateAfter(@Param("userId") String userId, @Param("startDate") LocalDate startDate);
}