package com.expensetracker.controller;
import com.expensetracker.dto.*;import com.expensetracker.service.DashboardService;import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/dashboard") public class DashboardController {private final DashboardService s;public DashboardController(DashboardService s){this.s=s;}@GetMapping("/summary") public DashboardResponseDTO summary(@RequestParam Long userId,@RequestParam(required=false) Integer month,@RequestParam(required=false) Integer year){return s.summary(userId,month,year);}}
