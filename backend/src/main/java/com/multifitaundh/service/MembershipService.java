package com.multifitaundh.service;

import com.multifitaundh.dto.MembershipDto;
import com.multifitaundh.exception.ResourceNotFoundException;
import com.multifitaundh.model.Membership;
import com.multifitaundh.model.User;
import com.multifitaundh.model.UserMembership;
import com.multifitaundh.repository.MembershipRepository;
import com.multifitaundh.repository.UserMembershipRepository;
import com.multifitaundh.repository.UserRepository; // Assuming UserRepository exists
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import com.multifitaundh.repository.UserRepository;

@Service
public class MembershipService {

    private final MembershipRepository membershipRepository;
    private final UserMembershipRepository userMembershipRepository;
    private final UserRepository userRepository; // Assuming UserRepository exists

    @Autowired
    public MembershipService(MembershipRepository membershipRepository, UserMembershipRepository userMembershipRepository, UserRepository userRepository) {
        this.membershipRepository = membershipRepository;
        this.userMembershipRepository = userMembershipRepository;
        this.userRepository = userRepository;
    }

    public List<MembershipDto> getAllMemberships() {
        // Assuming findAllByIsActiveTrue() exists as per feature description
        return membershipRepository.findAll().stream() // Changed to findAll() as findAllByIsActiveTrue() is not in provided repo
                .filter(Membership::getIsActive) // Manually filter for active memberships
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public MembershipDto getMembershipById(UUID id) {
        Membership membership = membershipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Membership not found with ID: " + id));
        return convertToDto(membership);
    }

    public MembershipDto createMembership(MembershipDto membershipDto) {
        Membership membership = convertToEntity(membershipDto);
        if (membership.getIsActive() == null) {
            membership.setIsActive(true); // Default to active if not specified
        }
        Membership savedMembership = membershipRepository.save(membership);
        return convertToDto(savedMembership);
    }

    public MembershipDto updateMembership(UUID id, MembershipDto membershipDto) {
        Membership existingMembership = membershipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Membership not found with ID: " + id));

        existingMembership.setName(membershipDto.getName());
        existingMembership.setDescription(membershipDto.getDescription());
        existingMembership.setPrice(membershipDto.getPrice());
        existingMembership.setDurationInMonths(membershipDto.getDurationInMonths());
        existingMembership.setMembershipType(membershipDto.getMembershipType());
        if (membershipDto.getIsActive() != null) {
            existingMembership.setIsActive(membershipDto.getIsActive());
        }

        Membership updatedMembership = membershipRepository.save(existingMembership);
        return convertToDto(updatedMembership);
    }

    public void deleteMembership(UUID id) {
        Membership existingMembership = membershipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Membership not found with ID: " + id));
        existingMembership.setIsActive(false); // Deactivate the membership
        membershipRepository.save(existingMembership);
    }

    public UserMembership assignMembershipToUser(UUID userId, UUID membershipId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        Membership membership = membershipRepository.findById(membershipId)
                .orElseThrow(() -> new ResourceNotFoundException("Membership not found with ID: " + membershipId));

        // Assuming findByUser_IdAndIsCurrentTrue() exists as per feature description
        Optional<UserMembership> currentUserMembership = userMembershipRepository.findByUser_IdAndIsCurrentTrue(userId);
        if (currentUserMembership.isPresent()) {
            throw new IllegalArgumentException("User already has an active membership.");
        }

        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusMonths(membership.getDurationInMonths());

        UserMembership newUserMembership = new UserMembership();
        newUserMembership.setId(UUID.randomUUID()); // Generate a new UUID for UserMembership
        newUserMembership.setUser(user);
        newUserMembership.setMembership(membership);
        newUserMembership.setStartDate(startDate);
        newUserMembership.setEndDate(endDate);
        newUserMembership.setIsCurrent(true);

        return userMembershipRepository.save(newUserMembership);
    }

    public Optional<UserMembership> getCurrentUserMembership(UUID userId) {
        // Assuming findByUser_IdAndIsCurrentTrue() exists as per feature description
        return userMembershipRepository.findByUser_IdAndIsCurrentTrue(userId);
    }

    public List<UserMembership> getAllUserMemberships(UUID userId) {
        // Assuming findAllByUser_Id() exists as per feature description
        return userMembershipRepository.findAllByUser_Id(userId);
    }

    public void revokeUserMembership(UUID userMembershipId) {
        UserMembership userMembership = userMembershipRepository.findById(userMembershipId)
                .orElseThrow(() -> new ResourceNotFoundException("User Membership not found with ID: " + userMembershipId));

        userMembership.setIsCurrent(false);
        userMembership.setEndDate(LocalDate.now()); // Set end date to current date upon revocation
        userMembershipRepository.save(userMembership);
    }

    private MembershipDto convertToDto(Membership membership) {
        return new MembershipDto(
                membership.getId(),
                membership.getName(),
                membership.getDescription(),
                membership.getPrice(),
                membership.getDurationInMonths(),
                membership.getMembershipType(),
                membership.getIsActive()
        );
    }

    private Membership convertToEntity(MembershipDto membershipDto) {
        Membership membership = new Membership();
        membership.setId(membershipDto.getId()); // ID might be null for new entities
        membership.setName(membershipDto.getName());
        membership.setDescription(membershipDto.getDescription());
        membership.setPrice(membershipDto.getPrice());
        membership.setDurationInMonths(membershipDto.getDurationInMonths());
        membership.setMembershipType(membershipDto.getMembershipType());
        membership.setIsActive(membershipDto.getIsActive());
        return membership;
    }
}