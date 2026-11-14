package com.expensetracker.dto;
import com.expensetracker.enums.CategoryType;
public record CategoryResponseDTO(Long id,String name,CategoryType categoryType,String description,Long userId) {}
