package com.expensetracker.dto;
import java.math.BigDecimal;
public record BudgetResponseDTO(Long id,BigDecimal amount,Integer month,Integer year,Long userId,Long categoryId,String categoryName,BigDecimal spent,BigDecimal remaining) {}
