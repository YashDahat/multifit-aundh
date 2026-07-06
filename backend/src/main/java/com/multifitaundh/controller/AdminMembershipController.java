package com.multifitaundh.controller;

import com.multifitaundh.dto.MembershipDto;
import com.multifitaundh.service.MembershipService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/memberships")
public class AdminMembershipController {

    private final MembershipService membershipService;

    @Autowired
    public AdminMembershipController(MembershipService membershipService) {
        this.membershipService = membershipService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MembershipDto> createMembership(@Valid @RequestBody MembershipDto membershipDto) {
        MembershipDto createdMembership = membershipService.createMembership(membershipDto);
        return new ResponseEntity<>(createdMembership, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MembershipDto> updateMembership(@PathVariable UUID id, @Valid @RequestBody MembershipDto membershipDto) {
        MembershipDto updatedMembership = membershipService.updateMembership(id, membershipDto);
        return new ResponseEntity<>(updatedMembership, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMembership(@PathVariable UUID id) {
        membershipService.deleteMembership(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}