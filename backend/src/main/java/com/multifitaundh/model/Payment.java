package com.multifitaundh.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;
import com.multifitaundh.model.UserMembership;
import com.multifitaundh.model.PaymentStatus;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_membership_id", nullable = false)
    private UserMembership userMembership;

    @Column(name = "amount", nullable = false)
    private BigDecimal amount;

    @Column(name = "currency", nullable = false)
    private String currency;

    @Column(name = "payment_gateway_order_id", nullable = false, unique = true)
    private String paymentGatewayOrderId;

    @Column(name = "payment_gateway_transaction_id")
    private String paymentGatewayTransactionId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private PaymentStatus status;

    @Column(name = "payment_date", nullable = false)
    private Instant paymentDate;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    // JPA requires a no-argument constructor
    public Payment() {
    }

    // Constructor for creating a new payment
    public Payment(UUID id, UserMembership userMembership, BigDecimal amount, String currency, String paymentGatewayOrderId, PaymentStatus status, Instant paymentDate) {
        this.id = id;
        this.userMembership = userMembership;
        this.amount = amount;
        this.currency = currency;
        this.paymentGatewayOrderId = paymentGatewayOrderId;
        this.status = status;
        this.paymentDate = paymentDate;
    }

    // Getters and Setters (as per standard practice for JPA entities, though not explicitly listed in rules)
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UserMembership getUserMembership() {
        return userMembership;
    }

    public void setUserMembership(UserMembership userMembership) {
        this.userMembership = userMembership;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getPaymentGatewayOrderId() {
        return paymentGatewayOrderId;
    }

    public void setPaymentGatewayOrderId(String paymentGatewayOrderId) {
        this.paymentGatewayOrderId = paymentGatewayOrderId;
    }

    public String getPaymentGatewayTransactionId() {
        return paymentGatewayTransactionId;
    }

    public void setPaymentGatewayTransactionId(String paymentGatewayTransactionId) {
        this.paymentGatewayTransactionId = paymentGatewayTransactionId;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public void setStatus(PaymentStatus status) {
        this.status = status;
    }

    public Instant getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(Instant paymentDate) {
        this.paymentDate = paymentDate;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}