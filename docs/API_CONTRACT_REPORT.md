# API Contract Report

Effective client baseURL: `(empty)`

## Mismatches (0)
_None — every resolvable frontend call maps to a backend route._

## Backend routes (33)
- DELETE /api/v1/admin/content/testimonials/*
- DELETE /api/v1/admin/content/trainers/*
- DELETE /api/v1/admin/memberships/*
- DELETE /api/v1/admin/schedules/*
- DELETE /api/v1/bookings/*
- GET /api/v1/admin/leads/trial
- GET /api/v1/admin/schedules
- GET /api/v1/admin/schedules/*
- GET /api/v1/bookings/*
- GET /api/v1/bookings/my-bookings
- GET /api/v1/content/testimonials
- GET /api/v1/content/testimonials/*
- GET /api/v1/content/trainers
- GET /api/v1/content/trainers/*
- GET /api/v1/memberships
- GET /api/v1/memberships/*
- GET /api/v1/schedules
- GET /api/v1/schedules/*
- GET /api/v1/schedules/date-range
- POST /api/v1/admin/content/testimonials
- POST /api/v1/admin/content/trainers
- POST /api/v1/admin/memberships
- POST /api/v1/admin/schedules
- POST /api/v1/auth/login
- POST /api/v1/auth/register
- POST /api/v1/bookings
- POST /api/v1/leads/trial
- POST /api/v1/payments/callback
- POST /api/v1/payments/initiate
- PUT /api/v1/admin/content/testimonials/*
- PUT /api/v1/admin/content/trainers/*
- PUT /api/v1/admin/memberships/*
- PUT /api/v1/admin/schedules/*

## Frontend calls (33)
- POST /api/v1/payments/initiate
- POST /api/v1/payments/callback
- GET /api/v1/schedules
- GET /api/v1/schedules/${id}
- GET /api/v1/schedules/date-range
- GET /api/v1/admin/schedules
- GET /api/v1/admin/schedules/${id}
- POST /api/v1/admin/schedules
- PUT /api/v1/admin/schedules/${id}
- DELETE /api/v1/admin/schedules/${id}
- POST /api/v1/auth/register
- POST /api/v1/auth/login
- POST /api/v1/bookings
- DELETE /api/v1/bookings/${bookingId}
- GET /api/v1/bookings/my-bookings
- GET /api/v1/bookings/${bookingId}
- POST /api/v1/leads/trial
- GET /api/v1/admin/leads/trial
- GET /api/v1/content/trainers
- GET /api/v1/content/trainers/${id}
- GET /api/v1/content/testimonials
- GET /api/v1/content/testimonials/${id}
- POST /api/v1/admin/content/trainers
- PUT /api/v1/admin/content/trainers/${id}
- DELETE /api/v1/admin/content/trainers/${id}
- POST /api/v1/admin/content/testimonials
- PUT /api/v1/admin/content/testimonials/${id}
- DELETE /api/v1/admin/content/testimonials/${id}
- GET /api/v1/memberships
- GET /api/v1/memberships/${id}
- POST /api/v1/admin/memberships
- PUT /api/v1/admin/memberships/${id}
- DELETE /api/v1/admin/memberships/${id}
