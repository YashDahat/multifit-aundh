package com.multifitaundh.repository;

import com.multifitaundh.model.UserMembership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserMembershipRepository extends JpaRepository<UserMembership, UUID> {
    Optional<UserMembership> findByUser_IdAndIsCurrentTrue(UUID userId);
    List<UserMembership> findAllByUser_Id(UUID userId);
}
