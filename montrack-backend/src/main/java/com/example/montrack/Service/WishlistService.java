package com.example.montrack.Service;

import com.example.montrack.DTO.ApiResponse;
import com.example.montrack.Models.Wishlist;
import com.example.montrack.Repositories.WishlistRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class WishlistService {
    @Autowired
    private WishlistRepository wishlistRepository;

    public ApiResponse<Wishlist> addWishlist(Wishlist wishlist) {
        if (wishlist == null || wishlist.getUser().getUserId() == 0 || wishlist.getName() == null) {
            return new ApiResponse<>(false, "Wishlist data is invalid", null);
        }

        double savingAmountPerMonth = wishlist.getSaving();
        double targetAmount = wishlist.getBudget();

        if (savingAmountPerMonth <= 0 || targetAmount <= 0) {
            return new ApiResponse<>(false, "Saving amount and target amount must be greater than zero", null);
        }

        // Calculate months required to reach the target
        int monthsRequired = (int) Math.ceil(targetAmount / savingAmountPerMonth);

        // Parse the createdAt date
        LocalDate createdAt = LocalDate.parse(wishlist.getCreatedAt(), DateTimeFormatter.ISO_DATE);

        // Calculate reachedDate
        LocalDate reachedDate = createdAt.plusMonths(monthsRequired);

        // Set reachedDate in Wishlist
        wishlist.setReachedDate(reachedDate.toString());

        Wishlist savedWishlist = wishlistRepository.save(wishlist);
        return new ApiResponse<>(true, "Wishlist added successfully", savedWishlist);
    }

    public ApiResponse<Void> deleteWishlist(Long wishlistId) {
        if (!wishlistRepository.existsById(wishlistId)) {
            return new ApiResponse<>(false, "Wishlist not found", null);
        }
        wishlistRepository.deleteById(wishlistId);
        return new ApiResponse<>(true, "Wishlist deleted successfully", null);
    }

    public ApiResponse<List<Wishlist>> getAllWishlist(Long userId) {
        List<Wishlist> wishlists = wishlistRepository.findByUser_UserId(userId);
        if (wishlists.isEmpty()) {
            return new ApiResponse<>(true, "No wishlist found", null);
        }
        return new ApiResponse<>(true, "Wishlists retrieved successfully", wishlists);
    }
}
