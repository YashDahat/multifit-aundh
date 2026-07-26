package com.multifitaundh.repository;

import com.multifitaundh.model.MemberSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface MemberSubscriptionRepository extends JpaRepository<MemberSubscription, UUID> {
    List<MemberSubscription> findByUserId(UUID userId);
    List<MemberSubscription> findByUserIdAndStatus(UUID userId, MemberSubscription.SubscriptionStatus status);
    List<MemberSubscription> findByStatusAndEndDateBefore(MemberSubscription.SubscriptionStatus status, LocalDate date);
}