package com.expensetracker.entity;
import com.expensetracker.enums.CategoryType;
import jakarta.persistence.*;
@Entity @Table(name="categories",uniqueConstraints=@UniqueConstraint(columnNames={"name","user_id"}))
public class Category {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false) private String name;
 @Enumerated(EnumType.STRING) @Column(nullable=false) private CategoryType categoryType;
 private String description;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="user_id",nullable=false) private User user;
 public Category(){}
 public Long getId(){return id;} public void setId(Long id){this.id=id;}
 public String getName(){return name;} public void setName(String name){this.name=name;}
 public CategoryType getCategoryType(){return categoryType;} public void setCategoryType(CategoryType v){categoryType=v;}
 public String getDescription(){return description;} public void setDescription(String v){description=v;}
 public User getUser(){return user;} public void setUser(User v){user=v;}
}
