package com.multifitaundh.controller;

import com.multifitaundh.dto.BookingDto;
import com.multifitaundh.dto.CreateBookingRequest;
import com.multifitaundh.dto.ScheduleDto;
import com.multifitaundh.exception.ResourceNotFoundException;
import com.multifitaundh.service.ClassScheduleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class ClassScheduleController {

    private final ClassScheduleService classScheduleService;

    public ClassScheduleController(ClassScheduleService classScheduleService) {
        this.classScheduleService = classScheduleService;
    }

    @GetMapping("/schedule")
    public ResponseEntity<List<ScheduleDto>> getUpcomingSchedule() {
        List<ScheduleDto> upcomingSchedules = classScheduleService.getUpcomingSchedule();
        return ResponseEntity.ok(upcomingSchedules);
    }

    @PostMapping("/bookings")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BookingDto> createBooking(@RequestBody @Valid CreateBookingRequest request, @AuthenticationPrincipal UserDetails currentUser) {
        try {
            BookingDto bookingDto = classScheduleService.createBooking(request, currentUser);
            return ResponseEntity.status(HttpStatus.CREATED).body(bookingDto);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}