package com.multifitaundh.controller;

import com.multifitaundh.dto.GymClassDto;
import com.multifitaundh.dto.ScheduleDto;
import com.multifitaundh.exception.ResourceNotFoundException;
import com.multifitaundh.service.ClassScheduleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminClassScheduleController {

    private final ClassScheduleService classScheduleService;

    public AdminClassScheduleController(ClassScheduleService classScheduleService) {
        this.classScheduleService = classScheduleService;
    }

    @GetMapping("/classes")
    public ResponseEntity<List<GymClassDto>> getAllGymClasses() {
        List<GymClassDto> gymClasses = classScheduleService.getAllGymClasses();
        return ResponseEntity.ok(gymClasses);
    }

    @PostMapping("/classes")
    public ResponseEntity<GymClassDto> createGymClass(@RequestBody @Valid GymClassDto dto) {
        GymClassDto createdGymClass = classScheduleService.createGymClass(dto);
        return new ResponseEntity<>(createdGymClass, HttpStatus.CREATED);
    }

    @PutMapping("/classes/{id}")
    public ResponseEntity<GymClassDto> updateGymClass(@PathVariable UUID id, @RequestBody @Valid GymClassDto dto) {
        try {
            GymClassDto updatedGymClass = classScheduleService.updateGymClass(id, dto);
            return ResponseEntity.ok(updatedGymClass);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/classes/{id}")
    public ResponseEntity<Void> deleteGymClass(@PathVariable UUID id) {
        try {
            classScheduleService.deleteGymClass(id);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/schedule")
    public ResponseEntity<List<ScheduleDto>> getAllSchedules() {
        List<ScheduleDto> schedules = classScheduleService.getAllSchedules();
        return ResponseEntity.ok(schedules);
    }

    @PostMapping("/schedule")
    public ResponseEntity<ScheduleDto> createSchedule(@RequestBody @Valid ScheduleDto dto) {
        try {
            ScheduleDto createdSchedule = classScheduleService.createSchedule(dto);
            return new ResponseEntity<>(createdSchedule, HttpStatus.CREATED);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/schedule/{id}")
    public ResponseEntity<ScheduleDto> updateSchedule(@PathVariable UUID id, @RequestBody @Valid ScheduleDto dto) {
        try {
            ScheduleDto updatedSchedule = classScheduleService.updateSchedule(id, dto);
            return ResponseEntity.ok(updatedSchedule);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/schedule/{id}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable UUID id) {
        try {
            classScheduleService.deleteSchedule(id);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}