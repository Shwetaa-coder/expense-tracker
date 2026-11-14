package com.expensetracker.exception;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.*;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.converter.HttpMessageNotReadableException;
import java.time.LocalDateTime;
import java.util.*;
@RestControllerAdvice
public class GlobalExceptionHandler {
 @ExceptionHandler(ResourceNotFoundException.class) public ResponseEntity<ApiError> notFound(ResourceNotFoundException e){return build(HttpStatus.NOT_FOUND,e.getMessage(),Map.of());}
 @ExceptionHandler(BadRequestException.class) public ResponseEntity<ApiError> badRequest(BadRequestException e){return build(HttpStatus.BAD_REQUEST,e.getMessage(),Map.of());}
 @ExceptionHandler(MethodArgumentNotValidException.class) public ResponseEntity<ApiError> validation(MethodArgumentNotValidException e){Map<String,String> errors=new LinkedHashMap<>(); for(FieldError f:e.getBindingResult().getFieldErrors()) errors.put(f.getField(),f.getDefaultMessage()); return build(HttpStatus.BAD_REQUEST,"Validation failed",errors);}
 @ExceptionHandler(HttpMessageNotReadableException.class) public ResponseEntity<ApiError> unreadable(HttpMessageNotReadableException e){return build(HttpStatus.BAD_REQUEST,"Invalid JSON, enum value or date format.",Map.of());}
 @ExceptionHandler(DataIntegrityViolationException.class) public ResponseEntity<ApiError> conflict(DataIntegrityViolationException e){return build(HttpStatus.CONFLICT,"Operation conflicts with existing database data.",Map.of());}
 @ExceptionHandler(Exception.class) public ResponseEntity<ApiError> other(Exception e){return build(HttpStatus.INTERNAL_SERVER_ERROR,"Unexpected server error.",Map.of());}
 private ResponseEntity<ApiError> build(HttpStatus s,String m,Map<String,String> errors){return ResponseEntity.status(s).body(new ApiError(LocalDateTime.now(),s.value(),s.getReasonPhrase(),m,errors));}
}
