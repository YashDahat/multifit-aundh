package com.multifitaundh.repository;

import com.multifitaundh.model.MembershipStatus;
import com.multifitaundh.model.UserMembership;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface UserMembershipRepository extends JpaRepository<UserMembership, UUID> {
    Optional<UserMembership> findByUser_IdAndStatus(Long userId, MembershipStatus status);
}