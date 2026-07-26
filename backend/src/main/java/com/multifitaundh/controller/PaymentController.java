package com.multifitaundh.controller;

import com.multifitaundh.dto.CreatePaymentRequest;
import com.multifitaundh.dto.PaymentOrderResponse;
import com.multifitaundh.dto.PaymentVerificationResponse;
import com.multifitaundh.dto.VerifyPaymentRequest;
import com.multifitaundh.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create-order")
    public ResponseEntity<PaymentOrderResponse> createOrder(@RequestBody CreatePaymentRequest request) {
        return ResponseEntity.ok(paymentService.createOrder(request));
    }

    @PostMapping("/verify")
    public ResponseEntity<PaymentVerificationResponse> verify(@RequestBody VerifyPaymentRequest request) {
        return ResponseEntity.ok(paymentService.verify(request));
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> webhook(
            @RequestBody String payload,
            @RequestHeader(value = "X-Razorpay-Signature", required = false) String signature) {
        paymentService.handleWebhook(payload, signature);
        return ResponseEntity.ok("ok");
    }
}
