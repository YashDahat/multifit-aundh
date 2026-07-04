package com.multifitaundh.service;

import com.multifitaundh.dto.BookingDto;
import com.multifitaundh.dto.CreateBookingRequest;
import com.multifitaundh.dto.GymClassDto;
import com.multifitaundh.dto.ScheduleDto;
import com.multifitaundh.exception.ResourceNotFoundException;
import com.multifitaundh.model.Booking;
import com.multifitaundh.model.BookingStatus;
import com.multifitaundh.model.GymClass;
import com.multifitaundh.model.Schedule;
import com.multifitaundh.model.Trainer;
import com.multifitaundh.model.User;
import com.multifitaundh.repository.BookingRepository;
import com.multifitaundh.repository.GymClassRepository;
import com.multifitaundh.repository.ScheduleRepository;
import com.multifitaundh.repository.TrainerRepository;
import com.multifitaundh.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ClassScheduleService {

    private final GymClassRepository gymClassRepository;
    private final ScheduleRepository scheduleRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final TrainerRepository trainerRepository;

    public ClassScheduleService(
            GymClassRepository gymClassRepository,
            ScheduleRepository scheduleRepository,
            BookingRepository bookingRepository,
            UserRepository userRepository,
            TrainerRepository trainerRepository) {
        this.gymClassRepository = gymClassRepository;
        this.scheduleRepository = scheduleRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.trainerRepository = trainerRepository;
    }

    public List<ScheduleDto> getUpcomingSchedule() {
        LocalDateTime currentTime = LocalDateTime.now();
        List<Schedule> upcomingSchedules = scheduleRepository.findByStartTimeAfter(currentTime);

        return upcomingSchedules.stream().map(schedule -> {
            long confirmedBookingsCount = bookingRepository.countByScheduleId(schedule.getId());
            int spotsAvailable = schedule.getCapacity() - (int) confirmedBookingsCount;

            return ScheduleDto.builder()
                    .id(schedule.getId())
                    .gymClassId(schedule.getGymClass().getId())
                    .className(schedule.getGymClass().getName())
                    .trainerId(schedule.getTrainer().getId())
                    .trainerName(schedule.getTrainer().getName())
                    .startTime(schedule.getStartTime())
                    .endTime(schedule.getEndTime())
                    .capacity(schedule.getCapacity())
                    .spotsAvailable(spotsAvailable)
                    .build();
        }).collect(Collectors.toList());
    }

    public BookingDto createBooking(CreateBookingRequest request, UserDetails currentUser) {
        Schedule schedule = scheduleRepository.findById(request.getScheduleId())
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with ID: " + request.getScheduleId()));

        User user = userRepository.findByEmail(currentUser.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + currentUser.getUsername()));

        long currentBookingsCount = bookingRepository.countByScheduleId(schedule.getId());
        if (currentBookingsCount >= schedule.getCapacity()) {
            throw new IllegalStateException("Class is full. No spots available.");
        }

        bookingRepository.findByUserIdAndScheduleIdAndStatus(user.getId(), schedule.getId(), BookingStatus.CONFIRMED)
                .ifPresent(existingBooking -> {
                    throw new IllegalStateException("You are already booked for this class.");
                });

        Booking booking = new Booking();
        booking.setId(UUID.randomUUID());
        booking.setUser(user);
        booking.setSchedule(schedule);
        booking.setBookingTime(LocalDateTime.now());
        booking.setStatus(BookingStatus.CONFIRMED);

        Booking savedBooking = bookingRepository.save(booking);

        return BookingDto.builder()
                .id(savedBooking.getId())
                .scheduleId(savedBooking.getSchedule().getId())
                .className(savedBooking.getSchedule().getGymClass().getName())
                .classStartTime(savedBooking.getSchedule().getStartTime())
                .status(savedBooking.getStatus().name())
                .build();
    }

    public List<GymClassDto> getAllGymClasses() {
        return gymClassRepository.findAll().stream()
                .map(gymClass -> GymClassDto.builder()
                        .id(gymClass.getId())
                        .name(gymClass.getName())
                        .description(gymClass.getDescription())
                        .build())
                .collect(Collectors.toList());
    }

    public GymClassDto createGymClass(GymClassDto dto) {
        GymClass gymClass = new GymClass();
        gymClass.setId(UUID.randomUUID());
        gymClass.setName(dto.getName());
        gymClass.setDescription(dto.getDescription());

        GymClass savedGymClass = gymClassRepository.save(gymClass);

        return GymClassDto.builder()
                .id(savedGymClass.getId())
                .name(savedGymClass.getName())
                .description(savedGymClass.getDescription())
                .build();
    }

    public GymClassDto updateGymClass(UUID id, GymClassDto dto) {
        GymClass gymClass = gymClassRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("GymClass not found with ID: " + id));

        gymClass.setName(dto.getName());
        gymClass.setDescription(dto.getDescription());

        GymClass updatedGymClass = gymClassRepository.save(gymClass);

        return GymClassDto.builder()
                .id(updatedGymClass.getId())
                .name(updatedGymClass.getName())
                .description(updatedGymClass.getDescription())
                .build();
    }

    public void deleteGymClass(UUID id) {
        gymClassRepository.deleteById(id);
    }

    public List<ScheduleDto> getAllSchedules() {
        return scheduleRepository.findAll().stream().map(schedule -> {
            long confirmedBookingsCount = bookingRepository.countByScheduleId(schedule.getId());
            int spotsAvailable = schedule.getCapacity() - (int) confirmedBookingsCount;

            return ScheduleDto.builder()
                    .id(schedule.getId())
                    .gymClassId(schedule.getGymClass().getId())
                    .className(schedule.getGymClass().getName())
                    .trainerId(schedule.getTrainer().getId())
                    .trainerName(schedule.getTrainer().getName())
                    .startTime(schedule.getStartTime())
                    .endTime(schedule.getEndTime())
                    .capacity(schedule.getCapacity())
                    .spotsAvailable(spotsAvailable)
                    .build();
        }).collect(Collectors.toList());
    }

    public ScheduleDto createSchedule(ScheduleDto dto) {
        GymClass gymClass = gymClassRepository.findById(dto.getGymClassId())
                .orElseThrow(() -> new ResourceNotFoundException("GymClass not found with ID: " + dto.getGymClassId()));

        Trainer trainer = trainerRepository.findById(dto.getTrainerId())
                .orElseThrow(() -> new ResourceNotFoundException("Trainer not found with ID: " + dto.getTrainerId()));

        Schedule schedule = new Schedule();
        schedule.setId(UUID.randomUUID());
        schedule.setGymClass(gymClass);
        schedule.setTrainer(trainer);
        schedule.setStartTime(dto.getStartTime());
        schedule.setEndTime(dto.getEndTime());
        schedule.setCapacity(dto.getCapacity());

        Schedule savedSchedule = scheduleRepository.save(schedule);

        return ScheduleDto.builder()
                .id(savedSchedule.getId())
                .gymClassId(savedSchedule.getGymClass().getId())
                .className(savedSchedule.getGymClass().getName())
                .trainerId(savedSchedule.getTrainer().getId())
                .trainerName(savedSchedule.getTrainer().getName())
                .startTime(savedSchedule.getStartTime())
                .endTime(savedSchedule.getEndTime())
                .capacity(savedSchedule.getCapacity())
                .spotsAvailable(savedSchedule.getCapacity()) // New schedule, no bookings yet
                .build();
    }

    public ScheduleDto updateSchedule(UUID id, ScheduleDto dto) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with ID: " + id));

        GymClass gymClass = gymClassRepository.findById(dto.getGymClassId())
                .orElseThrow(() -> new ResourceNotFoundException("GymClass not found with ID: " + dto.getGymClassId()));

        Trainer trainer = trainerRepository.findById(dto.getTrainerId())
                .orElseThrow(() -> new ResourceNotFoundException("Trainer not found with ID: " + dto.getTrainerId()));

        schedule.setGymClass(gymClass);
        schedule.setTrainer(trainer);
        schedule.setStartTime(dto.getStartTime());
        schedule.setEndTime(dto.getEndTime());
        schedule.setCapacity(dto.getCapacity());

        Schedule updatedSchedule = scheduleRepository.save(schedule);

        long confirmedBookingsCount = bookingRepository.countByScheduleId(updatedSchedule.getId());
        int spotsAvailable = updatedSchedule.getCapacity() - (int) confirmedBookingsCount;

        return ScheduleDto.builder()
                .id(updatedSchedule.getId())
                .gymClassId(updatedSchedule.getGymClass().getId())
                .className(updatedSchedule.getGymClass().getName())
                .trainerId(updatedSchedule.getTrainer().getId())
                .trainerName(updatedSchedule.getTrainer().getName())
                .startTime(updatedSchedule.getStartTime())
                .endTime(updatedSchedule.getEndTime())
                .capacity(updatedSchedule.getCapacity())
                .spotsAvailable(spotsAvailable)
                .build();
    }

    public void deleteSchedule(UUID id) {
        scheduleRepository.deleteById(id);
    }
}