# API Contract Report

Effective client baseURL: `(empty)`

## Mismatches (0)
_None — every resolvable frontend call maps to a backend route._

## Backend routes (36)
- DELETE /api/v1/admin/classes/*
- DELETE /api/v1/admin/memberships/plans/*
- DELETE /api/v1/admin/testimonials/*
- DELETE /api/v1/admin/trainers/*
- GET /api/v1/admin/leads/trial
- GET /api/v1/admin/leads/trial/*
- GET /api/v1/admin/memberships/plans
- GET /api/v1/admin/testimonials
- GET /api/v1/admin/testimonials/*
- GET /api/v1/admin/trainers
- GET /api/v1/admin/trainers/*
- GET /api/v1/bookings/my-bookings
- GET /api/v1/classes/*
- GET /api/v1/classes/date
- GET /api/v1/classes/weekly
- GET /api/v1/content/testimonials
- GET /api/v1/content/testimonials/*
- GET /api/v1/content/trainers
- GET /api/v1/content/trainers/*
- GET /api/v1/memberships/my-membership
- GET /api/v1/memberships/plans
- GET /api/v1/memberships/plans/*
- POST /api/v1/admin/classes
- POST /api/v1/admin/memberships/plans
- POST /api/v1/admin/testimonials
- POST /api/v1/admin/trainers
- POST /api/v1/auth/login
- POST /api/v1/auth/register
- POST /api/v1/bookings/*/cancel
- POST /api/v1/classes/*/book
- POST /api/v1/leads/trial
- POST /api/v1/memberships/purchase/*
- PUT /api/v1/admin/classes/*
- PUT /api/v1/admin/memberships/plans/*
- PUT /api/v1/admin/testimonials/*
- PUT /api/v1/admin/trainers/*

## Frontend calls (36)
- POST /api/v1/auth/register
- POST /api/v1/auth/login
- POST /api/v1/bookings/${bookingId}/cancel
- POST /api/v1/leads/trial
- GET /api/v1/admin/leads/trial
- GET /api/v1/admin/leads/trial/${id}
- GET /api/v1/admin/testimonials
- GET /api/v1/admin/testimonials/${id}
- POST /api/v1/admin/testimonials
- PUT /api/v1/admin/testimonials/${id}
- DELETE /api/v1/admin/testimonials/${id}
- GET /api/v1/content/trainers
- GET /api/v1/content/trainers/${id}
- GET /api/v1/content/testimonials
- GET /api/v1/content/testimonials/${id}
- POST /api/v1/classes/${classId}/book
- DELETE /api/v1/admin/classes/${classId}
- GET /api/v1/admin/trainers
- GET /api/v1/admin/trainers/${id}
- POST /api/v1/admin/trainers
- PUT /api/v1/admin/trainers/${id}
- DELETE /api/v1/admin/trainers/${id}
- GET /api/v1/memberships/plans
- GET /api/v1/memberships/plans/${id}
- POST /api/v1/memberships/purchase/${planId}
- GET /api/v1/memberships/my-membership
- POST /api/v1/admin/memberships/plans
- PUT /api/v1/admin/memberships/plans/${id}
- DELETE /api/v1/admin/memberships/plans/${id}
- GET /api/v1/admin/memberships/plans
- GET /api/v1/classes/date
- GET /api/v1/classes/weekly
- GET /api/v1/classes/${classId}
- GET /api/v1/bookings/my-bookings
- POST /api/v1/admin/classes
- PUT /api/v1/admin/classes/${classId}
