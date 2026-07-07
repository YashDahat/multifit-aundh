package com.multifitaundh.controller;

import com.multifitaundh.dto.GymClassDto;
import com.multifitaundh.exception.ResourceNotFoundException;
import com.multifitaundh.model.User;
import com.multifitaundh.service.ClassScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
public class ClassScheduleController {

    private final ClassScheduleService classScheduleService;

    @Autowired
    public ClassScheduleController(ClassScheduleService classScheduleService) {
        this.classScheduleService = classScheduleService;
    }

    @GetMapping("/classes/date")
    public ResponseEntity<List<GymClassDto>> getGymClassesByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<GymClassDto> gymClasses = classScheduleService.getGymClassesByDate(date);
        return ResponseEntity.ok(gymClasses);
    }

    @GetMapping("/classes/weekly")
    public ResponseEntity<List<GymClassDto>> getWeeklySchedule(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<GymClassDto> gymClasses = classScheduleService.getWeeklySchedule(startDate, endDate);
        return ResponseEntity.ok(gymClasses);
    }

    @GetMapping("/classes/{classId}")
    public ResponseEntity<GymClassDto> getGymClassById(@PathVariable UUID classId) {
        try {
            GymClassDto gymClass = classScheduleService.getGymClassById(classId);
            return ResponseEntity.ok(gymClass);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/classes/{classId}/book")
    public ResponseEntity<?> bookClass(
            @PathVariable UUID classId,
            @AuthenticationPrincipal User userPrincipal) {
        try {
            Long userId = userPrincipal.getId();
            ClassBookingDto booking = classScheduleService.bookClass(userId, classId);
            return ResponseEntity.status(HttpStatus.CREATED).body(booking);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/bookings/{bookingId}/cancel")
    public ResponseEntity<Void> cancelBooking(
            @PathVariable UUID bookingId,
            @AuthenticationPrincipal User userPrincipal) {
        try {
            Long userId = userPrincipal.getId();
            classScheduleService.cancelBooking(userId, bookingId);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @GetMapping("/bookings/my-bookings")
    public ResponseEntity<List<ClassBookingDto>> getUserBookings(
            @AuthenticationPrincipal User userPrincipal) {
        Long userId = userPrincipal.getId();
        List<ClassBookingDto> bookings = classScheduleService.getUserBookings(userId);
        return ResponseEntity.ok(bookings);
    }
}