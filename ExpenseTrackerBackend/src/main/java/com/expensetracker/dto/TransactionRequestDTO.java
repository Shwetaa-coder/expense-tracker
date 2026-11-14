package com.expensetracker.dto;
import com.expensetracker.enums.TransactionType;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
public record TransactionRequestDTO(
 @NotBlank @Size(max=120) String title,
 @NotNull @DecimalMin("0.01") @Digits(integer=10,fraction=2) BigDecimal amount,
 @NotNull TransactionType transactionType,
 @NotNull @PastOrPresent LocalDate date,
 @Size(max=1000) String description,
 @NotNull Long userId,@NotNull Long categoryId) {}
