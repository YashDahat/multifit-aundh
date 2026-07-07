package com.multifitaundh.controller.admin;

import com.multifitaundh.dto.CreateGymClassRequest;
import com.multifitaundh.dto.GymClassDto;
import com.multifitaundh.dto.UpdateGymClassRequest;
import com.multifitaundh.service.ClassScheduleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/classes")
@PreAuthorize("hasRole('ADMIN')")
public class AdminClassScheduleController {

    private final ClassScheduleService classScheduleService;

    @Autowired
    public AdminClassScheduleController(ClassScheduleService classScheduleService) {
        this.classScheduleService = classScheduleService;
    }

    @PostMapping
    public ResponseEntity<GymClassDto> createGymClass(@Valid @RequestBody CreateGymClassRequest request) {
        GymClassDto createdClass = classScheduleService.createGymClass(request);
        return new ResponseEntity<>(createdClass, HttpStatus.CREATED);
    }

    @PutMapping("/{classId}")
    public ResponseEntity<GymClassDto> updateGymClass(@PathVariable UUID classId, @Valid @RequestBody UpdateGymClassRequest request) {
        GymClassDto updatedClass = classScheduleService.updateGymClass(classId, request);
        return ResponseEntity.ok(updatedClass);
    }

    @DeleteMapping("/{classId}")
    public ResponseEntity<Void> deleteGymClass(@PathVariable UUID classId) {
        classScheduleService.deleteGymClass(classId);
        return ResponseEntity.noContent().build();
    }
}