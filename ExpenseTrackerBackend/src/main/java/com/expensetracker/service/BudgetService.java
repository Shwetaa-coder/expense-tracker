package com.expensetracker.service;
import com.expensetracker.dto.*;import com.expensetracker.entity.*;import com.expensetracker.enums.CategoryType;import com.expensetracker.exception.*;import com.expensetracker.repository.*;
import org.springframework.stereotype.Service;import org.springframework.transaction.annotation.Transactional;import java.math.BigDecimal;import java.time.LocalDate;import java.util.*;
@Service @Transactional
public class BudgetService {
 private final BudgetRepository budgets;private final UserRepository users;private final CategoryRepository cats;private final TransactionRepository tx;
 public BudgetService(BudgetRepository b,UserRepository u,CategoryRepository c,TransactionRepository t){budgets=b;users=u;cats=c;tx=t;}
 public BudgetResponseDTO create(BudgetRequestDTO r){User u=user(r.userId());Category c=category(r.categoryId(),r.userId());checkExpense(c);if(budgets.existsByUserIdAndCategoryIdAndMonthAndYear(r.userId(),r.categoryId(),r.month(),r.year()))throw new BadRequestException("Budget already exists for this category and month.");Budget b=new Budget();apply(b,r,u,c);return dto(budgets.save(b));}
 @Transactional(readOnly=true) public List<BudgetResponseDTO> all(Long uid,Integer month,Integer year){user(uid);List<Budget> list=(month!=null&&year!=null)?budgets.findAllByUserIdAndMonthAndYear(uid,month,year):budgets.findAllByUserIdOrderByYearDescMonthDesc(uid);return list.stream().map(this::dto).toList();}
 public BudgetResponseDTO update(Long id,BudgetRequestDTO r){Budget b=budgets.findByIdAndUserId(id,r.userId()).orElseThrow(()->new ResourceNotFoundException("Budget not found: "+id));Category c=category(r.categoryId(),r.userId());checkExpense(c);boolean duplicate=budgets.existsByUserIdAndCategoryIdAndMonthAndYear(r.userId(),r.categoryId(),r.month(),r.year());if(duplicate&&!(b.getCategory().getId().equals(r.categoryId())&&b.getMonth().equals(r.month())&&b.getYear().equals(r.year())))throw new BadRequestException("Budget already exists for this category and month.");apply(b,r,b.getUser(),c);return dto(b);}
 public void delete(Long id,Long uid){budgets.delete(budgets.findByIdAndUserId(id,uid).orElseThrow(()->new ResourceNotFoundException("Budget not found: "+id)));}
 private void apply(Budget b,BudgetRequestDTO r,User u,Category c){b.setAmount(r.amount());b.setMonth(r.month());b.setYear(r.year());b.setUser(u);b.setCategory(c);}
 private BudgetResponseDTO dto(Budget b){LocalDate s=LocalDate.of(b.getYear(),b.getMonth(),1),e=s.withDayOfMonth(s.lengthOfMonth());BigDecimal spent=tx.spentForCategory(b.getUser().getId(),b.getCategory().getId(),s,e);return new BudgetResponseDTO(b.getId(),b.getAmount(),b.getMonth(),b.getYear(),b.getUser().getId(),b.getCategory().getId(),b.getCategory().getName(),spent,b.getAmount().subtract(spent));}
 private void checkExpense(Category c){if(c.getCategoryType()!=CategoryType.EXPENSE)throw new BadRequestException("Budgets are only allowed for expense categories.");}
 private User user(Long id){return users.findById(id).orElseThrow(()->new ResourceNotFoundException("User not found: "+id));}
 private Category category(Long id,Long uid){return cats.findByIdAndUserId(id,uid).orElseThrow(()->new ResourceNotFoundException("Category not found: "+id));}
}
