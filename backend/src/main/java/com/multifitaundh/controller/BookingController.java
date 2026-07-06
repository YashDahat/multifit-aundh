package com.multifitaundh.controller;

import com.multifitaundh.dto.BookingDto;
import com.multifitaundh.service.BookingService;
import com.multifitaundh.model.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<BookingDto> createBooking(
            @AuthenticationPrincipal User currentUser,
            @RequestBody Map<String, UUID> requestBody) {
        UUID classScheduleId = requestBody.get("classScheduleId");
        BookingDto createdBooking = bookingService.createBooking(currentUser.getId(), classScheduleId);
        return new ResponseEntity<>(createdBooking, HttpStatus.CREATED);
    }

    @DeleteMapping("/{bookingId}")
    public ResponseEntity<Void> cancelBooking(
            @AuthenticationPrincipal User currentUser,
            @PathVariable UUID bookingId) {
        bookingService.cancelBooking(bookingId, currentUser.getId());
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<List<BookingDto>> getUserBookings(@AuthenticationPrincipal User currentUser) {
        List<BookingDto> bookings = bookingService.getUserBookings(currentUser.getId());
        return new ResponseEntity<>(bookings, HttpStatus.OK);
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingDto> getBookingById(
            @AuthenticationPrincipal User currentUser,
            @PathVariable UUID bookingId) {
        BookingDto booking = bookingService.getBookingById(bookingId, currentUser.getId());
        return new ResponseEntity<>(booking, HttpStatus.OK);
    }
}