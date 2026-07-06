package com.multifitaundh.controller;

import com.multifitaundh.dto.PaymentOrderResponse;
import com.multifitaundh.model.Payment;
import com.multifitaundh.model.PaymentStatus;
import com.multifitaundh.service.PaymentService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {

    private final PaymentService paymentService;

    @Autowired
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    private record InitiatePaymentRequest(
            @NotNull UUID userMembershipId,
            @NotNull @DecimalMin(value = "0.01", inclusive = true) BigDecimal amount,
            @NotBlank String currency
    ) {}

    @PostMapping("/initiate")
    public ResponseEntity<PaymentOrderResponse> initiatePayment(@Valid @RequestBody InitiatePaymentRequest request) {
        PaymentOrderResponse response = paymentService.initiatePayment(
                request.userMembershipId(),
                request.amount(),
                request.currency()
        );
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    private record PaymentCallbackRequest(
            @NotBlank String paymentGatewayOrderId,
            @NotBlank String paymentGatewayTransactionId,
            @NotNull PaymentStatus status
    ) {}

    @PostMapping("/callback")
    public ResponseEntity<Payment> handlePaymentCallback(@Valid @RequestBody PaymentCallbackRequest request) {
        Payment updatedPayment = paymentService.handlePaymentCallback(
                request.paymentGatewayOrderId(),
                request.paymentGatewayTransactionId(),
                request.status()
        );
        return ResponseEntity.ok(updatedPayment);
    }
}