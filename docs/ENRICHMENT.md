# Feature Enrichment — Attempt 1

Generated: 2026-07-26

Each section is one LLM call (~5–8K tokens). The instruction tells the generator how all files in the feature interact and what contracts they must honour.

---

## Shared Backend

**Name:** `shared-backend`  
**Type:** SHARED  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/multifitaundh/exception/GlobalExceptionHandler.java` — Centralized exception handler that catches application-wide exceptions and formats them into a consistent `ErrorResponse` DTO.
- `backend/src/main/java/com/multifitaundh/exception/ResourceNotFoundException.java` — Custom exception class used to indicate that a requested resource could not be found.
- `backend/src/main/java/com/multifitaundh/dto/ErrorResponse.java` — Data Transfer Object (DTO) defining the standardized structure for API error responses.
- `backend/src/main/java/com/multifitaundh/controller/SpaController.java` — Spring MVC controller that serves the `index.html` for all non-API and non-static paths, enabling client-side routing for the React SPA.
- `backend/src/main/java/com/multifitaundh/config/DataSeeder.java` — Configuration component that seeds the database with initial data for various domain entities on application startup.

**Feature Instruction:**

The Shared Backend feature provides foundational components for error handling, database seeding, and client-side routing. It includes `GlobalExceptionHandler.java` which centralizes exception handling across the application, converting various exceptions into a standardized `ErrorResponse` DTO. This ensures a consistent API error format for frontend consumption. The `ResourceNotFoundException.java` is a custom exception thrown when an entity is not found, which `GlobalExceptionHandler` specifically handles. `ErrorResponse.java` defines the structure for these standardized error messages. The `SpaController.java` is crucial for enabling client-side routing in the React application by forwarding all non-API and non-static requests to `index.html`. Finally, `DataSeeder.java` initializes the database with essential domain data for `MembershipPlan`, `GymClass`, and `Trainer` entities on application startup, ensuring a functional initial state for development and deployment. This seeder interacts with `MembershipPlanRepository`, `GymClassRepository`, and `TrainerRepository` from the `membership-backend`, `scheduling-backend`, and `content-backend` features respectively to persist the initial data.

---

## Membership Management (Backend)

**Name:** `membership-backend`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/multifitaundh/model/MembershipPlan.java` — MODEL layer — Represents a purchasable gym membership tier with attributes like name, price, and duration.
- `backend/src/main/java/com/multifitaundh/model/MemberSubscription.java` — MODEL layer — Links a User to a MembershipPlan, representing an active or past subscription.
- `backend/src/main/java/com/multifitaundh/repository/MembershipPlanRepository.java` — REPOSITORY layer — Provides CRUD operations for MembershipPlan entities and custom queries for active plans.
- `backend/src/main/java/com/multifitaundh/repository/MemberSubscriptionRepository.java` — REPOSITORY layer — Provides CRUD operations for MemberSubscription entities and custom queries for user subscriptions.
- `backend/src/main/java/com/multifitaundh/service/MembershipService.java` — SERVICE layer — Implements business logic for managing membership plans and member subscriptions, including integration with PaymentService.
- `backend/src/main/java/com/multifitaundh/controller/MembershipController.java` — CONTROLLER layer — Exposes public API endpoints for listing membership plans and initiating a purchase.
- `backend/src/main/java/com/multifitaundh/controller/AdminMembershipController.java` — CONTROLLER layer — Exposes secured admin API endpoints for creating, updating, and deleting membership plans.
- `backend/src/main/java/com/multifitaundh/dto/MembershipPlanDto.java` — DTO layer — Data Transfer Object for MembershipPlan entities, used in API responses and requests.

**Feature Instruction:**

This feature provides the backend logic and API endpoints for managing gym membership plans and member subscriptions. It defines the data models for `MembershipPlan` and `MemberSubscription`, along with their respective Spring Data JPA repositories. The `MembershipService` encapsulates the core business logic, including operations to retrieve membership plans, create new subscriptions, and manage existing ones. It integrates with the pre-scaffolded `PaymentService` for handling payment processing during subscription creation. The `MembershipController` exposes public API endpoints for users to view available membership plans and initiate the purchase process. The `AdminMembershipController` provides secured administrative endpoints for CRUD operations on `MembershipPlan` entities. Data transfer between the frontend and backend is handled by `MembershipPlanDto`.

### MembershipPlan.java
This entity represents a purchasable gym membership tier. It includes fields like `name`, `description`, `price`, `durationInMonths`, and `isActive`. The `id` is a UUID generated automatically.

### MemberSubscription.java
This entity links a `User` to a `MembershipPlan`, representing an active or past subscription. It includes fields like `userId` (UUID), `membershipPlan` (ManyToOne relationship), `startDate`, `endDate`, and `status` (e.g., ACTIVE, EXPIRED, CANCELLED). The `id` is a UUID generated automatically.

### MembershipPlanRepository.java
This repository extends `JpaRepository` for `MembershipPlan` entities, providing standard CRUD operations. It will include a custom query method to find all active membership plans.

### MemberSubscriptionRepository.java
This repository extends `JpaRepository` for `MemberSubscription` entities, providing standard CRUD operations. It will include custom query methods to find subscriptions by `userId` and to find active subscriptions.

### MembershipService.java
This service orchestrates the business logic for memberships. It injects `MembershipPlanRepository` and `MemberSubscriptionRepository`. It also injects the pre-scaffolded `PaymentService` to handle payment processing.

**Public Functions:**

1.  `List<MembershipPlanDto> getAllActiveMembershipPlans()`:
    *   **Logic:**
        1.  Calls `membershipPlanRepository.findByIsActiveTrue()` to retrieve all active `MembershipPlan` entities.
        2.  Maps the entities to `MembershipPlanDto` objects.
        3.  Returns the list of DTOs.
    *   **Error Cases:** None specific; an empty list is returned if no active plans exist.

2.  `MembershipPlanDto getMembershipPlanById(UUID id)`:
    *   **Logic:**
        1.  Calls `membershipPlanRepository.findById(id)`.
        2.  If the plan is not found, throws `ResourceNotFoundException`.
        3.  Maps the found `MembershipPlan` entity to `MembershipPlanDto`.
        4.  Returns the DTO.
    *   **Error Cases:** Throws `ResourceNotFoundException` if no plan with the given ID exists.

3.  `MemberSubscription createSubscription(UUID userId, UUID membershipPlanId)`:
    *   **Logic:**
        1.  Retrieves the `MembershipPlan` by `membershipPlanId` using `membershipPlanRepository.findById()`. Throws `ResourceNotFoundException` if not found.
        2.  Calculates `startDate` as `LocalDate.now()` and `endDate` based on `membershipPlan.getDurationInMonths()`.
        3.  Creates a new `MemberSubscription` entity with `userId`, `membershipPlan`, `startDate`, `endDate`, and `status` as `ACTIVE`.
        4.  Calls `memberSubscriptionRepository.save()` to persist the subscription.
        5.  Returns the created `MemberSubscription`.
    *   **Error Cases:** Throws `ResourceNotFoundException` if the `membershipPlanId` is invalid.

4.  `MembershipPlanDto createMembershipPlan(MembershipPlanDto membershipPlanDto)`:
    *   **Logic:**
        1.  Maps the `membershipPlanDto` to a new `MembershipPlan` entity.
        2.  Sets `isActive` to `true` by default for new plans.
        3.  Calls `membershipPlanRepository.save()` to persist the new plan.
        4.  Maps the saved entity back to `MembershipPlanDto`.
        5.  Returns the DTO.
    *   **Error Cases:** None specific.

5.  `MembershipPlanDto updateMembershipPlan(UUID id, MembershipPlanDto membershipPlanDto)`:
    *   **Logic:**
        1.  Retrieves the existing `MembershipPlan` by `id` using `membershipPlanRepository.findById()`. Throws `ResourceNotFoundException` if not found.
        2.  Updates the fields of the existing plan with values from `membershipPlanDto`.
        3.  Calls `membershipPlanRepository.save()` to update the plan.
        4.  Maps the updated entity back to `MembershipPlanDto`.
        5.  Returns the DTO.
    *   **Error Cases:** Throws `ResourceNotFoundException` if no plan with the given ID exists.

6.  `void deleteMembershipPlan(UUID id)`:
    *   **Logic:**
        1.  Checks if a `MembershipPlan` with the given `id` exists using `membershipPlanRepository.existsById()`. Throws `ResourceNotFoundException` if not found.
        2.  Calls `membershipPlanRepository.deleteById(id)`.
    *   **Error Cases:** Throws `ResourceNotFoundException` if no plan with the given ID exists.

### MembershipController.java
This controller exposes public API endpoints for users to interact with membership plans. It injects `MembershipService`.

**API Endpoints:**

1.  `GET /api/v1/memberships/plans`:
    *   **Description:** Retrieves a list of all active membership plans.
    *   **Access:** public
    *   **Response Body:** `List<MembershipPlanDto>`

2.  `GET /api/v1/memberships/plans/{id}`:
    *   **Description:** Retrieves a specific membership plan by its ID.
    *   **Access:** public
    *   **Response Body:** `MembershipPlanDto`
    *   **Error Cases:** Returns 404 NOT FOUND if the plan does not exist.

### AdminMembershipController.java
This controller exposes secured administrative API endpoints for managing membership plans. It injects `MembershipService`.

**API Endpoints:**

1.  `POST /api/v1/admin/memberships/plans`:
    *   **Description:** Creates a new membership plan.
    *   **Access:** admin
    *   **Request Body:** `MembershipPlanDto`
    *   **Response Body:** `MembershipPlanDto`

2.  `PUT /api/v1/admin/memberships/plans/{id}`:
    *   **Description:** Updates an existing membership plan by its ID.
    *   **Access:** admin
    *   **Request Body:** `MembershipPlanDto`
    *   **Response Body:** `MembershipPlanDto`
    *   **Error Cases:** Returns 404 NOT FOUND if the plan does not exist.

3.  `DELETE /api/v1/admin/memberships/plans/{id}`:
    *   **Description:** Deletes a membership plan by its ID.
    *   **Access:** admin
    *   **Response Body:** `void`
    *   **Error Cases:** Returns 404 NOT FOUND if the plan does not exist.

### MembershipPlanDto.java
This DTO defines the structure for transferring `MembershipPlan` data between the frontend and backend. It includes fields like `id`, `name`, `description`, `price`, `durationInMonths`, and `isActive` with appropriate validation annotations.

---

## Class Scheduling (Backend)

**Name:** `scheduling-backend`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/multifitaundh/model/GymClass.java` — MODEL layer — defines the structure for a gym class, linking to the Trainer entity from the content-backend feature.
- `backend/src/main/java/com/multifitaundh/model/ClassSchedule.java` — MODEL layer — defines a specific, bookable instance of a GymClass.
- `backend/src/main/java/com/multifitaundh/model/Booking.java` — MODEL layer — defines a user's confirmed booking for a ClassSchedule.
- `backend/src/main/java/com/multifitaundh/repository/GymClassRepository.java` — REPOSITORY layer — provides data access for GymClass entities.
- `backend/src/main/java/com/multifitaundh/repository/ClassScheduleRepository.java` — REPOSITORY layer — provides data access for ClassSchedule entities.
- `backend/src/main/java/com/multifitaundh/repository/BookingRepository.java` — REPOSITORY layer — provides data access for Booking entities.
- `backend/src/main/java/com/multifitaundh/service/SchedulingService.java` — SERVICE layer — implements business logic for managing gym classes, schedules, and user bookings. It exposes methods for public schedule viewing and authenticated booking actions, as well as admin-level management.
- `backend/src/main/java/com/multifitaundh/controller/ScheduleController.java` — CONTROLLER layer — exposes public API endpoints for viewing the class schedule and making bookings for authenticated users.
- `backend/src/main/java/com/multifitaundh/controller/AdminSchedulingController.java` — CONTROLLER layer — exposes secured admin API endpoints for managing gym classes and their schedules.
- `backend/src/main/java/com/multifitaundh/dto/GymClassDto.java` — DTO layer — Data Transfer Object for GymClass entities, used for API request and response bodies.
- `backend/src/main/java/com/multifitaundh/dto/ClassScheduleDto.java` — DTO layer — Data Transfer Object for ClassSchedule entities, often including related GymClass info, used for API request and response bodies.
- `backend/src/main/java/com/multifitaundh/exception/BookingConflictException.java` — EXCEPTION layer — Custom exception for business rule violations during class booking.

**Feature Instruction:**

This feature provides the backend logic and API endpoints for managing gym classes, their schedules, and user bookings at MultiFit Aundh. It encompasses three core domain models: `GymClass` (representing a type of class like 'Zumba'), `ClassSchedule` (a specific instance of a `GymClass` at a given time and date), and `Booking` (a user's confirmed reservation for a `ClassSchedule`).

The `GymClass` model stores details such as the class name, description, duration, and a reference to the `Trainer` who teaches it. The `ClassSchedule` model links a `GymClass` to a specific date, time, and maximum capacity. The `Booking` model records which `User` has booked which `ClassSchedule`.

`GymClassRepository`, `ClassScheduleRepository`, and `BookingRepository` provide standard CRUD operations for their respective entities. The `SchedulingService` orchestrates the business logic. It provides methods for fetching all available gym classes and their schedules, creating new classes and schedules (admin-only), and handling user bookings. When a user attempts to book a class, the service checks for availability and prevents overbooking or duplicate bookings by throwing a `BookingConflictException`.

The `ScheduleController` exposes public API endpoints for users to view the class schedule and make bookings. It consumes `ClassScheduleDto` and `BookingRequestDto` (not explicitly listed but implied for booking) and returns `ClassScheduleDto` and `BookingDto` (also implied). The `AdminSchedulingController` provides secured endpoints for administrators to create, update, and delete `GymClass` and `ClassSchedule` entities, consuming and returning `GymClassDto` and `ClassScheduleDto`.

All DTOs (`GymClassDto`, `ClassScheduleDto`, `BookingDto`, `BookingRequestDto`) are used for data transfer between the controllers and the service layer, ensuring a clean separation from the JPA entities. The `BookingConflictException` is a custom exception used to signal business rule violations during the booking process.

**Inter-file Wiring:**
- `ScheduleController` and `AdminSchedulingController` inject `SchedulingService`.
- `SchedulingService` injects `GymClassRepository`, `ClassScheduleRepository`, and `BookingRepository`.
- `GymClass` imports `Trainer` from the `content-backend` feature.
- `ClassSchedule` imports `GymClass`.
- `Booking` imports `ClassSchedule`.

**Method Contracts:**

**`SchedulingService.java`**

1.  `List<GymClassDto> getAllGymClasses()`
    -   **Logic:**
        1.  Fetches all `GymClass` entities from `GymClassRepository`.
        2.  Maps `GymClass` entities to `GymClassDto`.
        3.  Returns the list of `GymClassDto`.
    -   **Error Cases:** None.

2.  `GymClassDto getGymClassById(UUID classId)`
    -   **Logic:**
        1.  Fetches a `GymClass` entity by `classId` from `GymClassRepository`.
        2.  If not found, throws `ResourceNotFoundException`.
        3.  Maps the `GymClass` entity to `GymClassDto`.
        4.  Returns the `GymClassDto`.
    -   **Error Cases:** `ResourceNotFoundException` (HTTP 404) if the class is not found.

3.  `List<ClassScheduleDto> getScheduleForDate(LocalDate date)`
    -   **Logic:**
        1.  Fetches all `ClassSchedule` entities for the given `date` from `ClassScheduleRepository`.
        2.  Maps `ClassSchedule` entities to `ClassScheduleDto`.
        3.  Returns the list of `ClassScheduleDto`.
    -   **Error Cases:** None.

4.  `List<ClassScheduleDto> getScheduleForWeek(LocalDate startDate)`
    -   **Logic:**
        1.  Calculates the end date (7 days from `startDate`).
        2.  Fetches all `ClassSchedule` entities within the date range from `ClassScheduleRepository`.
        3.  Maps `ClassSchedule` entities to `ClassScheduleDto`.
        4.  Returns the list of `ClassScheduleDto`.
    -   **Error Cases:** None.

5.  `BookingDto bookClass(UUID classScheduleId, UUID userId)`
    -   **Logic:**
        1.  Fetches `ClassSchedule` by `classScheduleId` from `ClassScheduleRepository`.
        2.  If not found, throws `ResourceNotFoundException`.
        3.  Checks if the class is full (`currentBookings < maxCapacity`). If full, throws `BookingConflictException`.
        4.  Checks if the user already has a booking for this `classScheduleId`. If yes, throws `BookingConflictException`.
        5.  Creates a new `Booking` entity with `classScheduleId` and `userId`.
        6.  Saves the `Booking` entity using `BookingRepository`.
        7.  Increments `currentBookings` on the `ClassSchedule` and saves it.
        8.  Maps the new `Booking` entity to `BookingDto`.
        9.  Returns the `BookingDto`.
    -   **Error Cases:** `ResourceNotFoundException` (HTTP 404) if `ClassSchedule` not found. `BookingConflictException` (HTTP 409) if class is full or user already booked.

6.  `void cancelBooking(UUID bookingId, UUID userId)`
    -   **Logic:**
        1.  Fetches `Booking` by `bookingId` and `userId` from `BookingRepository`.
        2.  If not found, throws `ResourceNotFoundException`.
        3.  Fetches the associated `ClassSchedule`.
        4.  Deletes the `Booking` entity from `BookingRepository`.
        5.  Decrements `currentBookings` on the `ClassSchedule` and saves it.
    -   **Error Cases:** `ResourceNotFoundException` (HTTP 404) if booking not found or user does not own the booking.

7.  `GymClassDto createGymClass(GymClassDto gymClassDto)`
    -   **Logic:**
        1.  Maps `gymClassDto` to a `GymClass` entity.
        2.  Saves the `GymClass` entity using `GymClassRepository`.
        3.  Maps the saved `GymClass` back to `GymClassDto`.
        4.  Returns the `GymClassDto`.
    -   **Error Cases:** None.

8.  `GymClassDto updateGymClass(UUID classId, GymClassDto gymClassDto)`
    -   **Logic:**
        1.  Fetches `GymClass` by `classId` from `GymClassRepository`.
        2.  If not found, throws `ResourceNotFoundException`.
        3.  Updates the fields of the fetched `GymClass` with values from `gymClassDto`.
        4.  Saves the updated `GymClass` entity using `GymClassRepository`.
        5.  Maps the saved `GymClass` back to `GymClassDto`.
        6.  Returns the `GymClassDto`.
    -   **Error Cases:** `ResourceNotFoundException` (HTTP 404) if the class is not found.

9.  `void deleteGymClass(UUID classId)`
    -   **Logic:**
        1.  Deletes `GymClass` by `classId` from `GymClassRepository`.
    -   **Error Cases:** None (repository handles non-existent IDs gracefully).

10. `ClassScheduleDto createClassSchedule(ClassScheduleDto classScheduleDto)`
    -   **Logic:**
        1.  Fetches `GymClass` by `gymClassId` from `GymClassRepository` (from `classScheduleDto`).
        2.  If `GymClass` not found, throws `ResourceNotFoundException`.
        3.  Maps `classScheduleDto` to a `ClassSchedule` entity, linking the fetched `GymClass`.
        4.  Sets `currentBookings` to 0.
        5.  Saves the `ClassSchedule` entity using `ClassScheduleRepository`.
        6.  Maps the saved `ClassSchedule` back to `ClassScheduleDto`.
        7.  Returns the `ClassScheduleDto`.
    -   **Error Cases:** `ResourceNotFoundException` (HTTP 404) if the associated `GymClass` is not found.

11. `ClassScheduleDto updateClassSchedule(UUID scheduleId, ClassScheduleDto classScheduleDto)`
    -   **Logic:**
        1.  Fetches `ClassSchedule` by `scheduleId` from `ClassScheduleRepository`.
        2.  If not found, throws `ResourceNotFoundException`.
        3.  Fetches `GymClass` by `gymClassId` from `GymClassRepository` (from `classScheduleDto`).
        4.  If `GymClass` not found, throws `ResourceNotFoundException`.
        5.  Updates the fields of the fetched `ClassSchedule` with values from `classScheduleDto`, linking the fetched `GymClass`.
        6.  Saves the updated `ClassSchedule` entity using `ClassScheduleRepository`.
        7.  Maps the saved `ClassSchedule` back to `ClassScheduleDto`.
        8.  Returns the `ClassScheduleDto`.
    -   **Error Cases:** `ResourceNotFoundException` (HTTP 404) if `ClassSchedule` or associated `GymClass` not found.

12. `void deleteClassSchedule(UUID scheduleId)`
    -   **Logic:**
        1.  Deletes `ClassSchedule` by `scheduleId` from `ClassScheduleRepository`.
    -   **Error Cases:** None (repository handles non-existent IDs gracefully).

**DTOs:**
- `GymClassDto`: Used for transferring `GymClass` data, including `id`, `name`, `description`, `durationMinutes`, `trainerId`, and `trainerName`.
- `ClassScheduleDto`: Used for transferring `ClassSchedule` data, including `id`, `gymClassId`, `gymClassName`, `trainerName`, `scheduleDate`, `startTime`, `endTime`, `maxCapacity`, and `currentBookings`.
- `BookingRequestDto` (implied): Used for requesting a booking, containing `classScheduleId`.
- `BookingDto` (implied): Used for returning booking details, including `id`, `classScheduleId`, `userId`, `bookingDate`.

**Error Handling:**
- `ResourceNotFoundException` will be caught by `GlobalExceptionHandler` (from `shared-backend`) and return HTTP 404.
- `BookingConflictException` will be caught by `GlobalExceptionHandler` and return HTTP 409.

**Cross-Feature Interactions:**
- This feature depends on `content-backend` for `Trainer` entity details, specifically when creating or updating `GymClass` entities that reference a `Trainer`.
- This feature depends on `auth-backend` (implied, not explicitly listed in peer contracts but standard for user authentication) for `userId` in booking operations.
- This feature depends on `shared-backend` for `ResourceNotFoundException` handling via `GlobalExceptionHandler`.

---

## Content Management (Backend)

**Name:** `content-backend`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/multifitaundh/model/Trainer.java` — MODEL layer — represents a gym trainer with their profile details.
- `backend/src/main/java/com/multifitaundh/model/Testimonial.java` — MODEL layer — represents a customer testimonial.
- `backend/src/main/java/com/multifitaundh/model/TrialLead.java` — MODEL layer — represents a lead captured from the '3-Day Free Trial' form.
- `backend/src/main/java/com/multifitaundh/repository/TrainerRepository.java` — REPOSITORY layer — provides CRUD operations for Trainer entities.
- `backend/src/main/java/com/multifitaundh/repository/TestimonialRepository.java` — REPOSITORY layer — provides CRUD operations for Testimonial entities.
- `backend/src/main/java/com/multifitaundh/repository/TrialLeadRepository.java` — REPOSITORY layer — provides CRUD operations for TrialLead entities.
- `backend/src/main/java/com/multifitaundh/service/ContentService.java` — SERVICE layer — implements business logic for managing trainers, testimonials, and trial leads, including: getAllTrainers(): List<TrainerDto>, getTrainerById(UUID): TrainerDto, createTrainer(TrainerDto): TrainerDto, updateTrainer(UUID, TrainerDto): TrainerDto, deleteTrainer(UUID): void, getAllTestimonials(): List<TestimonialDto>, getTestimonialById(UUID): TestimonialDto, createTestimonial(TestimonialDto): TestimonialDto, updateTestimonial(UUID, TestimonialDto): TestimonialDto, deleteTestimonial(UUID): void, createTrialLead(TrialLeadDto): TrialLeadDto.
- `backend/src/main/java/com/multifitaundh/controller/ContentController.java` — CONTROLLER layer — exposes public API endpoints for fetching trainers, testimonials, and submitting trial leads.
- `backend/src/main/java/com/multifitaundh/controller/AdminContentController.java` — CONTROLLER layer — exposes secured admin API endpoints for managing trainers and testimonials.
- `backend/src/main/java/com/multifitaundh/dto/TrainerDto.java` — DTO layer — Data Transfer Object for Trainer entities.
- `backend/src/main/java/com/multifitaundh/dto/TestimonialDto.java` — DTO layer — Data Transfer Object for Testimonial entities.
- `backend/src/main/java/com/multifitaundh/dto/TrialLeadDto.java` — DTO layer — Data Transfer Object for submitting a new TrialLead.

**Feature Instruction:**

This feature, Content Management (Backend), provides the core backend services and API endpoints for managing static content such as gym trainers, customer testimonials, and trial leads. It includes data models, repositories, a service layer for business logic, and two controllers: one for public-facing read operations and trial lead submission, and another for authenticated administrative CRUD operations.

### Data Models
- `Trainer.java`: Represents a gym trainer with fields for `id` (UUID), `name` (String), `specialization` (String), `bio` (String), and `imageUrl` (String). It will be an `@Entity` with standard JPA annotations.
- `Testimonial.java`: Represents a customer testimonial with fields for `id` (UUID), `authorName` (String), `rating` (Integer, 1-5), `content` (String), and `displayDate` (LocalDate). It will be an `@Entity` with standard JPA annotations.
- `TrialLead.java`: Represents a lead captured from the '3-Day Free Trial' form with fields for `id` (UUID), `name` (String), `email` (String), `phoneNumber` (String), and `submissionDate` (LocalDateTime). It will be an `@Entity` with standard JPA annotations.

### Repositories
- `TrainerRepository.java`: Extends `JpaRepository<Trainer, UUID>` to provide CRUD operations for `Trainer` entities.
- `TestimonialRepository.java`: Extends `JpaRepository<Testimonial, UUID>` to provide CRUD operations for `Testimonial` entities.
- `TrialLeadRepository.java`: Extends `JpaRepository<TrialLead, UUID>` to provide CRUD operations for `TrialLead` entities.

### DTOs
- `TrainerDto.java`: Used for transferring trainer data between the service and controller layers. It will have fields `id` (UUID), `name` (String), `specialization` (String), `bio` (String), and `imageUrl` (String). All fields except `id` should have appropriate validation annotations (e.g., `@NotBlank`, `@Size`).
- `TestimonialDto.java`: Used for transferring testimonial data. It will have fields `id` (UUID), `authorName` (String), `rating` (Integer), `content` (String), and `displayDate` (LocalDate). All fields except `id` should have appropriate validation annotations (e.g., `@NotBlank`, `@Min`, `@Max`).
- `TrialLeadDto.java`: Used for submitting new trial leads. It will have fields `name` (String), `email` (String), and `phoneNumber` (String). All fields should have appropriate validation annotations (e.g., `@NotBlank`, `@Email`, `@Pattern`).

### Service Layer (`ContentService.java`)
`ContentService` will be annotated with `@Service` and will handle the business logic. It will inject `TrainerRepository`, `TestimonialRepository`, and `TrialLeadRepository`.

**Public Methods:**
- `List<TrainerDto> getAllTrainers()`:
  1. Fetches all `Trainer` entities from `trainerRepository`.
  2. Maps them to `TrainerDto` objects.
  3. Returns the list of `TrainerDto`.
- `TrainerDto getTrainerById(UUID id)`:
  1. Fetches a `Trainer` entity by `id` from `trainerRepository`.
  2. If not found, throws `ResourceNotFoundException`.
  3. Maps the entity to `TrainerDto`.
  4. Returns the `TrainerDto`.
- `TrainerDto createTrainer(TrainerDto trainerDto)`:
  1. Maps the `trainerDto` to a `Trainer` entity.
  2. Saves the `Trainer` entity using `trainerRepository.save()`.
  3. Maps the saved entity back to `TrainerDto`.
  4. Returns the created `TrainerDto`.
- `TrainerDto updateTrainer(UUID id, TrainerDto trainerDto)`:
  1. Fetches the existing `Trainer` entity by `id` from `trainerRepository`.
  2. If not found, throws `ResourceNotFoundException`.
  3. Updates the fields of the existing entity with values from `trainerDto`.
  4. Saves the updated `Trainer` entity using `trainerRepository.save()`.
  5. Maps the saved entity back to `TrainerDto`.
  6. Returns the updated `TrainerDto`.
- `void deleteTrainer(UUID id)`:
  1. Checks if a `Trainer` with the given `id` exists using `trainerRepository.existsById()`.
  2. If not found, throws `ResourceNotFoundException`.
  3. Deletes the `Trainer` entity by `id` using `trainerRepository.deleteById()`.
- `List<TestimonialDto> getAllTestimonials()`:
  1. Fetches all `Testimonial` entities from `testimonialRepository`.
  2. Maps them to `TestimonialDto` objects.
  3. Returns the list of `TestimonialDto`.
- `TestimonialDto getTestimonialById(UUID id)`:
  1. Fetches a `Testimonial` entity by `id` from `testimonialRepository`.
  2. If not found, throws `ResourceNotFoundException`.
  3. Maps the entity to `TestimonialDto`.
  4. Returns the `TestimonialDto`.
- `TestimonialDto createTestimonial(TestimonialDto testimonialDto)`:
  1. Maps the `testimonialDto` to a `Testimonial` entity.
  2. Sets `displayDate` to `LocalDate.now()` if not provided.
  3. Saves the `Testimonial` entity using `testimonialRepository.save()`.
  4. Maps the saved entity back to `TestimonialDto`.
  5. Returns the created `TestimonialDto`.
- `TestimonialDto updateTestimonial(UUID id, TestimonialDto testimonialDto)`:
  1. Fetches the existing `Testimonial` entity by `id` from `testimonialRepository`.
  2. If not found, throws `ResourceNotFoundException`.
  3. Updates the fields of the existing entity with values from `testimonialDto`.
  4. Saves the updated `Testimonial` entity using `testimonialRepository.save()`.
  5. Maps the saved entity back to `TestimonialDto`.
  6. Returns the updated `TestimonialDto`.
- `void deleteTestimonial(UUID id)`:
  1. Checks if a `Testimonial` with the given `id` exists using `testimonialRepository.existsById()`.
  2. If not found, throws `ResourceNotFoundException`.
  3. Deletes the `Testimonial` entity by `id` using `testimonialRepository.deleteById()`.
- `TrialLeadDto createTrialLead(TrialLeadDto trialLeadDto)`:
  1. Maps the `trialLeadDto` to a `TrialLead` entity.
  2. Sets `submissionDate` to `LocalDateTime.now()`.
  3. Saves the `TrialLead` entity using `trialLeadRepository.save()`.
  4. Maps the saved entity back to `TrialLeadDto`.
  5. Returns the created `TrialLeadDto`.

### Controllers
- `ContentController.java`: Annotated with `@RestController` and `@RequestMapping("/api/v1")`. It injects `ContentService`.
  - Exposes public endpoints for fetching trainers and testimonials, and submitting trial leads.
  - `getAllTrainers()`: GET `/api/v1/trainers` - calls `contentService.getAllTrainers()`.
  - `getAllTestimonials()`: GET `/api/v1/testimonials` - calls `contentService.getAllTestimonials()`.
  - `submitTrialLead(TrialLeadDto trialLeadDto)`: POST `/api/v1/trial-leads` - calls `contentService.createTrialLead(trialLeadDto)`.
- `AdminContentController.java`: Annotated with `@RestController` and `@RequestMapping("/api/v1/admin")`. It injects `ContentService`.
  - Exposes secured admin endpoints for managing trainers and testimonials.
  - `createTrainer(TrainerDto trainerDto)`: POST `/api/v1/admin/trainers` - calls `contentService.createTrainer(trainerDto)`.
  - `updateTrainer(UUID id, TrainerDto trainerDto)`: PUT `/api/v1/admin/trainers/{id}` - calls `contentService.updateTrainer(id, trainerDto)`.
  - `deleteTrainer(UUID id)`: DELETE `/api/v1/admin/trainers/{id}` - calls `contentService.deleteTrainer(id)`.
  - `createTestimonial(TestimonialDto testimonialDto)`: POST `/api/v1/admin/testimonials` - calls `contentService.createTestimonial(testimonialDto)`.
  - `updateTestimonial(UUID id, TestimonialDto testimonialDto)`: PUT `/api/v1/admin/testimonials/{id}` - calls `contentService.updateTestimonial(id, testimonialDto)`.
  - `deleteTestimonial(UUID id)`: DELETE `/api/v1/admin/testimonials/{id}` - calls `contentService.deleteTestimonial(id)`.

Error Handling: Both controllers will leverage a global exception handler (e.g., `GlobalExceptionHandler` from `shared-backend`) to return appropriate HTTP status codes and error messages for exceptions like `ResourceNotFoundException` (404 Not Found) and validation errors (400 Bad Request).

---

## Shared Frontend

**Name:** `shared-frontend`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/api/client.ts` — Global Axios instance configuration — sets base URL and adds an interceptor for JWT authentication.
- `frontend/src/App.tsx` — Root React component — sets up React Query client, AuthContext provider, and router.
- `frontend/src/components/Layout.tsx` — Main application layout for public pages — includes Header, Footer, and main content area.
- `frontend/src/components/Header.tsx` — Site-wide header component — displays logo, navigation links, and call-to-action buttons.
- `frontend/src/components/Footer.tsx` — Site-wide footer component — displays contact information, social links, and sitemap.
- `frontend/src/components/AdminLayout.tsx` — Layout for the admin section — includes a sidebar for navigation and a main content area.
- `frontend/src/pages/NotFoundPage.tsx` — A user-friendly 404 page — shown when a route does not match.

**Feature Instruction:**

This feature provides the foundational frontend infrastructure and shared UI components for the MultiFit Aundh application. It includes the global Axios client configuration, the root `App` component for setting up React Query and authentication, and the main `Layout` components for both public-facing pages and the admin portal. It also defines common UI elements like the `Header`, `Footer`, and a `NotFoundPage`.

## Design Tokens
- Navbar: bg-[#1A1A1A] text-[#F5F5F5]
- Primary CTA: bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200
- Brand text accent: text-[#DFFF00]
- Section bg: bg-white (odd sections) / bg-gray-50 (even sections)
- Card: bg-white rounded-xl shadow-md border border-gray-100 p-6
- Section container: <section className="py-16 px-4"><div className="max-w-7xl mx-auto">
- Hero h1: text-4xl md:text-6xl font-bold text-[#F5F5F5]
- Body: text-gray-700 leading-relaxed

### `frontend/src/api/client.ts`
This file configures the global Axios instance. It sets the `baseURL` to `/api/v1` and adds an interceptor to include the JWT token from `localStorage` in the `Authorization` header for every outgoing request. The token is stored under the key 'token'.

### `frontend/src/App.tsx`
This is the root component of the React application. It sets up the `QueryClientProvider` for React Query, ensuring that data fetching and caching are globally available. It also wraps the application with `AuthProvider` from `auth-frontend` to manage global authentication state and `BrowserRouter` from `react-router-dom` to handle client-side routing. The `App` component will render the main application routes.

### `frontend/src/components/Layout.tsx`
This component provides the main layout structure for all public-facing pages. It includes the `Header` at the top, the `Footer` at the bottom, and a `main` content area in between. The `Header` and `Footer` components are imported and rendered directly. The `Layout` component accepts `children` as props, which will be rendered within the `main` content area. The header will include navigation links for Home, Memberships, Schedule, Trainers, and Contact, along with a "Login" button and a "Join Now" CTA. The footer will display business contact information, social media links, and a sitemap.

### `frontend/src/components/Header.tsx`
This component renders the site-wide header. It will display the MultiFit Aundh logo (as text for now), primary navigation links (Home, Memberships, Schedule, Trainers, Contact), and call-to-action buttons for "Login" and "Join Now". The navigation links will use `react-router-dom`'s `Link` component. The "Login" button will navigate to `/login` and the "Join Now" button will navigate to `/memberships`.

### `frontend/src/components/Footer.tsx`
This component renders the site-wide footer. It will display the business name "MultiFit Aundh", the address "Multifit Aundh , D.P. Road Medipoint Hospital Road, opp. to Indian Bank, Aundh, Pune, Maharashtra 411067", phone number "075070 08009", and opening hours. It will also include placeholder links for social media and a sitemap. All monetary values (if any were displayed here) would use `toLocaleString('en-IN', { style: 'currency', currency: 'INR' })`.

### `frontend/src/components/AdminLayout.tsx`
This component provides the layout for the admin section of the application. It includes a sidebar for admin navigation and a main content area. The sidebar will contain links to manage Memberships, Scheduling, Trainers, and Testimonials. The `AdminLayout` component accepts `children` as props, which will be rendered within the main content area.

### `frontend/src/pages/NotFoundPage.tsx`
This page is displayed when a user navigates to a route that does not exist. It will present a user-friendly 404 message, such as "Page Not Found" and a link back to the homepage. The design should be clean and consistent with the overall brand aesthetic, using the defined design tokens.

---

## Authentication UI

**Name:** `auth-frontend`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/components/ProtectedRoute.tsx` — A React component that acts as a route guard, restricting access to its children based on user authentication status and optional role-based authorization by consuming the `useAuth` hook.
- `frontend/src/context/AuthContext.tsx` — React Context for managing global authentication state, providing `user`, `token`, `isAuthenticated`, `login(AuthResponse)`, and `logout()` to consuming components.
- `frontend/src/hooks/useAuth.ts` — Custom React hook for easy consumption of the `AuthContext`, providing direct access to the authentication state and actions.
- `frontend/src/services/authService.ts` — Provides asynchronous functions for interacting with the backend authentication API, specifically `loginUser(LoginRequest)` and `registerUser(RegisterRequest)`.
- `frontend/src/types/auth.ts` — TypeScript type definitions for authentication-related data structures.
- `frontend/src/pages/LoginPage.tsx` — A React page component that renders a login form, handles user input, calls the authentication service, and manages redirection upon successful login or displays errors.

**Feature Instruction:**

## Design Tokens
- Navbar: bg-[#1A1A1A] text-[#F5F5F5]
- Primary CTA: bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200
- Brand text accent: text-[#DFFF00]
- Section bg: bg-white (odd sections) / bg-gray-50 (even sections)
- Card: bg-white rounded-xl shadow-md border border-gray-100 p-6
- Section container: <section className="py-16 px-4"><div className="max-w-7xl mx-auto">
- Hero h1: text-4xl md:text-6xl font-bold text-white
- Body: text-gray-700 leading-relaxed

This feature provides the client-side authentication logic and UI for the MultiFit Aundh gym. It includes components for user login, a React Context for managing authentication state, a custom hook to consume this context, and a service for interacting with the backend authentication API. The core functionality revolves around `AuthContext.tsx` which stores the user's authentication token and user details, and provides `login` and `logout` functions. `authService.ts` handles the actual API calls to the backend for user authentication. `useAuth.ts` is a convenience hook to access the authentication state and actions throughout the application. `ProtectedRoute.tsx` is a higher-order component that wraps routes requiring authentication, redirecting unauthenticated users to the login page. `LoginPage.tsx` provides the user interface for logging in.

### `AuthContext.tsx`
This file defines the `AuthContext` and `AuthProvider`. The `AuthProvider` component will manage the authentication state, including the user object and the JWT token. It will provide `login` and `logout` functions to its consumers. The token will be stored in `localStorage` under the key 'token'. The `login` function will take `AuthResponse` as an argument, store the token and user data, and update the state. The `logout` function will clear the token from `localStorage` and reset the authentication state. The initial state will attempt to load a token from `localStorage`.

### `useAuth.ts`
This custom React hook simplifies access to the `AuthContext`. It will export a `useAuth` function that returns the current authentication state (user, token, isAuthenticated) and the `login` and `logout` functions from the context.

### `authService.ts`
This service is responsible for making API calls to the backend authentication endpoints. It will contain `loginUser` and `registerUser` functions. `loginUser` will take `LoginRequest` as input and call the `/api/v1/auth/login` endpoint, returning an `AuthResponse`. `registerUser` will take `RegisterRequest` as input and call the `/api/v1/auth/register` endpoint, returning an `AuthResponse`. It will use the pre-scaffolded `apiClient` from `frontend/src/api/client.ts` for HTTP requests.

### `auth.ts`
This file defines the TypeScript interfaces for authentication-related data structures, specifically `User`, `AuthResponse`, `LoginRequest`, and `RegisterRequest`. These types ensure strong typing across the authentication feature.

### `ProtectedRoute.tsx`
This component acts as a guard for routes that require authentication. It will receive `children` (the protected route's content) and an optional `allowedRoles` prop. It will use the `useAuth` hook to check if a user is authenticated and if their role matches any of the `allowedRoles`. If the user is not authenticated, they will be redirected to the `/login` page. If authenticated but not authorized (role mismatch), they will be redirected to a `/unauthorized` page (or similar, if one exists in `shared-frontend`, otherwise to the home page).

### `LoginPage.tsx`
This page provides the user interface for logging into the MultiFit Aundh gym. It will feature a prominent form with fields for email and password. Upon successful login, the user will be redirected to the home page or a dashboard. The page will use the `useAuth` hook to call the `login` function. The design will be energetic and modern, reflecting the gym's brand. The layout will be centered, with a clear call to action. Error messages from failed login attempts will be displayed to the user. The page will be wrapped in the `Layout` component from `shared-frontend`.

**Login Flow:**
1. User enters email and password in `LoginPage.tsx`.
2. `LoginPage.tsx` calls `useAuth().login`.
3. `useAuth().login` calls `authService.loginUser(email, password)`.
4. `authService.loginUser` makes a POST request to `/api/v1/auth/login` with `LoginRequest`.
5. Upon successful response, `authService.loginUser` returns `AuthResponse`.
6. `useAuth().login` receives `AuthResponse`, stores the token in `localStorage` ('token' key) and updates the `AuthContext` state.
7. `LoginPage.tsx` redirects the user to the home page or a protected route.

**Protected Route Flow:**
1. A user attempts to access a route wrapped by `ProtectedRoute.tsx`.
2. `ProtectedRoute.tsx` uses `useAuth()` to check `isAuthenticated` and `user.role`.
3. If `isAuthenticated` is false, redirect to `/login`.
4. If `isAuthenticated` is true but `user.role` does not match `allowedRoles`, redirect to `/` (home page).
5. Otherwise, render the `children` (the protected content).


---

## Content & Static Pages

**Name:** `content-frontend`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/pages/HomePage.tsx` — PAGE layer — orchestrates the display of various content sections by consuming data from `useContent`, `useMemberships`, and `useSchedule` hooks.
- `frontend/src/components/home/HeroSection.tsx` — COMPONENT layer — displays a full-bleed hero section with a motivational headline and calls-to-action.
- `frontend/src/components/home/ClassHighlightsSection.tsx` — COMPONENT layer — displays a grid of featured classes, consuming `GymClassDto[]` as props.
- `frontend/src/components/home/MembershipTiersSection.tsx` — COMPONENT layer — presents membership options by fetching data using `useMemberships().getAllActiveMembershipPlans()`.
- `frontend/src/components/home/TestimonialsSection.tsx` — COMPONENT layer — showcases customer testimonials by fetching data using `useContent().getAllTestimonials()`.
- `frontend/src/components/home/TrialFormSection.tsx` — COMPONENT layer — provides a lead capture form for the free trial offer, submitting data via `useContent().submitTrialLead()`.
- `frontend/src/components/home/SocialFeedSection.tsx` — COMPONENT layer — displays an embedded or curated social media feed.
- `frontend/src/pages/ContactPage.tsx` — PAGE layer — displays business contact information, including address, phone, hours, and a map.
- `frontend/src/services/contentService.ts` — SERVICE layer — provides functions for fetching trainers, testimonials, and submitting trial leads by calling the `content-backend` API.
- `frontend/src/hooks/useContent.ts` — HOOK layer — provides React Query hooks for fetching and managing content data like trainers and testimonials, and for submitting trial leads.
- `frontend/src/types/content.ts` — Generated from the backend API contract — defines TypeScript types for content entities like TrainerDto, TestimonialDto, and TrialLeadDto.
- `frontend/src/pages/TrainersPage.tsx` — PAGE layer — displays a grid of all trainers by fetching data using `useContent().getAllTrainers()` and rendering `TrainerGrid`.
- `frontend/src/pages/TrainerDetailPage.tsx` — PAGE layer — shows the detailed profile of a single trainer by fetching data using `useContent().getTrainerById(id)`.
- `frontend/src/components/trainers/TrainerGrid.tsx` — COMPONENT layer — lays out trainer profiles in a responsive grid, consuming `TrainerDto[]` as props.
- `frontend/src/components/trainers/TrainerCard.tsx` — COMPONENT layer — displays a summary of a trainer's profile, consuming `TrainerDto` as props.

**Feature Instruction:**

## Design Tokens
- Navbar: bg-[#1A1A1A] text-[#F5F5F5]
- Primary CTA: bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200
- Secondary CTA: border border-[#DFFF00] text-[#DFFF00] hover:bg-[#DFFF00] hover:text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200
- Brand text accent: text-[#DFFF00]
- Section bg: bg-white (odd sections) / bg-gray-50 (even sections)
- Card: bg-white rounded-xl shadow-md border border-gray-100 p-6
- Section container: <section className="py-16 px-4"><div className="max-w-7xl mx-auto">
- Hero h1: text-4xl md:text-6xl font-bold text-white
- Body: text-gray-700 leading-relaxed

This feature provides all the static content pages and components for the MultiFit Aundh gym website, including the homepage, contact page, and trainer profiles. It interacts with the `content-backend` feature to fetch dynamic data like trainers and testimonials, and to submit trial lead forms. It also fetches membership plans from the `membership-backend` to display on the homepage.

### `HomePage.tsx`
This page serves as the main landing page for the gym. It is composed of several sections:
1.  **HeroSection**: A full-width, high-energy section with a background image/video, a bold headline "Unleash Your Potential at MultiFit Aundh", a subheadline "The antidote to boring gyms. Join our vibrant community and transform your fitness journey.", and two call-to-action buttons: "Start Your Free Trial" (primary CTA, links to the trial form section) and "Explore Memberships" (secondary CTA, links to `/memberships`).
2.  **ClassHighlightsSection**: Displays a grid of featured gym classes. This section should fetch a list of `GymClassDto` objects from the `scheduling-backend` using `useSchedule().getAllGymClasses()` and display a selection of them. Each class card should include the class name, a short description, and a trainer name. It should have a heading "Our Signature Classes" and a subheadline "Find your passion, push your limits."
3.  **MembershipTiersSection**: Presents the available membership plans. This section will fetch `MembershipPlanDto` objects from the `membership-backend` using `useMemberships().getAllActiveMembershipPlans()`. It should display each plan in a card format, showing the `name`, `price` (formatted in INR), and `description`. It should have a heading "Choose Your Path to Fitness" and a subheadline "Flexible plans designed for every goal."
4.  **TestimonialsSection**: Showcases customer testimonials. This section fetches `TestimonialDto` objects from `content-backend` via `useContent().getAllTestimonials()`. It should display the `authorName`, `rating` (e.g., as stars), and `content` of each testimonial. It should have a heading "Hear From Our Community" and a subheadline "Real stories, real results."
5.  **TrialFormSection**: A lead capture form for the "Get a 3-Day Free Trial" offer. This form collects `name`, `email`, and `phoneNumber`. Upon submission, it calls `useContent().submitTrialLead(formData)`. It should have a heading "Ready to Transform?" and a subheadline "Claim your FREE 3-day trial today!"
6.  **SocialFeedSection**: An embedded or curated feed from Instagram to display gym activity and community engagement. This section will contain placeholder content for an Instagram feed.

All monetary values (membership prices) must be displayed in Indian Rupees (₹) using `toLocaleString('en-IN', { style: 'currency', currency: 'INR' })`.

### `HeroSection.tsx`
This component renders the hero section for the `HomePage.tsx`. It will feature a full-bleed background image (`https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80`) with a `bg-black bg-opacity-50` overlay. It displays a motivational `h1` headline "Unleash Your Potential at MultiFit Aundh" and a subheadline "The antidote to boring gyms. Join our vibrant community and transform your fitness journey.". It includes two buttons: a primary CTA "Start Your Free Trial" (linking to `#trial-form`) and a secondary CTA "Explore Memberships" (linking to `/memberships`).

### `ClassHighlightsSection.tsx`
This component displays a grid of featured classes. It receives `gymClasses: GymClassDto[]` as props. It should render a responsive grid of `GymClassCard` components (to be created in the `scheduling-frontend` feature), each displaying the class `name`, `description`, and `trainerName`. The section includes a heading "Our Signature Classes" and a subheadline "Find your passion, push your limits."

### `MembershipTiersSection.tsx`
This component displays membership plans. It fetches data using `useMemberships().getAllActiveMembershipPlans()`. It renders a grid of cards, each representing a `MembershipPlanDto`. Each card will display the `name`, `description`, and `price` (formatted in INR) of the membership plan. It should include a call-to-action button "View Details" or "Join Now" that navigates to `/memberships`. The section includes a heading "Choose Your Path to Fitness" and a subheadline "Flexible plans designed for every goal."

### `TestimonialsSection.tsx`
This component displays customer testimonials. It fetches data using `useContent().getAllTestimonials()`. It renders a carousel or grid of testimonial cards. Each card displays the `authorName`, `rating` (e.g., 5 stars), and `content` from the `TestimonialDto`. The section includes a heading "Hear From Our Community" and a subheadline "Real stories, real results."

### `TrialFormSection.tsx`
This component renders the 3-day free trial lead capture form. It uses `useContent().submitTrialLead()` to handle form submissions. The form should include input fields for `name`, `email`, and `phoneNumber`. Upon successful submission, it should display a success message using a toast notification (e.g., from `sonner`). The section includes a heading "Ready to Transform?" and a subheadline "Claim your FREE 3-day trial today!"

### `SocialFeedSection.tsx`
This component displays a placeholder for an embedded Instagram feed. It will contain static content or a simple message indicating where the social feed would be.

### `ContactPage.tsx`
This page provides contact information for MultiFit Aundh. It should display the business `address` ("Multifit Aundh , D.P. Road Medipoint Hospital Road, opp. to Indian Bank, Aundh, Pune, Maharashtra 411067"), `phone` number ("075070 08009"), and `opening hours` (placeholder text for now). It should also embed a Google Map using the provided `coordinates` (18.562876, 73.799999 - assuming a valid longitude for Pune). The page content should be wrapped in the `Layout` component from `shared-frontend`.

### `contentService.ts`
This service provides functions to interact with the `content-backend` API. It includes `getAllTrainers()`, `getTrainerById(id: UUID)`, `getAllTestimonials()`, and `submitTrialLead(data: TrialLeadDto)`. It uses `axios` from `frontend/src/api/client.ts` for HTTP requests.

### `useContent.ts`
This React Query hook provides an interface for components to fetch and mutate content-related data. It exposes `useQuery` for `getAllTrainers`, `getTrainerById`, and `getAllTestimonials`, and `useMutation` for `submitTrialLead`. It uses the `contentService.ts` for data fetching.

### `content.ts`
This file defines TypeScript interfaces for the data structures used in the content feature, including `TrainerDto`, `TestimonialDto`, and `TrialLeadDto`. These types should precisely match the DTOs exposed by the `content-backend` feature.

### `TrainersPage.tsx`
This page displays a grid of all trainers. It fetches trainer data using `useContent().getAllTrainers()`. It renders a `TrainerGrid` component, passing the fetched `TrainerDto[]` as props. The page should have a heading "Meet Our Expert Trainers" and a subheadline "Dedicated to your fitness journey.". The page content should be wrapped in the `Layout` component from `shared-frontend`.

### `TrainerDetailPage.tsx`
This page displays the detailed profile of a single trainer. It retrieves the `trainerId` from the URL parameters and fetches the specific `TrainerDto` using `useContent().getTrainerById(trainerId)`. It displays the trainer's `name`, `specialization`, `bio`, and `imageUrl`. The page content should be wrapped in the `Layout` component from `shared-frontend`.

### `TrainerGrid.tsx`
This component renders a responsive grid of `TrainerCard` components. It accepts `trainers: TrainerDto[]` as props. Each `TrainerCard` displays a summary of a trainer's profile.

### `TrainerCard.tsx`
This component displays a summary of a single trainer's profile. It accepts `trainer: TrainerDto` as props. It should display the trainer's `name`, `specialization`, and `imageUrl`. Clicking on the card should navigate to the `TrainerDetailPage` for that trainer (`/trainers/{trainer.id}`).


---

## Membership Purchase Flow

**Name:** `membership-frontend`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/pages/MembershipsPage.tsx` — PAGE layer — displays a grid of available membership plans, fetching data via `useMemberships().getAllMembershipPlans()` and rendering each plan with `MembershipPlanCard`.
- `frontend/src/components/membership/MembershipPlanCard.tsx` — COMPONENT layer — displays the details of a single membership plan and provides a 'Join Now' button that navigates to the checkout page.
- `frontend/src/pages/CheckoutPage.tsx` — PAGE layer — guides the user through the payment process for a selected membership plan, retrieving the plan details and rendering the `CheckoutForm` component.
- `frontend/src/components/membership/CheckoutForm.tsx` — COMPONENT layer — handles the payment details form for a membership purchase and integrates with the `useMemberships().purchaseMembership()` hook to process the transaction.
- `frontend/src/pages/PurchaseSuccessPage.tsx` — PAGE layer — displays a confirmation message to the user after a successful membership purchase.
- `frontend/src/services/membershipService.ts` — SERVICE layer — provides asynchronous functions for interacting with the membership backend API, including `getAllActiveMembershipPlans(): Promise<MembershipPlanDto[]>` and `purchaseMembership(request: PurchaseMembershipRequest): Promise<MemberSubscription>`.
- `frontend/src/hooks/useMemberships.ts` — HOOK layer — provides React Query hooks for fetching membership plan data via `useAllMembershipPlans()` and handling membership purchases via `usePurchaseMembership()`.
- `frontend/src/types/membership.ts` — TypeScript types for membership-related data structures.

**Feature Instruction:**

## Design Tokens
- Navbar: bg-[#1A1A1A] text-[#F5F5F5]
- Primary CTA: bg-[#DFFF00] hover:bg-opacity-90 text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200
- Secondary CTA: bg-[#333333] hover:bg-[#1A1A1A] text-[#F5F5F5] font-semibold rounded-full px-6 py-2 transition-all duration-200
- Brand text accent: text-[#DFFF00]
- Section bg: bg-white (odd sections) / bg-gray-50 (even sections)
- Card: bg-white rounded-xl shadow-md border border-gray-100 p-6
- Section container: <section className="py-16 px-4"><div className="max-w-7xl mx-auto">
- Hero h1: text-4xl md:text-6xl font-bold text-white
- Body: text-gray-700 leading-relaxed

This feature provides the user interface and logic for MultiFit Aundh members to browse and purchase membership plans. It consists of several pages, components, a service, a hook, and type definitions.

The `MembershipsPage.tsx` displays all available membership plans in an energetic grid layout. Each plan is rendered using a `MembershipPlanCard.tsx` component. The `MembershipsPage` fetches the active membership plans using the `useMemberships` hook, which in turn calls `membershipService.getAllActiveMembershipPlans()`.

When a user clicks the "Join Now" or "Select Plan" button on a `MembershipPlanCard`, they are navigated to the `CheckoutPage.tsx`. The `CheckoutPage` uses the `CheckoutForm.tsx` component to handle the payment process. The `CheckoutForm` will display the selected membership plan's details and integrate with a payment gateway (simulated for this project) to process the purchase. Upon successful payment, the `CheckoutForm` will call `useMemberships().purchaseMembership()` which internally calls `membershipService.purchaseMembership()`. This service function will then call the `membership-backend`'s `/api/v1/memberships/purchase` endpoint (which is not in the current API contract, but is implied by the feature description). After a successful purchase, the user is redirected to the `PurchaseSuccessPage.tsx`.

The `membershipService.ts` file acts as a client for the `membership-backend` API. It provides functions to fetch membership plans and to initiate a membership purchase. The `useMemberships.ts` hook leverages `react-query` to manage the state of membership plans and handle the purchase flow, providing data and mutation functions to the UI components.

The `membership.ts` file defines the TypeScript interfaces for `MembershipPlanDto` and `PurchaseMembershipRequest` which are used throughout the frontend feature to ensure type safety and consistency with the backend API contracts.

### Data Flow:
1. `MembershipsPage.tsx` calls `useMemberships().getAllMembershipPlans()`.
2. `useMemberships.ts` calls `membershipService.getAllActiveMembershipPlans()`.
3. `membershipService.ts` makes a GET request to `/api/v1/memberships/plans` on the `membership-backend`.
4. `MembershipsPage.tsx` renders `MembershipPlanCard.tsx` for each `MembershipPlanDto`.
5. `MembershipPlanCard.tsx` displays `MembershipPlanDto` details and a "Join Now" button.
6. Clicking "Join Now" navigates to `/checkout` with the selected `membershipPlan.id`.
7. `CheckoutPage.tsx` retrieves the `membershipPlan.id` from the URL and fetches the specific plan using `useMemberships().getMembershipPlanById(id)`.
8. `CheckoutPage.tsx` renders `CheckoutForm.tsx`.
9. `CheckoutForm.tsx` displays the plan details and a payment form.
10. Upon form submission, `CheckoutForm.tsx` calls `useMemberships().purchaseMembership(purchaseRequest)`.
11. `useMemberships.ts` calls `membershipService.purchaseMembership(purchaseRequest)`.
12. `membershipService.ts` makes a POST request to `/api/v1/memberships/purchase` on the `membership-backend` with `PurchaseMembershipRequest`.
13. On successful purchase, `CheckoutForm.tsx` navigates to `/purchase-success`.
14. `PurchaseSuccessPage.tsx` displays a confirmation message.

### Error Handling:
- API calls made by `membershipService.ts` should handle network errors and API error responses. For example, if `getAllActiveMembershipPlans` fails, `useMemberships` should return an error state that `MembershipsPage` can display.
- The `CheckoutForm` should provide user feedback for invalid input or payment processing errors.

### Indian Business Context:
- All monetary values (e.g., `price` on `MembershipPlanDto`) must be displayed in Indian Rupees (₹) using the `en-IN` locale (e.g., `amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })`).


---

## Class Booking Flow

**Name:** `scheduling-frontend`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/pages/SchedulePage.tsx` — PAGE layer — displays the weekly class schedule and orchestrates the booking flow by using `useSchedule` hook and rendering `ScheduleCalendar` and `BookingConfirmationDialog` components.
- `frontend/src/components/schedule/ScheduleCalendar.tsx` — COMPONENT layer — renders an interactive calendar view of the class schedule based on provided data and user interactions.
- `frontend/src/components/schedule/BookingConfirmationDialog.tsx` — COMPONENT layer — presents a dialog for users to confirm their class booking selection, interacting with the `useSchedule` hook.
- `frontend/src/services/schedulingService.ts` — SERVICE layer — provides asynchronous functions for interacting with the scheduling backend API, specifically for fetching schedules and booking classes.
- `frontend/src/hooks/useSchedule.ts` — HOOK layer — provides React Query hooks for fetching weekly class schedules and handling class bookings, abstracting API calls and managing loading/error states.
- `frontend/src/types/schedule.ts` — Generated from the backend API contract — defines TypeScript interfaces for schedule and booking related data transfer objects.

**Feature Instruction:**

## Design Tokens
- Navbar: bg-[#1A1A1A] text-[#F5F5F5]
- Primary CTA: bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200
- Brand text accent: text-[#DFFF00]
- Section bg: bg-[#F5F5F5] (odd sections) / bg-gray-100 (even sections)
- Card: bg-white rounded-xl shadow-md border border-gray-100 p-6
- Section container: <section className="py-16 px-4"><div className="max-w-7xl mx-auto">
- Hero h1: text-4xl md:text-6xl font-bold text-white
- Body: text-gray-700 leading-relaxed

This feature implements the class booking flow for MultiFit Aundh, allowing users to view the weekly schedule and book classes. It consists of a main schedule page, a calendar component, a booking confirmation dialog, a service for API interactions, a React Query hook for data management, and TypeScript types for data structures.

### `SchedulePage.tsx`
This page serves as the entry point for users to view and interact with the class schedule. It uses the `Layout` component from `shared-frontend` for consistent navigation and branding. The page will display a weekly calendar view powered by `ScheduleCalendar.tsx` and manage the state for booking classes using the `useSchedule` hook. When a user selects a class, a `BookingConfirmationDialog.tsx` will appear to finalize the booking. All monetary values, if any, will be displayed in Indian Rupees (₹) using the `en-IN` locale.

### `ScheduleCalendar.tsx`
This component renders an interactive calendar displaying the weekly class schedule. It receives `weeklySchedule` data, `currentDate` for navigation, `onDateChange` to update the displayed week, and `onClassSelect` to trigger the booking flow for a specific class. The calendar will visually represent classes, their times, names, and trainer names. It will use the `ClassScheduleDto` and `GymClassDto` types from `frontend/src/types/schedule.ts` to render class details.

### `BookingConfirmationDialog.tsx`
This dialog component is responsible for confirming a user's intent to book a class. It receives `isOpen`, `onClose`, and `classSchedule` as props. When opened, it displays details of the selected class (name, date, time, trainer). It provides a 'Confirm Booking' button that, when clicked, calls the `bookClass` mutation from `useSchedule.ts`. It also handles success and error states for the booking, providing user feedback using a toast notification (e.g., from `sonner`).

### `schedulingService.ts`
This service acts as an intermediary between the frontend components and the `scheduling-backend` API. It exports asynchronous functions to fetch the weekly class schedule and to book a class. It uses the `apiClient` from `frontend/src/api/client.ts` to make HTTP requests and handles potential errors. All API calls require authentication.

### `useSchedule.ts`
This React Query hook provides an abstraction for fetching and mutating schedule and booking data. It exposes `useWeeklySchedule` to fetch the schedule for a given week and `useBookClass` for booking a class. `useWeeklySchedule` uses `schedulingService.getWeeklySchedule` and `useBookClass` uses `schedulingService.bookClass`. It manages loading, error, and success states, making it easy for components like `SchedulePage.tsx` and `BookingConfirmationDialog.tsx` to interact with the backend.

### `schedule.ts`
This file defines the TypeScript interfaces for the data structures used throughout the scheduling feature. These types mirror the DTOs exposed by the `scheduling-backend` to ensure type safety and consistency across the frontend application. It includes `GymClassDto`, `ClassScheduleDto`, and `BookingDto`.

**Flow:**
1. `SchedulePage.tsx` renders, fetching the weekly schedule using `useSchedule.useWeeklySchedule`.
2. The fetched schedule data is passed to `ScheduleCalendar.tsx`.
3. `ScheduleCalendar.tsx` displays the classes. When a user clicks on a class, `onClassSelect` is called, passing the `ClassScheduleDto` of the selected class.
4. `SchedulePage.tsx` then opens `BookingConfirmationDialog.tsx`, passing the selected `ClassScheduleDto`.
5. Inside `BookingConfirmationDialog.tsx`, when the user confirms, `useSchedule.useBookClass().mutateAsync()` is called with the `classScheduleId`.
6. `schedulingService.bookClass` makes the API call to `POST /api/v1/bookings/{classScheduleId}`.
7. Upon successful booking, a success toast is shown, and the schedule might be refetched to reflect the updated `currentBookings` count for the class.
8. If an error occurs (e.g., `BookingConflictException` from the backend), an error toast is displayed.

---

## Admin Portal

**Name:** `admin-portal`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/pages/AdminDashboardPage.tsx` — Admin page — the main landing page for the admin panel, providing navigation to other admin sections.
- `frontend/src/pages/AdminMembershipsPage.tsx` — Admin page — manages membership plans using `useMemberships` hooks and renders `MembershipPlanTable` and `MembershipPlanForm`.
- `frontend/src/components/admin/membership/MembershipPlanTable.tsx` — COMPONENT layer — displays a data table for existing membership plans with edit and delete actions.
- `frontend/src/components/admin/membership/MembershipPlanForm.tsx` — COMPONENT layer — provides a form for creating and editing `MembershipPlanDto` objects.
- `frontend/src/pages/AdminSchedulingPage.tsx` — Admin page — manages gym classes and schedules using `useSchedule` hooks and renders `ClassScheduleTable` and `ClassScheduleForm`.
- `frontend/src/components/admin/schedule/ClassScheduleTable.tsx` — COMPONENT layer — displays a data table for existing class schedules with edit and delete actions.
- `frontend/src/components/admin/schedule/ClassScheduleForm.tsx` — COMPONENT layer — provides a form for creating and editing `ClassScheduleDto` objects.
- `frontend/src/pages/AdminTrainersPage.tsx` — Admin page — manages trainer profiles using `useContent` hooks and renders `TrainerTable` and `TrainerForm`.
- `frontend/src/components/admin/trainer/TrainerTable.tsx` — COMPONENT layer — displays a data table for existing trainer profiles with edit and delete actions.
- `frontend/src/components/admin/trainer/TrainerForm.tsx` — COMPONENT layer — provides a form for creating and editing `TrainerDto` objects.
- `frontend/src/pages/AdminTestimonialsPage.tsx` — Admin page — manages customer testimonials using `useContent` hooks and renders `TestimonialTable` and `TestimonialForm`.
- `frontend/src/components/admin/testimonial/TestimonialTable.tsx` — COMPONENT layer — displays a data table for existing testimonials with edit and delete actions.
- `frontend/src/components/admin/testimonial/TestimonialForm.tsx` — COMPONENT layer — provides a form for creating and editing `TestimonialDto` objects.
- `frontend/src/components/admin/common/DeleteConfirmationDialog.tsx` — COMPONENT layer — a reusable dialog component to confirm deletion of any admin-managed entity.

**Feature Instruction:**

## Design Tokens
- Navbar: bg-[#1A1A1A] text-[#F5F5F5]
- Primary CTA: bg-[#DFFF00] hover:bg-[#c7e600] text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200
- Brand text accent: text-[#DFFF00]
- Section bg: bg-white (odd sections) / bg-gray-50 (even sections)
- Card: bg-white rounded-xl shadow-md border border-gray-100 p-6
- Section container: <section className="py-16 px-4"><div className="max-w-7xl mx-auto">
- Hero h1: text-4xl md:text-6xl font-bold text-white
- Body: text-gray-700 leading-relaxed

The Admin Portal feature provides a comprehensive interface for managing various aspects of MultiFit Aundh, including membership plans, class schedules, trainer profiles, and customer testimonials. All pages within this feature are protected by the `AdminLayout` from `shared-frontend` and require authentication with an 'admin' role, enforced by `ProtectedRoute` from `auth-frontend`. The portal leverages several custom React hooks (`useMemberships`, `useSchedule`, `useContent`) to interact with the backend APIs for data fetching, creation, updating, and deletion. Each administrative section (Memberships, Scheduling, Trainers, Testimonials) follows a consistent pattern: a main page (`AdminMembershipsPage.tsx`, `AdminSchedulingPage.tsx`, etc.) that renders a data table component (`MembershipPlanTable.tsx`, `ClassScheduleTable.tsx`, etc.) and a form component (`MembershipPlanForm.tsx`, `ClassScheduleForm.tsx`, etc.) for adding or editing entities. A common `DeleteConfirmationDialog.tsx` is used across all sections for confirming deletion operations.

### AdminDashboardPage.tsx
This page serves as the entry point for the admin portal, providing an overview of key metrics and navigation links to other admin sections. It will display a welcoming message and cards linking to the Membership Plans, Class Schedules, Trainers, and Testimonials management pages.

### AdminMembershipsPage.tsx
This page is responsible for managing membership plans. It will use the `useAllMembershipPlans`, `useCreateMembership`, `useUpdateMembership`, and `useDeleteMembership` hooks from `useMemberships.ts` to fetch, create, update, and delete membership plans. The page will render `MembershipPlanTable` to display existing plans and `MembershipPlanForm` within a modal or drawer for creating and editing plans. Deletion will be handled via `DeleteConfirmationDialog`.

### MembershipPlanTable.tsx
This component displays a sortable and filterable table of membership plans. Each row will include actions for editing and deleting a plan. It will receive `MembershipPlanDto[]` as props and emit events for edit and delete actions.

### MembershipPlanForm.tsx
This component provides a form for creating or editing a `MembershipPlanDto`. It will use `react-hook-form` and `zod` for validation. The form will include fields for `name`, `description`, `price`, `durationInMonths`, and `isActive`. Upon submission, it will call the appropriate mutation hook from `useMemberships.ts`.

### AdminSchedulingPage.tsx
This page manages gym classes and schedules. It will utilize `useAllGymClasses`, `useCreateGymClass`, `useUpdateGymClass`, `useDeleteGymClass`, `useAllClassSchedules`, `useCreateClassSchedule`, `useUpdateClassSchedule`, and `useDeleteClassSchedule` hooks from `useSchedule.ts`. It will render `ClassScheduleTable` for schedules and `ClassScheduleForm` for creating/editing schedules. `DeleteConfirmationDialog` will be used for deletion.

### ClassScheduleTable.tsx
This component displays a table of class schedules. Each row will include actions for editing and deleting a schedule. It will receive `ClassScheduleDto[]` as props and emit events for edit and delete actions.

### ClassScheduleForm.tsx
This component provides a form for creating or editing a `ClassScheduleDto`. It will include fields for `gymClassId`, `scheduleDate`, `startTime`, `endTime`, and `maxCapacity`. It will call the appropriate mutation hook from `useSchedule.ts` on submission.

### AdminTrainersPage.tsx
This page manages trainer profiles. It will use `useAllTrainers`, `useCreateTrainer`, `useUpdateTrainer`, and `useDeleteTrainer` hooks from `useContent.ts`. It will render `TrainerTable` to display trainers and `TrainerForm` for creating/editing trainers. `DeleteConfirmationDialog` will be used for deletion.

### TrainerTable.tsx
This component displays a table of trainer profiles. Each row will include actions for editing and deleting a trainer. It will receive `TrainerDto[]` as props and emit events for edit and delete actions.

### TrainerForm.tsx
This component provides a form for creating or editing a `TrainerDto`. It will include fields for `name`, `specialization`, `bio`, and `imageUrl`. It will call the appropriate mutation hook from `useContent.ts` on submission.

### AdminTestimonialsPage.tsx
This page manages customer testimonials. It will use `useAllTestimonials`, `useCreateTestimonial`, `useUpdateTestimonial`, and `useDeleteTestimonial` hooks from `useContent.ts`. It will render `TestimonialTable` to display testimonials and `TestimonialForm` for creating/editing testimonials. `DeleteConfirmationDialog` will be used for deletion.

### TestimonialTable.tsx
This component displays a table of testimonials. Each row will include actions for editing and deleting a testimonial. It will receive `TestimonialDto[]` as props and emit events for edit and delete actions.

### TestimonialForm.tsx
This component provides a form for creating or editing a `TestimonialDto`. It will include fields for `authorName`, `rating`, `content`, and `displayDate`. It will call the appropriate mutation hook from `useContent.ts` on submission.

### DeleteConfirmationDialog.tsx
This is a reusable dialog component that takes a title, message, and a callback function for confirmation. It will be used by all admin pages to confirm deletion operations before proceeding.

---

## Infrastructure

**Name:** `infrastructure`  
**Type:** INFRA  
**Change required:** true

**Feature Instruction:**

_Not enriched (INFRA or skipped)._

---

