package com.home.backend.controller;

import com.home.backend.domain.Menu;
import com.home.backend.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@CrossOrigin(origins = {"http://localhost:5173", "https://oss-home-22212042-gtpn.vercel.app"})
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
        String targetName = menuName;
        if (menuName != null && menuName.contains(",")) {
            targetName = menuName.split(",")[0].trim();
        }

        Optional<Menu> menuOpt = menuRepository.findByMenuName(targetName);
        Map<String, Object> result = new HashMap<>();

        if (menuOpt.isPresent()) {
            Menu menu = menuOpt.get();
            result.put("kitPrice", menu.getKitPrice() != null ? menu.getKitPrice() : 0);
            result.put("kitMin", 15); 
            result.put("cookMin", menu.getDefaultCookMin() != null ? menu.getDefaultCookMin() : 20);
            result.put("menuType", menu.getMenuType() != null ? menu.getMenuType().name() : "ALL"); 
            result.put("minOrder", menu.getMinOrder() != null ? menu.getMinOrder() : 0);
            result.put("ingredientCost", menu.getIngredientCost() != null ? menu.getIngredientCost() : 0);
        } else {
            result.put("kitPrice", 0);
            result.put("kitMin", 15);
            result.put("cookMin", 20);
            result.put("menuType", "ALL");
            result.put("minOrder", 0);
            result.put("ingredientCost", 0);
        }
        return ResponseEntity.ok(result);
    }
}