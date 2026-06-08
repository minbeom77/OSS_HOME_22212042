package com.home.backend.controller;

import com.home.backend.domain.Menu;
import com.home.backend.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
public class MenuController {

    private final MenuRepository menuRepository;

    @GetMapping
    public ResponseEntity<List<Menu>> getAllMenus() {
        return ResponseEntity.ok(menuRepository.findAll());
    }

    @GetMapping("/{category}")
    public ResponseEntity<List<Menu>> getMenusByCategory(@PathVariable String category) {
        return ResponseEntity.ok(menuRepository.findByCategory(category));
    }

   @GetMapping("/details")
    public ResponseEntity<Map<String, Object>> getMenuDetails(@RequestParam("menuName") String menuName) {
        Optional<Menu> menuOpt = menuRepository.findByMenuName(menuName);
        
        Map<String, Object> result = new HashMap<>();
        if (menuOpt.isPresent()) {
            Menu menu = menuOpt.get();
            result.put("kitPrice", menu.getKitPrice() != null ? menu.getKitPrice() : 0);
            result.put("kitMin", 15); 
            result.put("cookMin", menu.getDefaultCookMin() != null ? menu.getDefaultCookMin() : 20);
        } else {
            result.put("kitPrice", 0);
            result.put("kitMin", 15);
            result.put("cookMin", 20);
        }
        return ResponseEntity.ok(result);
    }
}