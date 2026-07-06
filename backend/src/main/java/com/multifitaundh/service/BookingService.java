package com.multifitaundh.service;

import com.multifitaundh.dto.BookingDto;
import com.multifitaundh.exception.ResourceNotFoundException;
import com.multifitaundh.model.Booking;
import com.multifitaundh.model.BookingStatus;
import com.multifitaundh.model.ClassSchedule;
import com.multifitaundh.model.User;
import com.multifitaundh.repository.BookingRepository;
import com.multifitaundh.repository.ClassScheduleRepository;
import com.multifitaundh.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ClassScheduleRepository classScheduleRepository;
    private final UserRepository userRepository;

    public BookingService(BookingRepository bookingRepository,
                          ClassScheduleRepository classScheduleRepository,
                          UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.classScheduleRepository = classScheduleRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public BookingDto createBooking(UUID userId, UUID classScheduleId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        ClassSchedule classSchedule = classScheduleRepository.findById(classScheduleId)
                .orElseThrow(() -> new ResourceNotFoundException("Class Schedule not found with ID: " + classScheduleId));

        // Check for duplicate booking
        boolean alreadyBooked = bookingRepository.findByUserIdAndClassScheduleId(userId, classScheduleId)
                .stream()
                .anyMatch(b -> b.getStatus() == BookingStatus.CONFIRMED);
        if (alreadyBooked) {
            throw new IllegalStateException("User already has a confirmed booking for this class schedule.");
        }

        // Check class capacity
        if (classSchedule.getCurrentBookings() >= classSchedule.getMaxCapacity()) {
            throw new IllegalStateException("Class is full. Cannot create booking.");
        }

        // Increment booked slots and save class schedule
        classSchedule.setCurrentBookings(classSchedule.getCurrentBookings() + 1);
        classScheduleRepository.save(classSchedule);

        // Create new booking
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setClassSchedule(classSchedule);
        booking.setBookingTime(LocalDateTime.now());
        booking.setStatus(BookingStatus.CONFIRMED);

        Booking savedBooking = bookingRepository.save(booking);
        return mapToDto(savedBooking);
    }

    @Transactional
    public void cancelBooking(UUID bookingId, UUID userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        if (!booking.getUser().getId().equals(userId)) {
            throw new IllegalStateException("User is not authorized to cancel this booking.");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new IllegalStateException("Booking is already cancelled.");
        }

        // Decrement booked slots for the associated class schedule
        ClassSchedule classSchedule = booking.getClassSchedule();
        if (classSchedule.getCurrentBookings() > 0) {
            classSchedule.setCurrentBookings(classSchedule.getCurrentBookings() - 1);
            classScheduleRepository.save(classSchedule);
        }

        // Set booking status to CANCELLED
        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }

    public List<BookingDto> getUserBookings(UUID userId) {
        List<Booking> bookings = bookingRepository.findByUserId(userId);
        return bookings.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public BookingDto getBookingById(UUID bookingId, UUID userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        if (!booking.getUser().getId().equals(userId)) {
            throw new IllegalStateException("User is not authorized to view this booking.");
        }

        return mapToDto(booking);
    }

    public List<BookingDto> getAllBookings() {
        List<Booking> bookings = bookingRepository.findAll();
        return bookings.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private BookingDto mapToDto(Booking booking) {
        return BookingDto.builder()
                .id(booking.getId())
                .userId(booking.getUser().getId())
                .userName(booking.getUser().getFirstName() + " " + booking.getUser().getLastName())
                .classScheduleId(booking.getClassSchedule().getId())
                .className(booking.getClassSchedule().getGymClass().getName())
                .scheduleDate(booking.getClassSchedule().getDate())
                .startTime(booking.getClassSchedule().getStartTime())
                .bookingTime(booking.getBookingTime())
                .status(booking.getStatus())
                .build();
    }
}