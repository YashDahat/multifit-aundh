package com.multifitaundh.repository;

import com.multifitaundh.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByGatewayOrderId(String gatewayOrderId);
    Optional<Payment> findByReferenceId(String referenceId);
}
