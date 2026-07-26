# API Contract Report

Effective client baseURL: `(empty)`

## Mismatches (0)
_None — every resolvable frontend call maps to a backend route._

## Backend routes (30)
- DELETE /api/admin/scheduling/classes/*
- DELETE /api/admin/scheduling/schedules/*
- DELETE /api/schedule/cancel/*
- DELETE /api/v1/admin/memberships/plans/*
- DELETE /api/v1/admin/testimonials/*
- DELETE /api/v1/admin/trainers/*
- GET /api/schedule/classes
- GET /api/schedule/classes/*
- GET /api/schedule/daily
- GET /api/schedule/weekly
- GET /api/v1/memberships/plans
- GET /api/v1/memberships/plans/*
- GET /api/v1/testimonials
- GET /api/v1/trainers
- POST /api/admin/scheduling/classes
- POST /api/admin/scheduling/schedules
- POST /api/schedule/book
- POST /api/v1/admin/memberships/plans
- POST /api/v1/admin/testimonials
- POST /api/v1/admin/trainers
- POST /api/v1/auth/login
- POST /api/v1/payments/create-order
- POST /api/v1/payments/verify
- POST /api/v1/payments/webhook
- POST /api/v1/trial-leads
- PUT /api/admin/scheduling/classes/*
- PUT /api/admin/scheduling/schedules/*
- PUT /api/v1/admin/memberships/plans/*
- PUT /api/v1/admin/testimonials/*
- PUT /api/v1/admin/trainers/*

## Frontend calls (30)
- GET /api/schedule/classes
- GET /api/schedule/classes/${classId}
- GET /api/schedule/daily
- GET /api/schedule/weekly
- POST /api/schedule/book
- DELETE /api/schedule/cancel/${bookingId}
- POST /api/admin/scheduling/classes
- PUT /api/admin/scheduling/classes/${classId}
- DELETE /api/admin/scheduling/classes/${classId}
- POST /api/admin/scheduling/schedules
- PUT /api/admin/scheduling/schedules/${scheduleId}
- DELETE /api/admin/scheduling/schedules/${scheduleId}
- POST /api/v1/payments/create-order
- POST /api/v1/payments/verify
- POST /api/v1/payments/webhook
- POST /api/v1/auth/login
- POST /api/v1/trial-leads
- GET /api/v1/testimonials
- POST /api/v1/admin/testimonials
- PUT /api/v1/admin/testimonials/${id}
- DELETE /api/v1/admin/testimonials/${id}
- GET /api/v1/trainers
- POST /api/v1/admin/trainers
- PUT /api/v1/admin/trainers/${id}
- DELETE /api/v1/admin/trainers/${id}
- GET /api/v1/memberships/plans
- GET /api/v1/memberships/plans/${id}
- POST /api/v1/admin/memberships/plans
- PUT /api/v1/admin/memberships/plans/${id}
- DELETE /api/v1/admin/memberships/plans/${id}
