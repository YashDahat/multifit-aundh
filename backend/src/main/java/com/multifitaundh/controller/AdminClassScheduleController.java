package com.multifitaundh.controller;

import com.multifitaundh.dto.ClassScheduleDto;
import com.multifitaundh.service.ClassScheduleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/schedules")
public class AdminClassScheduleController {

    private final ClassScheduleService classScheduleService;

    @Autowired
    public AdminClassScheduleController(ClassScheduleService classScheduleService) {
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

    @PostMapping
    public ResponseEntity<ClassScheduleDto> createClassSchedule(@Valid @RequestBody ClassScheduleDto classScheduleDto) {
        ClassScheduleDto createdSchedule = classScheduleService.createClassSchedule(classScheduleDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdSchedule);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClassScheduleDto> updateClassSchedule(@PathVariable UUID id, @Valid @RequestBody ClassScheduleDto classScheduleDto) {
        ClassScheduleDto updatedSchedule = classScheduleService.updateClassSchedule(id, classScheduleDto);
        return ResponseEntity.ok(updatedSchedule);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClassSchedule(@PathVariable UUID id) {
        classScheduleService.deleteClassSchedule(id);
        return ResponseEntity.noContent().build();
    }
}