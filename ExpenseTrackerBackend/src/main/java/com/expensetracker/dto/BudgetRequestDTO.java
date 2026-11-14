package com.expensetracker.dto;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
public record BudgetRequestDTO(@NotNull @DecimalMin("0.01") @Digits(integer=10,fraction=2) BigDecimal amount,
 @NotNull @Min(1) @Max(12) Integer month,@NotNull @Min(2000) Integer year,
 @NotNull Long userId,@NotNull Long categoryId) {}
