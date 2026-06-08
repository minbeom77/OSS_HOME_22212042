package com.home.backend.domain;

public enum MenuType {
    ALL,           // 배달 + 밀키트 + 직접조리 모두 가능
    NO_COOKING,    // 밀키트 + 배달만 가능
    DELIVERY_ONLY  // 배달 전용
}