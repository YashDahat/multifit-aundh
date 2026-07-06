package com.multifitaundh.service;

import com.multifitaundh.dto.ClassScheduleDto;
import com.multifitaundh.exception.ResourceNotFoundException;
import com.multifitaundh.model.ClassSchedule;
import com.multifitaundh.model.GymClass;
import com.multifitaundh.model.Trainer;
import com.multifitaundh.repository.ClassScheduleRepository;
import com.multifitaundh.repository.GymClassRepository;
import com.multifitaundh.repository.TrainerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ClassScheduleService {

    private final ClassScheduleRepository classScheduleRepository;
    private final GymClassRepository gymClassRepository;
    private final TrainerRepository trainerRepository;

    @Autowired
    public ClassScheduleService(ClassScheduleRepository classScheduleRepository,
                                GymClassRepository gymClassRepository,
                                TrainerRepository trainerRepository) {
        this.classScheduleRepository = classScheduleRepository;
        this.gymClassRepository = gymClassRepository;
        this.trainerRepository = trainerRepository;
    }

    public List<ClassScheduleDto> getAllClassSchedules() {
        return classScheduleRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public ClassScheduleDto getClassScheduleById(UUID id) {
        ClassSchedule classSchedule = classScheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ClassSchedule not found with id: " + id));
        return convertToDto(classSchedule);
    }

    public ClassScheduleDto createClassSchedule(ClassScheduleDto classScheduleDto) {
        GymClass gymClass = gymClassRepository.findById(classScheduleDto.getGymClassId())
                .orElseThrow(() -> new ResourceNotFoundException("GymClass not found with id: " + classScheduleDto.getGymClassId()));

        ClassSchedule classSchedule = new ClassSchedule();
        classSchedule.setGymClass(gymClass);
        classSchedule.setDate(classScheduleDto.getScheduleDate());
        classSchedule.setStartTime(classScheduleDto.getStartTime());
        classSchedule.setEndTime(classScheduleDto.getEndTime());
        classSchedule.setMaxCapacity(classScheduleDto.getMaxCapacity());
        classSchedule.setCurrentBookings(0); // New schedules start with 0 bookings

        ClassSchedule savedSchedule = classScheduleRepository.save(classSchedule);
        return convertToDto(savedSchedule);
    }

    public ClassScheduleDto updateClassSchedule(UUID id, ClassScheduleDto classScheduleDto) {
        ClassSchedule existingSchedule = classScheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ClassSchedule not found with id: " + id));

        GymClass gymClass = gymClassRepository.findById(classScheduleDto.getGymClassId())
                .orElseThrow(() -> new ResourceNotFoundException("GymClass not found with id: " + classScheduleDto.getGymClassId()));

        existingSchedule.setGymClass(gymClass);
        existingSchedule.setDate(classScheduleDto.getScheduleDate());
        existingSchedule.setStartTime(classScheduleDto.getStartTime());
        existingSchedule.setEndTime(classScheduleDto.getEndTime());
        existingSchedule.setMaxCapacity(classScheduleDto.getMaxCapacity());
        // currentBookings is managed by booking service, not updated directly here

        ClassSchedule updatedSchedule = classScheduleRepository.save(existingSchedule);
        return convertToDto(updatedSchedule);
    }

    public void deleteClassSchedule(UUID id) {
        if (!classScheduleRepository.existsById(id)) {
            throw new ResourceNotFoundException("ClassSchedule not found with id: " + id);
        }
        classScheduleRepository.deleteById(id);
    }

    public List<ClassScheduleDto> getClassSchedulesByDateRange(LocalDate startDate, LocalDate endDate) {
        // As per rule 7, repository methods must be declared in the interface.
        // Since ClassScheduleRepository does not declare findByDateBetween,
        // we retrieve all and filter in memory.
        return classScheduleRepository.findAll().stream()
                .filter(schedule -> !schedule.getDate().isBefore(startDate) && !schedule.getDate().isAfter(endDate))
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private ClassScheduleDto convertToDto(ClassSchedule classSchedule) {
        GymClass gymClass = classSchedule.getGymClass();
        Trainer trainer = gymClass.getTrainer(); // Assuming trainer is eagerly fetched or accessible within transaction

        return ClassScheduleDto.builder()
                .id(classSchedule.getId())
                .gymClassId(gymClass.getId())
                .gymClassName(gymClass.getName())
                .gymClassDescription(gymClass.getDescription())
                .gymClassDurationMinutes(gymClass.getDurationMinutes())
                .trainerId(trainer.getId())
                .trainerName(trainer.getName())
                .scheduleDate(classSchedule.getDate())
                .startTime(classSchedule.getStartTime())
                .endTime(classSchedule.getEndTime())
                .maxCapacity(classSchedule.getMaxCapacity())
                .bookedSlots(classSchedule.getCurrentBookings())
                .build();
    }
}