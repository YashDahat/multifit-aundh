package com.multifitaundh.controller;

import com.multifitaundh.dto.ClassScheduleDto;
import com.multifitaundh.dto.GymClassDto;
import com.multifitaundh.service.SchedulingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/scheduling")
public class AdminSchedulingController {

    private final SchedulingService schedulingService;

    @Autowired
    public AdminSchedulingController(SchedulingService schedulingService) {
        this.schedulingService = schedulingService;
    }

    // Gym Class Management
    @PostMapping("/classes")
    public ResponseEntity<GymClassDto> createGymClass(@Valid @RequestBody GymClassDto gymClassDto) {
        GymClassDto createdClass = schedulingService.createGymClass(gymClassDto);
        return new ResponseEntity<>(createdClass, HttpStatus.CREATED);
    }

    @PutMapping("/classes/{classId}")
    public ResponseEntity<GymClassDto> updateGymClass(@PathVariable UUID classId, @Valid @RequestBody GymClassDto gymClassDto) {
        GymClassDto updatedClass = schedulingService.updateGymClass(classId, gymClassDto);
        return new ResponseEntity<>(updatedClass, HttpStatus.OK);
    }

    @DeleteMapping("/classes/{classId}")
    public ResponseEntity<Void> deleteGymClass(@PathVariable UUID classId) {
        schedulingService.deleteGymClass(classId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Class Schedule Management
    @PostMapping("/schedules")
    public ResponseEntity<ClassScheduleDto> createClassSchedule(@Valid @RequestBody ClassScheduleDto classScheduleDto) {
        ClassScheduleDto createdSchedule = schedulingService.createClassSchedule(classScheduleDto);
        return new ResponseEntity<>(createdSchedule, HttpStatus.CREATED);
    }

    @PutMapping("/schedules/{scheduleId}")
    public ResponseEntity<ClassScheduleDto> updateClassSchedule(@PathVariable UUID scheduleId, @Valid @RequestBody ClassScheduleDto classScheduleDto) {
        ClassScheduleDto updatedSchedule = schedulingService.updateClassSchedule(scheduleId, classScheduleDto);
        return new ResponseEntity<>(updatedSchedule, HttpStatus.OK);
    }

    @DeleteMapping("/schedules/{scheduleId}")
    public ResponseEntity<Void> deleteClassSchedule(@PathVariable UUID scheduleId) {
        schedulingService.deleteClassSchedule(scheduleId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}