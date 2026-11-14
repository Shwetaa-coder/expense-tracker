
package com.expensetracker.service;

import com.expensetracker.dto.TransactionRequestDTO;
import com.expensetracker.dto.TransactionResponseDTO;
import com.expensetracker.entity.Category;
import com.expensetracker.entity.Transaction;
import com.expensetracker.entity.User;
import com.expensetracker.enums.TransactionType;
import com.expensetracker.exception.BadRequestException;
import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.repository.CategoryRepository;
import com.expensetracker.repository.TransactionRepository;
import com.expensetracker.repository.UserRepository;

import jakarta.persistence.criteria.Predicate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
@Transactional
public class TransactionService {

 private final TransactionRepository tx;
 private final UserRepository users;
 private final CategoryRepository cats;

 public TransactionService(
         TransactionRepository tx,
         UserRepository users,
         CategoryRepository cats
 ) {
  this.tx = tx;
  this.users = users;
  this.cats = cats;
 }

 // CREATE TRANSACTION
 public TransactionResponseDTO create(TransactionRequestDTO r) {

  User u = user(r.userId());

  Category c = category(r.categoryId(), r.userId());

  checkType(r.transactionType(), c);

  Transaction t = new Transaction();

  apply(t, r, u, c);

  return dto(tx.save(t));
 }

 // SEARCH TRANSACTIONS WITH FILTERING, PAGINATION AND SORTING
 @Transactional(readOnly = true)
 public Page<TransactionResponseDTO> search(
         Long uid,
         TransactionType type,
         Long cid,
         LocalDate start,
         LocalDate end,
         int page,
         int size,
         String sort,
         String dir
 ) {

  user(uid);

  if (start != null && end != null && start.isAfter(end)) {
   throw new BadRequestException(
           "Start date must not be after end date."
   );
  }

  if (page < 0 || size < 1 || size > 100) {
   throw new BadRequestException(
           "Invalid pagination values."
   );
  }

  if (!Set.of("date", "amount", "title").contains(sort)) {
   throw new BadRequestException(
           "sortBy must be date, amount or title."
   );
  }

  Sort.Direction direction;

  try {
   direction = Sort.Direction.fromString(dir);
  } catch (Exception e) {
   throw new BadRequestException(
           "direction must be ASC or DESC."
   );
  }

  // Build dynamic query using Specification
  Specification<Transaction> spec = (root, query, cb) -> {

   List<Predicate> predicates = new ArrayList<>();

   // User filter
   predicates.add(
           cb.equal(root.get("user").get("id"), uid)
   );

   // Transaction type filter
   if (type != null) {
    predicates.add(
            cb.equal(root.get("transactionType"), type)
    );
   }

   // Category filter
   if (cid != null) {
    predicates.add(
            cb.equal(root.get("category").get("id"), cid)
    );
   }

   // Start date filter
   if (start != null) {
    predicates.add(
            cb.greaterThanOrEqualTo(root.get("date"), start)
    );
   }

   // End date filter
   if (end != null) {
    predicates.add(
            cb.lessThanOrEqualTo(root.get("date"), end)
    );
   }

   return cb.and(
           predicates.toArray(new Predicate[0])
   );
  };

  Pageable pageable = PageRequest.of(
          page,
          size,
          Sort.by(direction, sort)
  );

  return tx.findAll(spec, pageable).map(this::dto);
 }

 // GET TRANSACTION BY ID
 @Transactional(readOnly = true)
 public TransactionResponseDTO get(Long id, Long uid) {

  return dto(find(id, uid));
 }

 // UPDATE TRANSACTION
 public TransactionResponseDTO update(
         Long id,
         TransactionRequestDTO r
 ) {

  Transaction t = find(id, r.userId());

  Category c = category(r.categoryId(), r.userId());

  checkType(r.transactionType(), c);

  apply(t, r, t.getUser(), c);

  return dto(t);
 }

 // DELETE TRANSACTION
 public void delete(Long id, Long uid) {

  tx.delete(find(id, uid));
 }

 // APPLY REQUEST DATA TO ENTITY
 private void apply(
         Transaction t,
         TransactionRequestDTO r,
         User u,
         Category c
 ) {

  t.setTitle(r.title().trim());
  t.setAmount(r.amount());
  t.setTransactionType(r.transactionType());
  t.setDate(r.date());
  t.setDescription(r.description());
  t.setUser(u);
  t.setCategory(c);
 }

 // VALIDATE TRANSACTION AND CATEGORY TYPE
 private void checkType(TransactionType type, Category c) {

  if (!c.getCategoryType().name().equals(type.name())) {
   throw new BadRequestException(
           "Transaction type must match category type."
   );
  }
 }

 // FIND USER
 private User user(Long id) {

  return users.findById(id)
          .orElseThrow(() ->
                  new ResourceNotFoundException(
                          "User not found: " + id
                  )
          );
 }

 // FIND CATEGORY BELONGING TO USER
 private Category category(Long id, Long uid) {

  return cats.findByIdAndUserId(id, uid)
          .orElseThrow(() ->
                  new ResourceNotFoundException(
                          "Category not found: " + id
                  )
          );
 }

 // FIND TRANSACTION BELONGING TO USER
 private Transaction find(Long id, Long uid) {

  return tx.findByIdAndUserId(id, uid)
          .orElseThrow(() ->
                  new ResourceNotFoundException(
                          "Transaction not found: " + id
                  )
          );
 }

 // CONVERT ENTITY INTO RESPONSE DTO
 private TransactionResponseDTO dto(Transaction t) {

  return new TransactionResponseDTO(
          t.getId(),
          t.getTitle(),
          t.getAmount(),
          t.getTransactionType(),
          t.getDate(),
          t.getDescription(),
          t.getUser().getId(),
          t.getCategory().getId(),
          t.getCategory().getName()
  );
 }
}
