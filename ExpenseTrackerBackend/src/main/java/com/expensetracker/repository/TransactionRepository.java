
package com.expensetracker.repository;

import com.expensetracker.entity.Transaction;
import com.expensetracker.enums.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends
        JpaRepository<Transaction, Long>,
        JpaSpecificationExecutor<Transaction> {

 Optional<Transaction> findByIdAndUserId(Long id, Long userId);

 boolean existsByCategoryIdAndUserId(Long categoryId, Long userId);

 @Query("SELECT COALESCE(SUM(t.amount),0) FROM Transaction t " +
         "WHERE t.user.id=:uid AND t.transactionType=:type " +
         "AND t.date BETWEEN :start AND :end")
 BigDecimal sumForType(
         @Param("uid") Long uid,
         @Param("type") TransactionType type,
         @Param("start") LocalDate start,
         @Param("end") LocalDate end
 );

 @Query("SELECT c.name, SUM(t.amount) FROM Transaction t " +
         "JOIN t.category c " +
         "WHERE t.user.id=:uid " +
         "AND t.transactionType=com.expensetracker.enums.TransactionType.EXPENSE " +
         "AND t.date BETWEEN :start AND :end " +
         "GROUP BY c.name ORDER BY SUM(t.amount) DESC")
 List<Object[]> categoryTotals(
         @Param("uid") Long uid,
         @Param("start") LocalDate start,
         @Param("end") LocalDate end
 );

 @Query("SELECT COALESCE(SUM(t.amount),0) FROM Transaction t " +
         "WHERE t.user.id=:uid AND t.category.id=:cid " +
         "AND t.transactionType=com.expensetracker.enums.TransactionType.EXPENSE " +
         "AND t.date BETWEEN :start AND :end")
 BigDecimal spentForCategory(
         @Param("uid") Long uid,
         @Param("cid") Long cid,
         @Param("start") LocalDate start,
         @Param("end") LocalDate end
 );
}
