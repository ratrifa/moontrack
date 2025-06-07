package com.example.montrack.Controller;

import com.example.montrack.DTO.ApiResponse;
import com.example.montrack.Models.Category;
import com.example.montrack.Service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    @PostMapping
    public ResponseEntity<ApiResponse<Category>> addCategory(@RequestBody Category category) {
        ApiResponse<Category> response = categoryService.addCategory(category);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(400).body(response);
        }
    }

    @GetMapping("/{type}")
    public ResponseEntity<ApiResponse<List<Category>>> getCategories(@PathVariable String type) {
        ApiResponse<List<Category>> response = categoryService.getCategories(type);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(400).body(response);
        }
    }

    @DeleteMapping("/{categoryId}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long categoryId) {
        ApiResponse<Void> response = categoryService.deleteCategory(categoryId);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(400).body(response);
        }
    }
}
