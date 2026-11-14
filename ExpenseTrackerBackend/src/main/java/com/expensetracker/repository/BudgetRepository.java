package com.expensetracker.repository;
import com.expensetracker.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface BudgetRepository extends JpaRepository<Budget,Long> {
 List<Budget> findAllByUserIdOrderByYearDescMonthDesc(Long userId);
 List<Budget> findAllByUserIdAndMonthAndYear(Long userId,Integer month,Integer year);
 Optional<Budget> findByIdAndUserId(Long id,Long userId);
 boolean existsByUserIdAndCategoryIdAndMonthAndYear(Long userId,Long categoryId,Integer month,Integer year);
 boolean existsByCategoryIdAndUserId(Long categoryId,Long userId);
}
