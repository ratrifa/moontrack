package com.example.montrack.Service;

import com.example.montrack.DTO.ApiResponse;
import com.example.montrack.Models.Category;
import com.example.montrack.Repositories.CategoryRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    public ApiResponse<Category> addCategory(Category category) {
        if (category == null || category.getName() == null) {
            return new ApiResponse<>(false, "Category data is invalid", null);
        }
        Category savedCategory = categoryRepository.save(category);
        return new ApiResponse<>(true, "Category added successfully", savedCategory);
    }

    public ApiResponse<List<Category>> getCategories(String type) {
        List<Category> categories = categoryRepository.findByType(type);
        if (categories.isEmpty()) {
            return new ApiResponse<>(false, "No categories found", null);
        }
        return new ApiResponse<>(true, "Categories retrieved successfully", categories);
    }

    public ApiResponse<Void> deleteCategory(Long categoryId) {
        if (!categoryRepository.existsById(categoryId)) {
            return new ApiResponse<>(false, "Category not found", null);
        }
        categoryRepository.deleteById(categoryId);
        return new ApiResponse<>(true, "Category deleted successfully", null);
    }
}
