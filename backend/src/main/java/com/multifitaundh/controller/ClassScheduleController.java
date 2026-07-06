package com.multifitaundh.controller;

import com.multifitaundh.dto.ClassScheduleDto;
import com.multifitaundh.service.ClassScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/schedules")
public class ClassScheduleController {

    private final ClassScheduleService classScheduleService;

    @Autowired
    public ClassScheduleController(ClassScheduleService classScheduleService) {
        this.classScheduleService = classScheduleService;
    }

    @GetMapping
    public ResponseEntity<List<ClassScheduleDto>> getAllClassSchedules() {
        List<ClassScheduleDto> schedules = classScheduleService.getAllClassSchedules();
        return ResponseEntity.ok(schedules);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClassScheduleDto> getClassScheduleById(@PathVariable UUID id) {
        ClassScheduleDto schedule = classScheduleService.getClassScheduleById(id);
        return ResponseEntity.ok(schedule);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<ClassScheduleDto>> getClassSchedulesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<ClassScheduleDto> schedules = classScheduleService.getClassSchedulesByDateRange(startDate, endDate);
        return ResponseEntity.ok(schedules);
    }
}