package com.vaibhav.controller;

import com.vaibhav.model.Home;
import com.vaibhav.model.HomeCategory;
import com.vaibhav.service.HomeCategoryService;
import com.vaibhav.service.HomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/home")
@CrossOrigin(origins = "*")
public class HomeCategoryController {

    private final HomeCategoryService homeCategoryService;
    private final HomeService homeService;

    // ✅ USER API (FIXES YOUR ISSUE)
    @GetMapping("/categories")
    public ResponseEntity<List<HomeCategory>> getHomeCategoriesForUsers() {
        List<HomeCategory> categories = homeCategoryService.getAllHomeCategories();
        return ResponseEntity.ok(categories);
    }

    // ✅ ADMIN CREATE
    @PostMapping("/categories")
    public ResponseEntity<Home> createHomeCategories(
            @RequestBody List<HomeCategory> homeCategories
    ) {
        List<HomeCategory> categories =
                homeCategoryService.createCategories(homeCategories);

        Home home = homeService.createHomePageData(categories);
        return new ResponseEntity<>(home, HttpStatus.CREATED);
    }

    // ✅ ADMIN VIEW
    @GetMapping("/admin/home-category")
    public ResponseEntity<List<HomeCategory>> getHomeCategories() {
        return ResponseEntity.ok(homeCategoryService.getAllHomeCategories());
    }

    // ✅ ADMIN UPDATE
    @PatchMapping("/admin/home-category/{id}")
    public ResponseEntity<HomeCategory> updateHomeCategory(
            @PathVariable Long id,
            @RequestBody HomeCategory homeCategory) throws Exception {

        HomeCategory updatedCategory = homeCategoryService.updateHomeCategory(homeCategory, id);
        return ResponseEntity.ok(updatedCategory);
    }
}
