package com.expensetracker.repository;
import com.expensetracker.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface CategoryRepository extends JpaRepository<Category,Long> {
 List<Category> findAllByUserIdOrderByNameAsc(Long userId);
 Optional<Category> findByIdAndUserId(Long id,Long userId);
 boolean existsByNameIgnoreCaseAndUserId(String name,Long userId);
}
