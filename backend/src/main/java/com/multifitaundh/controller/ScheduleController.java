package com.multifitaundh.controller;

import com.multifitaundh.dto.ClassScheduleDto;
import com.multifitaundh.dto.GymClassDto;
import com.multifitaundh.exception.BookingConflictException;
import com.multifitaundh.exception.ResourceNotFoundException;
import com.multifitaundh.service.SchedulingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/schedule")
public class ScheduleController {

    private final SchedulingService schedulingService;

    @Autowired
    public ScheduleController(SchedulingService schedulingService) {
        this.schedulingService = schedulingService;
    }

    @GetMapping("/classes")
    public ResponseEntity<List<GymClassDto>> getAllGymClasses() {
        List<GymClassDto> gymClasses = schedulingService.getAllGymClasses();
        return ResponseEntity.ok(gymClasses);
    }

    @GetMapping("/classes/{classId}")
    public ResponseEntity<GymClassDto> getGymClassById(@PathVariable UUID classId) {
        GymClassDto gymClass = schedulingService.getGymClassById(classId);
        return ResponseEntity.ok(gymClass);
    }

    @GetMapping("/daily")
    public ResponseEntity<List<ClassScheduleDto>> getScheduleForDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<ClassScheduleDto> schedule = schedulingService.getScheduleForDate(date);
        return ResponseEntity.ok(schedule);
    }

    @GetMapping("/weekly")
    public ResponseEntity<List<ClassScheduleDto>> getScheduleForWeek(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) {
        List<ClassScheduleDto> schedule = schedulingService.getScheduleForWeek(startDate);
        return ResponseEntity.ok(schedule);
    }

    @PostMapping("/book")
    public ResponseEntity<BookingDto> bookClass(
            @RequestBody BookingRequestDto bookingRequest,
            @AuthenticationPrincipal UserDetails userDetails) {
        // Assuming userDetails.getUsername() can be parsed to a UUID for userId
        // In a real application, you might have a custom UserDetails object that directly provides the UUID
        UUID userId = UUID.fromString(userDetails.getUsername());
        BookingDto booking = schedulingService.bookClass(bookingRequest.getClassScheduleId(), userId);
        return new ResponseEntity<>(booking, HttpStatus.CREATED);
    }

    @DeleteMapping("/cancel/{bookingId}")
    public ResponseEntity<Void> cancelBooking(
            @PathVariable UUID bookingId,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = UUID.fromString(userDetails.getUsername());
        schedulingService.cancelBooking(bookingId, userId);
        return ResponseEntity.noContent().build();
    }
}