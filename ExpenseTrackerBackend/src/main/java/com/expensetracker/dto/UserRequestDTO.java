package com.expensetracker.dto;
import jakarta.validation.constraints.*;
public record UserRequestDTO(@NotBlank String name,@NotBlank @Email String email) {}
