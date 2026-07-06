package com.multifitaundh.dto;

import com.multifitaundh.model.MembershipType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.util.UUID;
import com.multifitaundh.model.Membership;

public class MembershipDto {

    private UUID id;

    @NotBlank(message = "Name cannot be blank")
    private String name;

    @NotBlank(message = "Description cannot be blank")
    private String description;

    @NotNull(message = "Price cannot be null")
    @Positive(message = "Price must be a positive value")
    private BigDecimal price;

    @NotNull(message = "Duration in months cannot be null")
    @Positive(message = "Duration in months must be a positive value")
    private Integer durationInMonths;

    @NotNull(message = "Membership type cannot be null")
    private MembershipType membershipType;

    private Boolean isActive;

    public MembershipDto() {
    }

    public MembershipDto(UUID id, String name, String description, BigDecimal price, Integer durationInMonths, MembershipType membershipType, Boolean isActive) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.durationInMonths = durationInMonths;
        this.membershipType = membershipType;
        this.isActive = isActive;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getDurationInMonths() {
        return durationInMonths;
    }

    public void setDurationInMonths(Integer durationInMonths) {
        this.durationInMonths = durationInMonths;
    }

    public MembershipType getMembershipType() {
        return membershipType;
    }

    public void setMembershipType(MembershipType membershipType) {
        this.membershipType = membershipType;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean active) {
        isActive = active;
    }
}