package com.expensetracker.service;
import com.expensetracker.dto.*; import com.expensetracker.entity.*; import com.expensetracker.exception.*; import com.expensetracker.repository.*;
import org.springframework.stereotype.Service; import org.springframework.transaction.annotation.Transactional; import java.util.*;
@Service @Transactional
public class CategoryService {
 private final CategoryRepository cats; private final UserRepository users; private final TransactionRepository tx; private final BudgetRepository budgets;
 public CategoryService(CategoryRepository c,UserRepository u,TransactionRepository t,BudgetRepository b){cats=c;users=u;tx=t;budgets=b;}
 public CategoryResponseDTO create(CategoryRequestDTO r){User u=user(r.userId());String n=r.name().trim();if(cats.existsByNameIgnoreCaseAndUserId(n,u.getId()))throw new BadRequestException("Category already exists.");Category c=new Category();c.setName(n);c.setCategoryType(r.categoryType());c.setDescription(r.description());c.setUser(u);return dto(cats.save(c));}
 @Transactional(readOnly=true) public List<CategoryResponseDTO> all(Long uid){user(uid);return cats.findAllByUserIdOrderByNameAsc(uid).stream().map(this::dto).toList();}
 public CategoryResponseDTO update(Long id,CategoryRequestDTO r){Category c=find(id,r.userId());if(cats.existsByNameIgnoreCaseAndUserId(r.name().trim(),r.userId())&&!c.getName().equalsIgnoreCase(r.name().trim()))throw new BadRequestException("Category name already exists.");if(c.getCategoryType()!=r.categoryType()&&tx.existsByCategoryIdAndUserId(id,r.userId()))throw new BadRequestException("Cannot change type while transactions use this category.");c.setName(r.name().trim());c.setCategoryType(r.categoryType());c.setDescription(r.description());return dto(c);}
 public void delete(Long id,Long uid){Category c=find(id,uid);if(tx.existsByCategoryIdAndUserId(id,uid)||budgets.existsByCategoryIdAndUserId(id,uid))throw new BadRequestException("Cannot delete category with transactions or budgets.");cats.delete(c);}
 private User user(Long id){return users.findById(id).orElseThrow(()->new ResourceNotFoundException("User not found: "+id));}
 private Category find(Long id,Long uid){return cats.findByIdAndUserId(id,uid).orElseThrow(()->new ResourceNotFoundException("Category not found: "+id));}
 private CategoryResponseDTO dto(Category c){return new CategoryResponseDTO(c.getId(),c.getName(),c.getCategoryType(),c.getDescription(),c.getUser().getId());}
}
