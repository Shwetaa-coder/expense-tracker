package com.expensetracker.dto;
import com.expensetracker.enums.TransactionType;
import java.math.BigDecimal;
import java.time.LocalDate;
public record TransactionResponseDTO(Long id,String title,BigDecimal amount,TransactionType transactionType,LocalDate date,String description,Long userId,Long categoryId,String categoryName) {}
