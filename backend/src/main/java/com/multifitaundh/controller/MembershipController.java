package com.multifitaundh.controller;

import com.multifitaundh.dto.MembershipDto;
import com.multifitaundh.service.MembershipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/memberships")
public class MembershipController {

    private final MembershipService membershipService;

    @Autowired
    public MembershipController(MembershipService membershipService) {
        this.membershipService = membershipService;
    }

    @GetMapping
    public ResponseEntity<List<MembershipDto>> getAllMemberships() {
        List<MembershipDto> memberships = membershipService.getAllMemberships();
        return ResponseEntity.ok(memberships);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MembershipDto> getMembershipById(@PathVariable UUID id) {
        MembershipDto membership = membershipService.getMembershipById(id);
        return ResponseEntity.ok(membership);
    }
}