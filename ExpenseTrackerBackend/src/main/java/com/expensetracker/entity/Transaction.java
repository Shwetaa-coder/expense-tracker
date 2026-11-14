package com.expensetracker.entity;
import com.expensetracker.enums.TransactionType;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
@Entity @Table(name="transactions")
public class Transaction {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false,length=120) private String title;
 @Column(nullable=false,precision=12,scale=2) private BigDecimal amount;
 @Enumerated(EnumType.STRING) @Column(nullable=false) private TransactionType transactionType;
 @Column(nullable=false) private LocalDate date;
 @Column(length=1000) private String description;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="user_id",nullable=false) private User user;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="category_id",nullable=false) private Category category;
 public Transaction(){}
 public Long getId(){return id;} public void setId(Long v){id=v;}
 public String getTitle(){return title;} public void setTitle(String v){title=v;}
 public BigDecimal getAmount(){return amount;} public void setAmount(BigDecimal v){amount=v;}
 public TransactionType getTransactionType(){return transactionType;} public void setTransactionType(TransactionType v){transactionType=v;}
 public LocalDate getDate(){return date;} public void setDate(LocalDate v){date=v;}
 public String getDescription(){return description;} public void setDescription(String v){description=v;}
 public User getUser(){return user;} public void setUser(User v){user=v;}
 public Category getCategory(){return category;} public void setCategory(Category v){category=v;}
}
