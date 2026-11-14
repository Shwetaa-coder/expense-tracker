package com.expensetracker.service;
import com.expensetracker.dto.*; import com.expensetracker.entity.User; import com.expensetracker.exception.*; import com.expensetracker.repository.UserRepository;
import org.springframework.stereotype.Service; import org.springframework.transaction.annotation.Transactional;
@Service @Transactional
public class UserService {
 private final UserRepository repo; public UserService(UserRepository repo){this.repo=repo;}
 public UserResponseDTO create(UserRequestDTO r){String email=r.email().trim().toLowerCase(); if(repo.existsByEmailIgnoreCase(email)) throw new BadRequestException("Email already exists."); return dto(repo.save(new User(r.name().trim(),email)));}
 @Transactional(readOnly=true) public UserResponseDTO get(Long id){return dto(find(id));}
 public UserResponseDTO update(Long id,UserRequestDTO r){User u=find(id); String email=r.email().trim().toLowerCase(); repo.findAll().stream().filter(x->x.getEmail().equalsIgnoreCase(email)&&!x.getId().equals(id)).findAny().ifPresent(x->{throw new BadRequestException("Email already exists.");}); u.setName(r.name().trim());u.setEmail(email);return dto(u);}
 private User find(Long id){return repo.findById(id).orElseThrow(()->new ResourceNotFoundException("User not found: "+id));}
 private UserResponseDTO dto(User u){return new UserResponseDTO(u.getId(),u.getName(),u.getEmail());}
}
