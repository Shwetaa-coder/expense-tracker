package com.expensetracker.service;
import com.expensetracker.dto.*;import com.expensetracker.enums.TransactionType;import com.expensetracker.exception.*;import com.expensetracker.repository.*;
import org.springframework.stereotype.Service;import org.springframework.transaction.annotation.Transactional;import java.math.BigDecimal;import java.time.LocalDate;import java.util.*;
@Service public class DashboardService {
 private final UserRepository users;private final TransactionRepository tx;
 public DashboardService(UserRepository u,TransactionRepository t){users=u;tx=t;}
 @Transactional(readOnly=true) public DashboardResponseDTO summary(Long uid,Integer month,Integer year){if(!users.existsById(uid))throw new ResourceNotFoundException("User not found: "+uid);LocalDate start,end;if(month==null&&year==null){LocalDate now=LocalDate.now();start=now.withDayOfMonth(1);end=now.withDayOfMonth(now.lengthOfMonth());}else{if(month==null||year==null||month<1||month>12)throw new BadRequestException("Provide valid month and year together.");start=LocalDate.of(year,month,1);end=start.withDayOfMonth(start.lengthOfMonth());}BigDecimal income=tx.sumForType(uid,TransactionType.INCOME,start,end),expense=tx.sumForType(uid,TransactionType.EXPENSE,start,end);Map<String,BigDecimal> map=new LinkedHashMap<>();for(Object[] row:tx.categoryTotals(uid,start,end))map.put((String)row[0],(BigDecimal)row[1]);return new DashboardResponseDTO(income,expense,income.subtract(expense),map);}
}
