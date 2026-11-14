package com.expensetracker.entity;
import jakarta.persistence.*;
import java.math.BigDecimal;
@Entity @Table(name="budgets",uniqueConstraints=@UniqueConstraint(columnNames={"user_id","category_id","month","year"}))
public class Budget {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false,precision=12,scale=2) private BigDecimal amount;
 @Column(nullable=false) private Integer month;
 @Column(nullable=false) private Integer year;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="user_id",nullable=false) private User user;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="category_id",nullable=false) private Category category;
 public Budget(){}
 public Long getId(){return id;} public void setId(Long v){id=v;}
 public BigDecimal getAmount(){return amount;} public void setAmount(BigDecimal v){amount=v;}
 public Integer getMonth(){return month;} public void setMonth(Integer v){month=v;}
 public Integer getYear(){return year;} public void setYear(Integer v){year=v;}
 public User getUser(){return user;} public void setUser(User v){user=v;}
 public Category getCategory(){return category;} public void setCategory(Category v){category=v;}
}
