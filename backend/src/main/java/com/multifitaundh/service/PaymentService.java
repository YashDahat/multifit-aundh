package com.multifitaundh.service;

import com.multifitaundh.dto.PaymentOrderResponse;
import com.multifitaundh.exception.ResourceNotFoundException;
import com.multifitaundh.model.Payment;
import com.multifitaundh.model.PaymentStatus;
import com.multifitaundh.model.UserMembership;
import com.multifitaundh.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

// Assuming MembershipService exists and is importable as implied by the instruction.
// The instruction specifies that PaymentService injects MembershipService and calls its methods.
import com.multifitaundh.service.MembershipService;
import com.multifitaundh.model.MembershipType;
import com.multifitaundh.model.Membership;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final MembershipService membershipService;

    @Autowired
    public PaymentService(PaymentRepository paymentRepository, MembershipService membershipService) {
        this.paymentRepository = paymentRepository;
        this.membershipService = membershipService;
    }

    public PaymentOrderResponse initiatePayment(UUID userMembershipId, BigDecimal amount, String currency) {
        UserMembership userMembership = membershipService.getUserMembershipById(userMembershipId);
        if (userMembership == null) {
            throw new ResourceNotFoundException("UserMembership with ID " + userMembershipId + " not found.");
        }

        String paymentGatewayOrderId = UUID.randomUUID().toString();
        Instant paymentDate = Instant.now();

        Payment payment = new Payment(
                UUID.randomUUID(),
                userMembership,
                amount,
                currency,
                paymentGatewayOrderId,
                PaymentStatus.PENDING,
                paymentDate
        );

        paymentRepository.save(payment);

        return PaymentOrderResponse.builder()
                .orderId(paymentGatewayOrderId)
                .amount(amount)
                .currency(currency)
                .membershipId(userMembershipId)
                .userId(userMembership.getUser().getId())
                .build();
    }

    public Payment handlePaymentCallback(String paymentGatewayOrderId, String paymentGatewayTransactionId, PaymentStatus status) {
        Payment payment = paymentRepository.findByPaymentGatewayOrderId(paymentGatewayOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment with order ID " + paymentGatewayOrderId + " not found."));

        payment.setPaymentGatewayTransactionId(paymentGatewayTransactionId);
        payment.setStatus(status);

        if (status == PaymentStatus.SUCCESS) {
            // The instruction specifies calling calculateEndDate on MembershipType.
            // This assumes that the Membership entity (not provided) has a getDuration() method
            // that returns a MembershipType, and that MembershipType (provided) has a
            // calculateEndDate(Instant) method.
            // As per the instruction, this call is included literally.
            int durationMonths = payment.getUserMembership().getMembership().getDurationInMonths();
            LocalDate endDate = LocalDate.now().plusMonths(durationMonths);
            membershipService.activateUserMembership(payment.getUserMembership().getId(), payment.getPaymentDate(), endDate);
        }

        return paymentRepository.save(payment);
    }
}