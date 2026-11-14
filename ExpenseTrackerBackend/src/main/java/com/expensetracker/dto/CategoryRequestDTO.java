package com.expensetracker.dto;
import com.expensetracker.enums.CategoryType;
import jakarta.validation.constraints.*;
public record CategoryRequestDTO(@NotBlank String name,@NotNull CategoryType categoryType,String description,@NotNull Long userId) {}
