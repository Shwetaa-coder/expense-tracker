package com.expensetracker.dto;
import java.math.BigDecimal;
import java.util.Map;
public record DashboardResponseDTO(BigDecimal totalIncome,BigDecimal totalExpenses,BigDecimal balance,Map<String,BigDecimal> categoryWiseExpenses) {}
