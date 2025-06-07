package com.example.montrack.Service;

import com.example.montrack.DTO.ApiResponse;
import com.example.montrack.Models.Transaction;
import com.example.montrack.Repositories.TransactionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class TransactionService {
    @Autowired
    private TransactionRepository transactionRepository;

    public ApiResponse<Transaction> addTransaction(Transaction transaction) {
        if (transaction == null || transaction.getUser().getUserId() == 0 || transaction.getAmount() == 0) {
            return new ApiResponse<>(false, "Transaction data is invalid", null);
        }
        Transaction savedTransaction = transactionRepository.save(transaction);
        return new ApiResponse<>(true, "Transaction added successfully", savedTransaction);
    }

    public ApiResponse<List<Transaction>> getAllTransactions(Long userId) {
        List<Transaction> transactions = transactionRepository.findByUser_UserId(userId);
        if (transactions.isEmpty()) {
            return new ApiResponse<>(true, "No transactions found", null);
        }
        return new ApiResponse<>(true, "Transactions retrieved successfully", transactions);
    }

    public ApiResponse<Void> deleteTransaction(Long transactionId) {
        if (!transactionRepository.existsById(transactionId)) {
            return new ApiResponse<>(false, "Transaction not found", null);
        }
        transactionRepository.deleteById(transactionId);
        return new ApiResponse<>(true, "Transaction deleted successfully", null);
    }
}
