# Feature Enrichment — Attempt 4

Generated: 2026-07-07

Each section is one LLM call (~5–8K tokens). The instruction tells the generator how all files in the feature interact and what contracts they must honour.

---

## Shared Backend Infrastructure

**Name:** `shared-backend`  
**Type:** SHARED  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/multifitaundh/model/User.java` — JPA Entity representing a user account, implementing `UserDetails` for Spring Security integration.
- `backend/src/main/java/com/multifitaundh/model/Role.java` — Enum defining the distinct user roles within the application.
- `backend/src/main/java/com/multifitaundh/repository/UserRepository.java` — Spring Data JPA repository for `User` entities, providing custom query methods like `findByEmail(String email): Optional<User>`.
- `backend/src/main/java/com/multifitaundh/service/UserService.java` — Service layer for user-related business logic, implementing `UserDetailsService` to load users for Spring Security, and providing `saveUser(User user): User`.
- `backend/src/main/java/com/multifitaundh/controller/AuthController.java` — REST Controller handling user registration and authentication requests, exposing `/api/v1/auth/register` and `/api/v1/auth/login`.
- `backend/src/main/java/com/multifitaundh/dto/AuthRequest.java` — Data Transfer Object for capturing user login and registration credentials.
- `backend/src/main/java/com/multifitaundh/dto/AuthResponse.java` — Data Transfer Object for sending the JWT back to the client upon successful authentication.
- `backend/src/main/java/com/multifitaundh/util/JwtUtil.java` — Utility class for generating, validating, and parsing JSON Web Tokens (JWTs), providing `generateToken(UserDetails userDetails): String`, `validateToken(String token, UserDetails userDetails): boolean`, and `extractEmail(String token): String`.
- `backend/src/main/java/com/multifitaundh/security/JwtAuthFilter.java` — Servlet filter that intercepts requests to validate the JWT from the Authorization header and set the Spring Security context.
- `backend/src/main/java/com/multifitaundh/config/SecurityConfig.java` — Configures Spring Security, defining authorization rules, password encoder, and the security filter chain.
- `backend/src/main/java/com/multifitaundh/controller/SpaController.java` — Spring MVC Controller responsible for forwarding all non-API, non-static resource requests to `index.html` for client-side routing.
- `backend/src/main/java/com/multifitaundh/exception/GlobalExceptionHandler.java` — Centralized exception handler using `@RestControllerAdvice` to convert various exceptions into consistent `ErrorResponse` JSON objects.
- `backend/src/main/java/com/multifitaundh/dto/ErrorResponse.java` — Data Transfer Object for a standardized JSON structure used to return error details from the API.
- `backend/src/main/java/com/multifitaundh/exception/ResourceNotFoundException.java` — Custom runtime exception thrown when a requested resource is not found in the database, handled by `GlobalExceptionHandler`.
- `backend/src/main/java/com/multifitaundh/config/AdminInitializer.java` — Component that implements `CommandLineRunner` to create a default admin user on application startup if one does not already exist.
- `backend/src/main/java/com/multifitaundh/config/DataSeeder.java` — Component that implements `CommandLineRunner` to populate the database with initial sample data for development and demonstration purposes.

**Feature Instruction:**

The `shared-backend` feature establishes the foundational backend infrastructure for the MultiFit Aundh application, encompassing user authentication, authorization, global exception handling, and single-page application (SPA) routing. It defines the core `User` and `Role` models, their persistence layer via `UserRepository`, and the business logic for user management in `UserService`. Authentication is implemented using JSON Web Tokens (JWTs), with `JwtUtil` handling token generation and validation, and `JwtAuthFilter` integrating JWT processing into the Spring Security filter chain. The `AuthController` exposes public API endpoints for user registration and login, issuing JWTs upon successful authentication.

Spring Security configuration in `SecurityConfig` defines authorization rules, allowing public access to authentication and specific public content endpoints, restricting admin endpoints to `ROLE_ADMIN`, and requiring authentication for all other API calls. A `SpaController` ensures that all non-API and non-static resource requests are forwarded to the frontend's `index.html` for client-side routing. Global error handling is centralized in `GlobalExceptionHandler`, which converts various exceptions into standardized `ErrorResponse` DTOs, including a custom `ResourceNotFoundException`.

Initial application setup is managed by `AdminInitializer`, which creates a default admin user if one does not exist, and `DataSeeder`, which populates the database with essential sample data for development and demonstration purposes, interacting with repositories from other features like `membership-payment-be`, `class-scheduling-be`, `content-management-be`, and `lead-management-be` to create initial entities.

**Inter-file Wiring and Cross-Feature Contracts:**

*   `AuthController` injects `AuthenticationManager`, `UserService`, and `JwtUtil` to handle user login and registration. It calls `userService.saveUser()` for registration and `authenticationManager.authenticate()` for login, then `jwtUtil.generateToken()` to create the JWT.
*   `JwtAuthFilter` injects `JwtUtil` and `UserService`. It uses `jwtUtil.extractEmail()` and `jwtUtil.validateToken()` to process JWTs, and `userService.loadUserByUsername()` to load `UserDetails` for setting the security context.
*   `SecurityConfig` injects `JwtAuthFilter` and `UserService`. It configures the `SecurityFilterChain` to apply `jwtAuthFilter` before `UsernamePasswordAuthenticationFilter`. It defines authorization rules:
    *   `.requestMatchers("/api/v1/auth/**").permitAll()`
    *   `.requestMatchers("/api/v1/memberships/**", "/api/v1/classes/**", "/api/v1/content/**", "/api/v1/leads/**").permitAll()`
    *   `.requestMatchers("/api/v1/admin/**").hasRole("ADMIN")`
    *   `.requestMatchers("/api/**").authenticated()`
    *   `.anyRequest().permitAll()`
*   `AdminInitializer` injects `UserService` and `PasswordEncoder`. It calls `userService.saveUser()` to create the default admin user.
*   `DataSeeder` injects `UserService` and `PasswordEncoder` from this feature, and will inject repositories from other features (e.g., `MembershipPlanRepository`, `GymClassRepository`, `TrainerRepository`, `TestimonialRepository`, `TrialLeadRepository`) to populate initial data. It calls `userService.saveUser()` to create a default non-admin user.
*   `GlobalExceptionHandler` catches exceptions thrown by controllers and services across the application and formats them into `ErrorResponse` objects.

**Error Handling:**
*   `AuthController.authenticateUser()` throws `BadCredentialsException` for invalid login attempts, which is caught by `GlobalExceptionHandler` and returns `401 UNAUTHORIZED` with an `ErrorResponse`.
*   `UserService.loadUserByUsername()` throws `UsernameNotFoundException` if the user does not exist, which is handled by Spring Security.
*   `GlobalExceptionHandler` handles `ResourceNotFoundException` (returning `404 NOT FOUND`), `MethodArgumentNotValidException` (returning `400 BAD REQUEST`), and generic `Exception` (returning `500 INTERNAL SERVER ERROR`).

---

## Backend: Membership & Payment

**Name:** `membership-payment-be`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/multifitaundh/model/MembershipPlan.java` — MODEL layer — Represents a purchasable gym membership plan.
- `backend/src/main/java/com/multifitaundh/repository/MembershipPlanRepository.java` — REPOSITORY layer — Provides CRUD operations for MembershipPlan entities and custom query methods like findByIsActiveTrue().
- `backend/src/main/java/com/multifitaundh/model/UserMembership.java` — MODEL layer — Links a User to a MembershipPlan, representing an active or past subscription.
- `backend/src/main/java/com/multifitaundh/repository/UserMembershipRepository.java` — REPOSITORY layer — Provides CRUD operations for UserMembership entities and custom query methods like findByUser_IdAndStatus(UUID, MembershipStatus).
- `backend/src/main/java/com/multifitaundh/service/MembershipService.java` — SERVICE layer — Implements business logic for memberships, including getAllActiveMembershipPlans(): List<MembershipPlanDto>, getMembershipPlanById(UUID): MembershipPlanDto, createMembershipPlan(CreateMembershipPlanRequest): MembershipPlanDto, updateMembershipPlan(UUID, UpdateMembershipPlanRequest): MembershipPlanDto, deleteMembershipPlan(UUID): void, purchaseMembership(UUID, UUID): UserMembershipDto, and getUserActiveMembership(UUID): Optional<UserMembershipDto>.
- `backend/src/main/java/com/multifitaundh/controller/MembershipController.java` — CONTROLLER layer — Exposes public endpoints for fetching membership plans and user-specific endpoints for managing them.
- `backend/src/main/java/com/multifitaundh/controller/admin/AdminMembershipController.java` — CONTROLLER layer — Provides admin-only endpoints for CRUD operations on MembershipPlan entities.
- `backend/src/main/java/com/multifitaundh/dto/MembershipPlanDto.java` — DTO layer — Data Transfer Object for membership plan data exposed to the client.

**Feature Instruction:**

This feature, 'Membership & Payment Backend', is responsible for managing gym membership plans and user subscriptions. It provides public APIs for users to view available plans and manage their active membership, and admin-only APIs for full CRUD operations on membership plans.

## 1. Entities

### MembershipPlan.java
Represents a purchasable gym membership plan.
- `id`: UUID (Primary Key, generated)
- `name`: String (e.g., "Monthly", "Annual")
- `description`: String (Detailed description of the plan)
- `price`: BigDecimal (Cost of the plan)
- `durationInMonths`: Integer (Duration of the plan in months)
- `isActive`: Boolean (Whether the plan is currently available for purchase)

### UserMembership.java
Links a User to a MembershipPlan, representing an active or past subscription.
- `id`: UUID (Primary Key, generated)
- `user`: ManyToOne relationship with `User` entity (from `shared-backend` feature). Represents the user who owns this membership.
- `membershipPlan`: ManyToOne relationship with `MembershipPlan` entity. Represents the plan the user subscribed to.
- `startDate`: LocalDate (The date the membership became active)
- `endDate`: LocalDate (The date the membership expires)
- `status`: Enum `MembershipStatus` (ACTIVE, EXPIRED, CANCELLED)

## 2. Data Transfer Objects (DTOs)

### MembershipPlanDto.java
Used for exposing membership plan data to clients.
- `id`: UUID
- `name`: String
- `description`: String
- `price`: BigDecimal
- `durationInMonths`: Integer
- `isActive`: Boolean

### CreateMembershipPlanRequest (Implicit DTO for AdminMembershipController)
Used for creating new membership plans via the admin API.
- `name`: String (@NotBlank)
- `description`: String (@NotBlank)
- `price`: BigDecimal (@NotNull, @DecimalMin("0.01"))
- `durationInMonths`: Integer (@NotNull, @Positive)
- `isActive`: Boolean (@NotNull)

### UpdateMembershipPlanRequest (Implicit DTO for AdminMembershipController)
Used for updating existing membership plans via the admin API.
- `name`: String (@NotBlank)
- `description`: String (@NotBlank)
- `price`: BigDecimal (@NotNull, @DecimalMin("0.01"))
- `durationInMonths`: Integer (@NotNull, @Positive)
- `isActive`: Boolean (@NotNull)

### UserMembershipDto (Implicit DTO for MembershipService and MembershipController)
Used for exposing user membership data to clients.
- `id`: UUID
- `userId`: UUID
- `membershipPlanId`: UUID
- `membershipPlanName`: String
- `startDate`: LocalDate
- `endDate`: LocalDate
- `status`: MembershipStatus

## 3. Repositories

### MembershipPlanRepository.java
Extends `JpaRepository<MembershipPlan, UUID>`.
- `findByIsActiveTrue()`: Returns `List<MembershipPlan>` containing all active membership plans.

### UserMembershipRepository.java
Extends `JpaRepository<UserMembership, UUID>`.
- `findByUser_IdAndStatus(UUID userId, MembershipStatus status)`: Returns `Optional<UserMembership>` for a given user ID and membership status.

## 4. Service Layer

### MembershipService.java
Handles business logic for memberships. It injects `MembershipPlanRepository`, `UserMembershipRepository`, and `UserRepository` (from `shared-backend`).

#### Public Methods:

1.  `getAllActiveMembershipPlans(): List<MembershipPlanDto>`
    - **Logic:**
        1.  Retrieve all `MembershipPlan` entities where `isActive` is true from `membershipPlanRepository.findByIsActiveTrue()`.
        2.  Map each `MembershipPlan` entity to a `MembershipPlanDto`.
        3.  Return the list of DTOs.

2.  `getMembershipPlanById(UUID id): MembershipPlanDto`
    - **Logic:**
        1.  Retrieve `MembershipPlan` entity by `id` from `membershipPlanRepository.findById(id)`.
        2.  If the plan is not found, throw `ResourceNotFoundException("Membership Plan not found with ID: " + id)`.
        3.  Map the `MembershipPlan` entity to a `MembershipPlanDto`.
        4.  Return the DTO.
    - **Error Cases:** `ResourceNotFoundException` (HTTP 404).

3.  `createMembershipPlan(CreateMembershipPlanRequest request): MembershipPlanDto`
    - **Logic:**
        1.  Create a new `MembershipPlan` entity.
        2.  Populate its fields from the `request` DTO, setting `id` to a new `UUID`.
        3.  Save the new `MembershipPlan` entity using `membershipPlanRepository.save()`.
        4.  Map the saved entity to a `MembershipPlanDto`.
        5.  Return the DTO.

4.  `updateMembershipPlan(UUID id, UpdateMembershipPlanRequest request): MembershipPlanDto`
    - **Logic:**
        1.  Retrieve `MembershipPlan` entity by `id` from `membershipPlanRepository.findById(id)`.
        2.  If the plan is not found, throw `ResourceNotFoundException("Membership Plan not found with ID: " + id)`.
        3.  Update the fields of the retrieved `MembershipPlan` entity using the `request` DTO.
        4.  Save the updated `MembershipPlan` entity using `membershipPlanRepository.save()`.
        5.  Map the updated entity to a `MembershipPlanDto`.
        6.  Return the DTO.
    - **Error Cases:** `ResourceNotFoundException` (HTTP 404).

5.  `deleteMembershipPlan(UUID id): void`
    - **Logic:**
        1.  Check if `MembershipPlan` entity exists by `id` using `membershipPlanRepository.existsById(id)`.
        2.  If not found, throw `ResourceNotFoundException("Membership Plan not found with ID: " + id)`.
        3.  Delete the `MembershipPlan` entity by `id` using `membershipPlanRepository.deleteById(id)`.
    - **Error Cases:** `ResourceNotFoundException` (HTTP 404).

6.  `purchaseMembership(UUID userId, UUID planId): UserMembershipDto`
    - **Logic:**
        1.  Retrieve `User` entity by `userId` from `userRepository.findById(userId)` (from `shared-backend`).
        2.  If user not found, throw `ResourceNotFoundException("User not found with ID: " + userId)`.
        3.  Retrieve `MembershipPlan` entity by `planId` from `membershipPlanRepository.findById(planId)`.
        4.  If plan not found, throw `ResourceNotFoundException("Membership Plan not found with ID: " + planId)`.
        5.  Check if the user already has an `ACTIVE` membership using `userMembershipRepository.findByUser_IdAndStatus(userId, MembershipStatus.ACTIVE)`.
        6.  If an active membership is found, throw `IllegalStateException("User already has an active membership.")`.
        7.  Create a new `UserMembership` entity.
        8.  Set `id` to a new `UUID`.
        9.  Set `user` and `membershipPlan` from the retrieved entities.
        10. Set `startDate` to `LocalDate.now()`.
        11. Calculate `endDate` by adding `membershipPlan.getDurationInMonths()` to `startDate`.
        12. Set `status` to `MembershipStatus.ACTIVE`.
        13. Save the new `UserMembership` entity using `userMembershipRepository.save()`.
        14. Map the saved entity to a `UserMembershipDto`.
        15. Return the DTO.
    - **Error Cases:** `ResourceNotFoundException` (HTTP 404), `IllegalStateException` (HTTP 400).

7.  `getUserActiveMembership(UUID userId): Optional<UserMembershipDto>`
    - **Logic:**
        1.  Retrieve `UserMembership` entity for the given `userId` and `MembershipStatus.ACTIVE` using `userMembershipRepository.findByUser_IdAndStatus(userId, MembershipStatus.ACTIVE)`.
        2.  If found, map the `UserMembership` entity to a `UserMembershipDto`.
        3.  Return `Optional` containing the DTO or `Optional.empty()`.

## 5. Controllers

### MembershipController.java
Exposes public and user-specific endpoints for membership plans. It injects `MembershipService`.

#### Endpoints:

1.  **GET /api/v1/memberships/plans**
    - **Description:** Retrieves a list of all active membership plans.
    - **Security:** `permitAll()`
    - **Calls:** `membershipService.getAllActiveMembershipPlans()`
    - **Response:** `List<MembershipPlanDto>` (HTTP 200 OK)

2.  **GET /api/v1/memberships/plans/{id}**
    - **Description:** Retrieves a specific membership plan by its ID.
    - **Security:** `permitAll()`
    - **Calls:** `membershipService.getMembershipPlanById(id)`
    - **Response:** `MembershipPlanDto` (HTTP 200 OK)
    - **Error Cases:** `ResourceNotFoundException` (HTTP 404)

3.  **POST /api/v1/memberships/purchase/{planId}**
    - **Description:** Allows an authenticated user to purchase a membership plan.
    - **Security:** `authenticated()`
    - **Calls:** `membershipService.purchaseMembership(userId, planId)` (userId extracted from `AuthenticationPrincipal UserDetails`)
    - **Response:** `UserMembershipDto` (HTTP 201 Created)
    - **Error Cases:** `ResourceNotFoundException` (HTTP 404), `IllegalStateException` (HTTP 400)

4.  **GET /api/v1/memberships/my-membership**
    - **Description:** Retrieves the authenticated user's active membership details.
    - **Security:** `authenticated()`
    - **Calls:** `membershipService.getUserActiveMembership(userId)` (userId extracted from `AuthenticationPrincipal UserDetails`)
    - **Response:** `Optional<UserMembershipDto>` (HTTP 200 OK, or 204 No Content if no active membership)

### AdminMembershipController.java
Provides admin-only endpoints for CRUD operations on MembershipPlan entities. It injects `MembershipService`.

#### Endpoints:

1.  **POST /api/v1/admin/memberships/plans**
    - **Description:** Creates a new membership plan.
    - **Security:** `hasRole('ADMIN')`
    - **Request Body:** `CreateMembershipPlanRequest`
    - **Calls:** `membershipService.createMembershipPlan(request)`
    - **Response:** `MembershipPlanDto` (HTTP 201 Created)
    - **Error Cases:** `MethodArgumentNotValidException` (HTTP 400)

2.  **PUT /api/v1/admin/memberships/plans/{id}**
    - **Description:** Updates an existing membership plan.
    - **Security:** `hasRole('ADMIN')`
    - **Request Body:** `UpdateMembershipPlanRequest`
    - **Calls:** `membershipService.updateMembershipPlan(id, request)`
    - **Response:** `MembershipPlanDto` (HTTP 200 OK)
    - **Error Cases:** `ResourceNotFoundException` (HTTP 404), `MethodArgumentNotValidException` (HTTP 400)

3.  **DELETE /api/v1/admin/memberships/plans/{id}**
    - **Description:** Deletes a membership plan by its ID.
    - **Security:** `hasRole('ADMIN')`
    - **Calls:** `membershipService.deleteMembershipPlan(id)`
    - **Response:** `void` (HTTP 204 No Content)
    - **Error Cases:** `ResourceNotFoundException` (HTTP 404)

4.  **GET /api/v1/admin/memberships/plans**
    - **Description:** Retrieves a list of all membership plans (active and inactive).
    - **Security:** `hasRole('ADMIN')`
    - **Calls:** `membershipPlanRepository.findAll()` (or a service method that wraps it)
    - **Response:** `List<MembershipPlanDto>` (HTTP 200 OK)

## 6. Cross-Feature Interactions

This feature interacts with the `shared-backend` feature primarily for `User` entity management:
- `MembershipService` injects `UserRepository` from `shared-backend` to retrieve `User` entities by ID when purchasing a membership.

## 7. Security Configuration

The `SecurityConfig` in the `shared-backend` feature must be updated to include authorization rules for this feature's endpoints:

```

java
.authorizeHttpRequests(auth -> auth
    .requestMatchers("/api/v1/auth/**").permitAll()
    .requestMatchers("/api/v1/memberships/plans/**").permitAll()
    .requestMatchers("/api/v1/admin/memberships/**").hasRole("ADMIN")
    .requestMatchers("/api/v1/memberships/**").authenticated()
    .requestMatchers("/api/**").authenticated()
    .anyRequest().permitAll()
)


```

---

## Backend: Class Scheduling & Booking

**Name:** `class-scheduling-be`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/multifitaundh/model/GymClass.java` — MODEL layer — defines the `GymClass` entity, representing a single scheduled fitness class with its attributes and relationships.
- `backend/src/main/java/com/multifitaundh/repository/GymClassRepository.java` — REPOSITORY layer — provides data access operations for `GymClass` entities, including custom queries for fetching classes by date or date range.
- `backend/src/main/java/com/multifitaundh/model/ClassBooking.java` — MODEL layer — defines the `ClassBooking` entity, representing a user's reservation for a specific gym class.
- `backend/src/main/java/com/multifitaundh/repository/ClassBookingRepository.java` — REPOSITORY layer — provides data access operations for `ClassBooking` entities, including custom queries for finding bookings by user or class.
- `backend/src/main/java/com/multifitaundh/service/ClassScheduleService.java` — SERVICE layer — implements business logic for fetching class schedules, managing user bookings, and performing admin CRUD operations on gym classes. It delegates persistence to `GymClassRepository` and `ClassBookingRepository`, and interacts with `UserRepository` and `MembershipService` from other features.
- `backend/src/main/java/com/multifitaundh/controller/ClassScheduleController.java` — CONTROLLER layer — exposes public REST API endpoints for users to view class schedules and manage their bookings. It delegates business logic to `ClassScheduleService`.
- `backend/src/main/java/com/multifitaundh/controller/admin/AdminClassScheduleController.java` — CONTROLLER layer — exposes admin-only REST API endpoints for CRUD operations on `GymClass` entities. It delegates business logic to `ClassScheduleService` and requires `ROLE_ADMIN` authority.
- `backend/src/main/java/com/multifitaundh/dto/GymClassDto.java` — DTO layer — Data Transfer Object for gym class data exposed to the client, containing relevant fields for display.

**Feature Instruction:**

The Class Scheduling & Booking feature manages gym classes and user bookings. It consists of two main entities: `GymClass` and `ClassBooking`. `GymClass` represents a scheduled fitness class with details like name, description, time, capacity, and an associated `Trainer` (from the content-management-be feature). `ClassBooking` represents a user's reservation for a specific `GymClass`, linking to a `User` (from the shared-backend feature).

**Data Models:**
- `GymClass.java`: Defines the structure for a gym class, including its ID, name, description, start and end times, date, maximum capacity, and a ManyToOne relationship with `Trainer` (from `com.multifitaundh.model.Trainer`). It also tracks `currentBookings` as an integer.
- `ClassBooking.java`: Defines the structure for a class booking, including its ID, a ManyToOne relationship with `User` (from `com.multifitaundh.model.User`), a ManyToOne relationship with `GymClass`, the `bookingTime`, and a `status` (e.g., CONFIRMED, CANCELLED).

**Repositories:**
- `GymClassRepository.java`: Provides standard CRUD operations for `GymClass` entities and custom queries to fetch classes by date or within a date range.
- `ClassBookingRepository.java`: Provides standard CRUD operations for `ClassBooking` entities and custom queries to find bookings by user, by class, or to count bookings for a specific class.

**Service Layer (`ClassScheduleService.java`):**
This service orchestrates the business logic for class scheduling and booking. It injects `GymClassRepository`, `ClassBookingRepository`, `UserRepository` (from `shared-backend`), and `MembershipService` (from `membership-payment-be`).

**Public Methods:**
1.  `getGymClassesByDate(LocalDate date): List<GymClassDto>`:
    - Fetches all `GymClass` entities for the given `date` from `GymClassRepository`.
    - Converts `GymClass` entities to `GymClassDto`s, including the `trainerName` by accessing the associated `Trainer` object.
    - Returns a list of `GymClassDto`.
2.  `getWeeklySchedule(LocalDate startDate, LocalDate endDate): List<GymClassDto>`:
    - Fetches all `GymClass` entities within the `startDate` and `endDate` range from `GymClassRepository`.
    - Converts `GymClass` entities to `GymClassDto`s.
    - Returns a list of `GymClassDto`.
3.  `getGymClassById(UUID classId): GymClassDto`:
    - Retrieves a `GymClass` by its `classId` from `GymClassRepository`.
    - Throws `ResourceNotFoundException` if the class is not found.
    - Converts to `GymClassDto` and returns.
4.  `bookClass(UUID userId, UUID classId): ClassBookingDto`:
    - **Steps:**
        1.  Retrieve `User` by `userId` from `UserRepository.findById(userId)`. Throws `ResourceNotFoundException` if user not found.
        2.  Retrieve `GymClass` by `classId` from `GymClassRepository.findById(classId)`. Throws `ResourceNotFoundException` if class not found.
        3.  Check if the user has an active membership by calling `membershipService.getUserActiveMembership(userId)`. If the `Optional` is empty, throw `IllegalStateException("User does not have an active membership.")`.
        4.  Check if `gymClass.getCurrentBookings()` is less than `gymClass.getCapacity()`. If not, throw `IllegalStateException("Class is full.")`.
        5.  Check if a booking already exists for this `userId` and `classId` using `classBookingRepository.findByUser_IdAndGymClass_Id(userId, classId)`. If present and status is CONFIRMED, throw `IllegalStateException("User already booked this class.")`.
        6.  Create a new `ClassBooking` entity with the `user`, `gymClass`, `bookingTime` (current time), and `status` as CONFIRMED.
        7.  Save the `ClassBooking` entity using `classBookingRepository.save()`.
        8.  Increment `gymClass.currentBookings` and save the updated `GymClass` using `gymClassRepository.save()`.
        9.  Convert the saved `ClassBooking` to `ClassBookingDto` and return.
    - **Error Cases:** `ResourceNotFoundException` (User or GymClass not found - HTTP 404), `IllegalStateException` (Class full, already booked, or no active membership - HTTP 400).
5.  `cancelBooking(UUID userId, UUID bookingId): void`:
    - **Steps:**
        1.  Retrieve `ClassBooking` by `bookingId` from `classBookingRepository.findById(bookingId)`. Throws `ResourceNotFoundException` if booking not found.
        2.  Verify that `booking.getUser().getId()` matches the provided `userId`. If not, throw `AccessDeniedException("User not authorized to cancel this booking.")`.
        3.  If `booking.getStatus()` is already CANCELLED, do nothing.
        4.  Set `booking.setStatus(CANCELLED)`.
        5.  Save the updated `ClassBooking` entity.
        6.  Decrement `booking.getGymClass().currentBookings` and save the updated `GymClass`.
    - **Error Cases:** `ResourceNotFoundException` (Booking not found - HTTP 404), `AccessDeniedException` (User mismatch - HTTP 403).
6.  `getUserBookings(UUID userId): List<ClassBookingDto>`:
    - Fetches all `ClassBooking` entities for the given `userId` from `classBookingRepository.findByUser_Id()`.
    - Converts `ClassBooking` entities to `ClassBookingDto`s.
    - Returns a list of `ClassBookingDto`.
7.  `createGymClass(CreateGymClassRequest request): GymClassDto` (Admin only):
    - **Steps:**
        1.  Validate `request` fields (e.g., `name`, `description`, `capacity`, `trainerId`, `date`, `startTime`, `endTime`).
        2.  Retrieve `Trainer` by `request.getTrainerId()` from `TrainerRepository` (from `content-management-be`). Throws `ResourceNotFoundException` if trainer not found.
        3.  Create a new `GymClass` entity from the `request` data and the retrieved `Trainer`.
        4.  Set `currentBookings` to 0.
        5.  Save the `GymClass` entity using `gymClassRepository.save()`.
        6.  Convert the saved `GymClass` to `GymClassDto` and return.
    - **Error Cases:** `ResourceNotFoundException` (Trainer not found - HTTP 404), `MethodArgumentNotValidException` (for validation errors - HTTP 400).
8.  `updateGymClass(UUID classId, UpdateGymClassRequest request): GymClassDto` (Admin only):
    - **Steps:**
        1.  Retrieve `GymClass` by `classId` from `gymClassRepository.findById(classId)`. Throws `ResourceNotFoundException` if class not found.
        2.  Update the `GymClass` entity's fields (name, description, startTime, endTime, capacity, date) from the `request`.
        3.  If `request.getTrainerId()` is provided and different, retrieve the new `Trainer` and update the `gymClass.setTrainer()`.
        4.  Save the updated `GymClass` entity.
        5.  Convert the saved `GymClass` to `GymClassDto` and return.
    - **Error Cases:** `ResourceNotFoundException` (GymClass or Trainer not found - HTTP 404), `MethodArgumentNotValidException` (for validation errors - HTTP 400).
9.  `deleteGymClass(UUID classId): void` (Admin only):
    - **Steps:**
        1.  Retrieve `GymClass` by `classId` from `gymClassRepository.findById(classId)`. Throws `ResourceNotFoundException` if class not found.
        2.  Delete the `GymClass` entity using `gymClassRepository.deleteById()`.
    - **Error Cases:** `ResourceNotFoundException` (GymClass not found - HTTP 404).

**Controllers:**
- `ClassScheduleController.java`: Exposes public API endpoints for users to view class schedules and manage their bookings. It injects `ClassScheduleService`.
- `AdminClassScheduleController.java`: Exposes admin-only API endpoints for CRUD operations on `GymClass` entities. It injects `ClassScheduleService` and requires `hasRole('ADMIN')` authorization.

**DTOs:**
- `GymClassDto.java`: Data Transfer Object for exposing `GymClass` information to clients.
- `CreateGymClassRequest.java`: DTO for creating a new `GymClass` (admin).
- `UpdateGymClassRequest.java`: DTO for updating an existing `GymClass` (admin).
- `ClassBookingDto.java`: Data Transfer Object for exposing `ClassBooking` information to clients.

**Security Configuration:**
- Public endpoints (`/api/v1/classes/**`, `/api/v1/bookings/my-bookings`, `/api/v1/classes/{classId}/book`, `/api/v1/bookings/{bookingId}`) require authentication.
- Admin endpoints (`/api/v1/admin/classes/**`) require `ROLE_ADMIN` authority.

**Cross-Feature Interactions:**
- This feature interacts with `shared-backend` to retrieve `User` details (via `UserRepository`) for booking operations.
- This feature interacts with `membership-payment-be` to check for active user memberships before allowing class bookings (via `MembershipService.getUserActiveMembership`).
- This feature interacts with `content-management-be` to link `GymClass` entities to `Trainer` entities (via `TrainerRepository`).

---

## Backend: Content Management (Trainers, Testimonials)

**Name:** `content-management-be`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/multifitaundh/model/Trainer.java` — MODEL layer — defines the structure and persistence mapping for trainer profiles.
- `backend/src/main/java/com/multifitaundh/repository/TrainerRepository.java` — REPOSITORY layer — provides data access operations for `Trainer` entities, extending Spring Data JPA's `JpaRepository`.
- `backend/src/main/java/com/multifitaundh/model/Testimonial.java` — MODEL layer — defines the structure and persistence mapping for customer testimonials.
- `backend/src/main/java/com/multifitaundh/repository/TestimonialRepository.java` — REPOSITORY layer — provides data access operations for `Testimonial` entities, extending Spring Data JPA's `JpaRepository`.
- `backend/src/main/java/com/multifitaundh/service/ContentService.java` — SERVICE layer — implements business logic for fetching and managing trainer profiles and customer testimonials.
- `backend/src/main/java/com/multifitaundh/controller/ContentController.java` — CONTROLLER layer — exposes public API endpoints for fetching trainer profiles and customer testimonials.
- `backend/src/main/java/com/multifitaundh/controller/admin/AdminContentController.java` — CONTROLLER layer — provides admin-only API endpoints for CRUD operations on trainer profiles and customer testimonials, requiring 'ADMIN' role.
- `backend/src/main/java/com/multifitaundh/dto/TrainerDto.java` — DTO layer — Data Transfer Object for trainer profile data, used for API requests and responses.

**Feature Instruction:**

The `content-management-be` feature provides backend services and API endpoints for managing public content, specifically trainer profiles and customer testimonials. It consists of two domain models (`Trainer.java`, `Testimonial.java`), their respective Spring Data JPA repositories (`TrainerRepository.java`, `TestimonialRepository.java`), a service layer (`ContentService.java`) for business logic, and two controller layers (`ContentController.java` for public access and `AdminContentController.java` for authenticated administrative CRUD operations). A Data Transfer Object (`TrainerDto.java`) is used for transferring trainer data between the service and controller layers.

### Data Models
- `Trainer.java`: Represents a fitness trainer with fields for `id`, `name`, `specialization`, `bio`, and `photoUrl`.
- `Testimonial.java`: Represents a customer testimonial with fields for `id`, `author`, `text`, and `rating`.

### Repositories
- `TrainerRepository.java`: Extends `JpaRepository<Trainer, UUID>` to provide standard CRUD operations for `Trainer` entities.
- `TestimonialRepository.java`: Extends `JpaRepository<Testimonial, UUID>` to provide standard CRUD operations for `Testimonial` entities.

### Service Layer (`ContentService.java`)
`ContentService` is responsible for implementing the business logic for content management. It injects `TrainerRepository` and `TestimonialRepository` to interact with the database.

**Public Methods:**

1.  `public List<TrainerDto> getAllTrainers()`
    - **Logic:**
        1.  Retrieve all `Trainer` entities from `trainerRepository`.
        2.  Map each `Trainer` entity to a `TrainerDto`.
        3.  Return the list of `TrainerDto`s.

2.  `public TrainerDto getTrainerById(UUID id)`
    - **Logic:**
        1.  Find a `Trainer` entity by `id` using `trainerRepository.findById(id)`.
        2.  If not found, throw `ResourceNotFoundException` with a message like "Trainer not found with ID: " + id.
        3.  Map the found `Trainer` entity to a `TrainerDto`.
        4.  Return the `TrainerDto`.
    - **Error Cases:** `ResourceNotFoundException` (HTTP 404).

3.  `public TrainerDto createTrainer(TrainerDto trainerDto)`
    - **Logic:**
        1.  Create a new `Trainer` entity from the `trainerDto`, assigning a new `UUID`.
        2.  Save the new `Trainer` entity using `trainerRepository.save()`.
        3.  Map the saved `Trainer` entity back to a `TrainerDto`.
        4.  Return the `TrainerDto`.

4.  `public TrainerDto updateTrainer(UUID id, TrainerDto trainerDto)`
    - **Logic:**
        1.  Find an existing `Trainer` entity by `id` using `trainerRepository.findById(id)`.
        2.  If not found, throw `ResourceNotFoundException`.
        3.  Update the fields of the existing `Trainer` entity with values from `trainerDto`.
        4.  Save the updated `Trainer` entity using `trainerRepository.save()`.
        5.  Map the saved `Trainer` entity back to a `TrainerDto`.
        6.  Return the `TrainerDto`.
    - **Error Cases:** `ResourceNotFoundException` (HTTP 404).

5.  `public void deleteTrainer(UUID id)`
    - **Logic:**
        1.  Check if a `Trainer` entity with the given `id` exists using `trainerRepository.existsById(id)`.
        2.  If not found, throw `ResourceNotFoundException`.
        3.  Delete the `Trainer` entity using `trainerRepository.deleteById(id)`.
    - **Error Cases:** `ResourceNotFoundException` (HTTP 404).

6.  `public List<Testimonial> getAllTestimonials()`
    - **Logic:**
        1.  Retrieve all `Testimonial` entities from `testimonialRepository`.
        2.  Return the list of `Testimonial` entities.

7.  `public Testimonial getTestimonialById(UUID id)`
    - **Logic:**
        1.  Find a `Testimonial` entity by `id` using `testimonialRepository.findById(id)`.
        2.  If not found, throw `ResourceNotFoundException` with a message like "Testimonial not found with ID: " + id.
        3.  Return the `Testimonial` entity.
    - **Error Cases:** `ResourceNotFoundException` (HTTP 404).

8.  `public Testimonial createTestimonial(Testimonial testimonial)`
    - **Logic:**
        1.  Assign a new `UUID` to the `testimonial`.
        2.  Save the new `Testimonial` entity using `testimonialRepository.save()`.
        3.  Return the saved `Testimonial` entity.

9.  `public Testimonial updateTestimonial(UUID id, Testimonial testimonial)`
    - **Logic:**
        1.  Find an existing `Testimonial` entity by `id` using `testimonialRepository.findById(id)`.
        2.  If not found, throw `ResourceNotFoundException`.
        3.  Update the fields of the existing `Testimonial` entity with values from `testimonial`.
        4.  Save the updated `Testimonial` entity using `testimonialRepository.save()`.
        5.  Return the saved `Testimonial` entity.
    - **Error Cases:** `ResourceNotFoundException` (HTTP 404).

10. `public void deleteTestimonial(UUID id)`
    - **Logic:**
        1.  Check if a `Testimonial` entity with the given `id` exists using `testimonialRepository.existsById(id)`.
        2.  If not found, throw `ResourceNotFoundException`.
        3.  Delete the `Testimonial` entity using `testimonialRepository.deleteById(id)`.
    - **Error Cases:** `ResourceNotFoundException` (HTTP 404).

### Controller Layer (`ContentController.java`)
`ContentController` exposes public API endpoints for fetching trainers and testimonials. It injects `ContentService`.

### Admin Controller Layer (`AdminContentController.java`)
`AdminContentController` exposes admin-only API endpoints for CRUD operations on trainers and testimonials. These endpoints require `ROLE_ADMIN` authority. It injects `ContentService`.

### Security Configuration
- Public endpoints (`/api/v1/content/**`) should be permitted to all users.
- Admin endpoints (`/api/v1/admin/trainers/**`, `/api/v1/admin/testimonials/**`) must be secured with `hasRole("ADMIN")` using `@PreAuthorize` annotations on the controller methods or configured in `SecurityConfig.java`.

---

## Backend: Lead Management

**Name:** `lead-management-be`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/multifitaundh/model/TrialLead.java` — MODEL layer — defines the `TrialLead` entity with fields `id`, `name`, `email`, `phone`, and `submissionDate` for persistence.
- `backend/src/main/java/com/multifitaundh/repository/TrialLeadRepository.java` — REPOSITORY layer — provides standard Spring Data JPA CRUD operations for `TrialLead` entities.
- `backend/src/main/java/com/multifitaundh/service/LeadService.java` — SERVICE layer — implements `captureTrialLead(TrialLeadDto): TrialLeadDto`, `getAllTrialLeads(): List<TrialLeadDto>`, and `getTrialLeadById(UUID): TrialLeadDto` for lead management.
- `backend/src/main/java/com/multifitaundh/controller/LeadController.java` — CONTROLLER layer — exposes a public endpoint `POST /api/v1/leads/trial` for submitting trial leads.
- `backend/src/main/java/com/multifitaundh/controller/admin/AdminLeadController.java` — CONTROLLER layer — provides admin-only endpoints `GET /api/v1/admin/leads/trial` and `GET /api/v1/admin/leads/trial/{id}` for viewing leads.
- `backend/src/main/java/com/multifitaundh/dto/TrialLeadDto.java` — DTO layer — defines the `TrialLeadDto` for data transfer, used in public lead submission and admin lead retrieval.

**Feature Instruction:**

The `lead-management-be` feature provides backend functionality for capturing and managing trial leads submitted through the '3-Day Free Trial' form. It consists of a data model (`TrialLead`), a repository for persistence (`TrialLeadRepository`), a service layer for business logic (`LeadService`), and two controllers for public submission and admin management (`LeadController` and `AdminLeadController`). A Data Transfer Object (`TrialLeadDto`) is used for data exchange.

### Data Model (`TrialLead.java`)
This entity represents a trial lead with fields for `id`, `name`, `email`, `phone`, and `submissionDate`. The `id` is a UUID, `name`, `email`, and `phone` are non-nullable strings, and `submissionDate` captures the timestamp of submission.

### DTO (`TrialLeadDto.java`)
This DTO is used for receiving lead submission data from the frontend. It includes `name`, `email`, and `phone` fields, all of which are required and subject to validation (e.g., `@NotBlank` for all, `@Email` for email, `@Pattern` for phone).

### Repository (`TrialLeadRepository.java`)
This interface extends `JpaRepository<TrialLead, UUID>`, providing standard CRUD operations for `TrialLead` entities. No custom query methods are required for this feature.

### Service (`LeadService.java`)
`LeadService` encapsulates the business logic for lead management. It is injected with `TrialLeadRepository`.

1.  **`captureTrialLead(TrialLeadDto leadDto): TrialLeadDto`**
    *   **Purpose**: Processes a new trial lead submission.
    *   **Parameters**: `TrialLeadDto leadDto` - the data submitted by the user.
    *   **Return Type**: `TrialLeadDto` - the saved lead data.
    *   **Logic**:
        1.  Create a new `TrialLead` entity from the `leadDto`, setting `submissionDate` to `LocalDateTime.now()` and generating a new `UUID` for `id`.
        2.  Call `trialLeadRepository.save(trialLead)` to persist the entity.
        3.  Convert the saved `TrialLead` entity back to a `TrialLeadDto`.
        4.  Return the `TrialLeadDto`.

2.  **`getAllTrialLeads(): List<TrialLeadDto>`**
    *   **Purpose**: Retrieves all captured trial leads.
    *   **Parameters**: None.
    *   **Return Type**: `List<TrialLeadDto>` - a list of all trial leads.
    *   **Logic**:
        1.  Call `trialLeadRepository.findAll()` to retrieve all `TrialLead` entities.
        2.  Map each `TrialLead` entity to a `TrialLeadDto`.
        3.  Return the list of `TrialLeadDto`.

3.  **`getTrialLeadById(UUID id): TrialLeadDto`**
    *   **Purpose**: Retrieves a single trial lead by its ID.
    *   **Parameters**: `UUID id` - the ID of the lead to retrieve.
    *   **Return Type**: `TrialLeadDto` - the requested lead data.
    *   **Logic**:
        1.  Call `trialLeadRepository.findById(id)`.
        2.  If the lead is not found, throw a `ResourceNotFoundException`.
        3.  Convert the found `TrialLead` entity to a `TrialLeadDto`.
        4.  Return the `TrialLeadDto`.

### Public Controller (`LeadController.java`)
`LeadController` exposes the public API endpoint for submitting trial leads. It is injected with `LeadService`.

1.  **`submitTrialLead(@RequestBody @Valid TrialLeadDto leadDto): ResponseEntity<TrialLeadDto>`**
    *   **HTTP Method**: `POST`
    *   **Path**: `/api/v1/leads/trial`
    *   **Purpose**: Allows unauthenticated users to submit a new trial lead.
    *   **Request Body**: `TrialLeadDto` - containing `name`, `email`, `phone`.
    *   **Response**: `TrialLeadDto` (HTTP 201 Created) on success.
    *   **Error Cases**: `MethodArgumentNotValidException` (HTTP 400 Bad Request) if `leadDto` validation fails.
    *   **Logic**: Calls `leadService.captureTrialLead(leadDto)` and returns the result with HTTP 201 status.

### Admin Controller (`AdminLeadController.java`)
`AdminLeadController` provides admin-only endpoints for viewing and managing captured leads. It is injected with `LeadService` and requires `ROLE_ADMIN` authority for all its endpoints.

1.  **`getAllTrialLeads(): ResponseEntity<List<TrialLeadDto>>`**
    *   **HTTP Method**: `GET`
    *   **Path**: `/api/v1/admin/leads/trial`
    *   **Purpose**: Retrieves all trial leads for administrators.
    *   **Security**: `@PreAuthorize("hasRole('ADMIN')")`
    *   **Response**: `List<TrialLeadDto>` (HTTP 200 OK).
    *   **Logic**: Calls `leadService.getAllTrialLeads()` and returns the result.

2.  **`getTrialLeadById(@PathVariable UUID id): ResponseEntity<TrialLeadDto>`**
    *   **HTTP Method**: `GET`
    *   **Path**: `/api/v1/admin/leads/trial/{id}`
    *   **Purpose**: Retrieves a specific trial lead by ID for administrators.
    *   **Security**: `@PreAuthorize("hasRole('ADMIN')")`
    *   **Path Variable**: `UUID id` - the ID of the lead.
    *   **Response**: `TrialLeadDto` (HTTP 200 OK).
    *   **Error Cases**: `ResourceNotFoundException` (HTTP 404 Not Found) if the lead does not exist.
    *   **Logic**: Calls `leadService.getTrialLeadById(id)` and returns the result.

### Security Configuration
Ensure that `/api/v1/leads/trial` is permitted for all, while `/api/v1/admin/leads/trial/**` requires `hasRole("ADMIN")` in `SecurityConfig.java` (from `shared-backend` feature).

---

## Frontend: Shared UI Components

**Name:** `shared-ui`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/App.tsx` — Main application component that sets up routing for all pages, including public, protected, and admin routes, and integrates the AuthContext.
- `frontend/src/components/Layout.tsx` — Main layout component for public-facing pages, providing a consistent structure with a header, footer, and a content area for child components.
- `frontend/src/components/Header.tsx` — Application header component displaying the MultiFit Aundh logo, primary navigation links, and dynamic call-to-action buttons (Login/Account).
- `frontend/src/components/Footer.tsx` — Application footer component displaying MultiFit Aundh's contact information, social media links, and a sitemap.
- `frontend/src/components/FloatingCTA.tsx` — A site-wide floating call-to-action button, typically for WhatsApp chat, positioned at the bottom right of the screen.
- `frontend/src/api/client.ts` — Configures the global Axios instance with a base URL and an interceptor to attach the JWT authentication token to outgoing requests.

**Feature Instruction:**

## Design Tokens
- Navbar: `bg-[#1A1A1A]` text-white
- Primary CTA: `bg-[#DFFF00]` hover:bg-opacity-80 text-black font-semibold rounded-full px-8 py-3 transition-all duration-200
- Brand text accent: `text-[#DFFF00]`
- Section bg: `bg-[#F5F5F5]` (odd sections) / `bg-gray-100` (even sections)
- Card: `bg-white` rounded-xl shadow-md border border-gray-100 p-6
- Section container: `<section className="py-16 px-4"><div className="max-w-7xl mx-auto">`
- Hero h1: text-4xl md:text-6xl font-bold `text-[#F5F5F5]`
- Body: `text-[#333333]` leading-relaxed

The `shared-ui` feature provides the foundational UI components and global configurations for the MultiFit Aundh frontend application. It includes the main application entry point (`App.tsx`), the public page layout (`Layout.tsx`), common structural elements like the `Header.tsx` and `Footer.tsx`, a persistent `FloatingCTA.tsx`, and the global Axios client configuration (`client.ts`).

1.  **`App.tsx`**: This is the root component that sets up the application's routing using `react-router-dom`.
    *   It wraps the entire application within an `AuthProvider` (from the `auth-flow` feature at `frontend/src/context/AuthContext.tsx`) to manage global authentication state.
    *   It defines public routes for `HomePage`, `MembershipsPage`, `SchedulePage`, `TrainersPage`, `ContactPage`, and `LoginPage`.
    *   It defines a protected route for `/account` using the `ProtectedRoute` component (from the `auth-flow` feature at `frontend/src/components/ProtectedRoute.tsx`), ensuring only authenticated users can access it.
    *   It defines an admin-specific protected route for `AdminDashboardPage` and all `/admin/*` paths, also using `ProtectedRoute` and verifying the user has an 'ADMIN' role via the `AuthContext`'s `isAdmin` property.
    *   The `FloatingCTA` component is rendered globally, outside the main routing structure, to be present on all pages.

2.  **`Layout.tsx`**: This component provides the consistent structural wrapper for all public-facing pages.
    *   It accepts `children` of type `React.ReactNode` as a prop, which represents the main content of the page.
    *   It renders the `Header` component at the top, the `children` within a `<main>` content area, and the `Footer` component at the bottom.
    *   It does not include any authentication logic itself, relying on `App.tsx` to handle route protection.

3.  **`Header.tsx`**: This component displays the application's global navigation and branding.
    *   It prominently features the "MultiFit Aundh" brand name. The brand text accent `text-[#DFFF00]` should be applied to the brand name.
    *   It includes navigation links to the main public sections: Home (`/`), Memberships (`/memberships`), Schedule (`/schedule`), Trainers (`/trainers`), and Contact (`/contact`).
    *   It utilizes the `useAuth` hook (from the `auth-flow` feature) to dynamically display either a "Login" button (navigating to `/login`) or "My Account" (navigating to `/account`) and "Logout" buttons based on the user's authentication status. The "Logout" button calls the `logout` function from `AuthContext`.
    *   Styling adheres to the design tokens: `bg-[#1A1A1A]` for the background and `text-white` for text. The CTA buttons should use the Primary CTA design token.

4.  **`Footer.tsx`**: This component provides essential contact information and navigation at the bottom of every public page.
    *   It displays the "MultiFit Aundh" brand.
    *   It includes the gym's physical address: `Multifit Aundh , D.P. Road Medipoint Hospital Road, opp. to Indian Bank, Aundh, Pune, Maharashtra 411067`.
    *   It lists the phone number: `075070 08009`.
    *   It includes placeholder opening hours: "Mon-Fri: 6 AM - 10 PM, Sat-Sun: 8 AM - 8 PM".
    *   It features social media links (e.g., Facebook, Instagram, Twitter icons linking to placeholder URLs). These icons should be styled to match the overall design.
    *   It provides a sitemap with links to the main public pages.
    *   Styling adheres to the design tokens: `bg-[#1A1A1A]` for the background and `text-white` for text.

5.  **`FloatingCTA.tsx`**: This component provides a persistent, easily accessible call-to-action.
    *   It renders a fixed-position button, typically a WhatsApp chat icon, at the bottom-right of the viewport. The button should have a `z-50` class to ensure it floats above other content.
    *   Clicking the button should open a WhatsApp chat with the business phone number (`https://wa.me/917507008009`).
    *   The button uses the `bg-[#DFFF00]` accent color for high visibility and `text-black` for the icon.

6.  **`client.ts`**: This file configures the global Axios HTTP client for all API interactions.
    *   It creates an `axiosInstance` with a `baseURL` of `/api/v1`.
    *   It implements a request interceptor that checks `localStorage` for an authentication token stored under the key `'token'`.
    *   If a token is found, it is added to the request headers as `Authorization: Bearer <token>`. This ensures all authenticated API calls automatically include the JWT.
    *   This `axiosInstance` is exported and used by all frontend service files (e.g., `authService.ts`, `membershipService.ts`, etc.) to make API requests.

---

## Frontend: Authentication Flow

**Name:** `auth-flow`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/context/AuthContext.tsx` — React context for managing global authentication state (user, token, login/logout functions). Provides `AuthContext.Provider` and exposes `login(email: string, password: string): Promise<void>`, `logout(): void`, and `checkAuthStatus(): void`.
- `frontend/src/hooks/useAuth.ts` — Custom hook for easy access to authentication context and functions. Exposes `useAuth()` to provide authentication state and actions.
- `frontend/src/services/authService.ts` — Service functions for making API calls related to authentication (login, register). Implements `login(AuthRequest): Promise<AuthResponse>` and `register(AuthRequest): Promise<AuthResponse>`.
- `frontend/src/types/auth.ts` — Generated from the backend API contract — TypeScript types and interfaces for authentication data structures.
- `frontend/src/pages/LoginPage.tsx` — Page containing the login form for users and administrators. Renders the login UI and interacts with `useAuth` to perform authentication.
- `frontend/src/components/ProtectedRoute.tsx` — A wrapper component that restricts access to its children routes to authenticated users. Uses `useAuth` to check authentication status and redirects unauthenticated users.

**Feature Instruction:**

## Design Tokens
- Navbar: bg-[#1A1A1A] text-[#F5F5F5]
- Primary CTA: bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200
- Secondary CTA: bg-[#333333] hover:bg-[#444444] text-[#F5F5F5] font-semibold rounded-full px-8 py-3 transition-all duration-200
- Brand text accent: text-[#DFFF00]
- Section bg: bg-[#1A1A1A] (dark sections) / bg-white (light sections)
- Card: bg-white rounded-xl shadow-md border border-gray-100 p-6
- Section container: <section className="py-16 px-4"><div className="max-w-7xl mx-auto">
- Hero h1: text-4xl md:text-6xl font-bold text-[#F5F5F5]
- Body: text-gray-700 leading-relaxed

## Feature: Frontend Authentication Flow
This feature provides a complete client-side authentication system, enabling users to log in, maintain their session, and protect routes based on their authentication status. It consists of a React Context for global state management, a custom hook for easy access, a service for API interactions, type definitions, a login page, and a protected route component.

### 1. `frontend/src/types/auth.ts`
This file defines the TypeScript interfaces for authentication-related data structures, mirroring the backend `AuthRequest` and `AuthResponse` DTOs, and a simplified `User` interface for frontend use. These types are crucial for ensuring type safety across the authentication flow.

### 2. `frontend/src/services/authService.ts`
This service handles all direct API communication with the backend's authentication endpoints. It uses the `axios` instance from `@/api/client.ts` to make HTTP requests. It provides functions for user login and registration, returning the `AuthResponse` which contains the JWT token.

**Public Functions:**
- `login(credentials: AuthRequest): Promise<AuthResponse>`: Sends a POST request to `/api/v1/auth/login` with user credentials. On success, returns the `AuthResponse` containing the JWT token. Throws an error on failure (e.g., invalid credentials).
- `register(userData: AuthRequest): Promise<AuthResponse>`: Sends a POST request to `/api/v1/auth/register` with user registration data. On success, returns the `AuthResponse` containing the JWT token. Throws an error on failure (e.g., email already exists).

### 3. `frontend/src/context/AuthContext.tsx`
This file establishes the React Context for managing the global authentication state. It provides an `AuthContext.Provider` component that wraps the application (or relevant parts) and makes the authentication state and functions available to all descendant components. The context manages the JWT token, user information, authentication status, and loading state.

**State Variables:**
- `token: string | null`: Stores the JWT received from the backend. Persisted in `localStorage` under the key `'token'`.
- `user: { id: string; email: string; roles: string[] } | null`: Stores simplified user details (ID, email, roles) after successful login.
- `isAuthenticated: boolean`: Derived from the presence of a token and user.
- `isLoading: boolean`: Indicates if the authentication status is currently being checked (e.g., on initial app load).

**Public Functions (provided by context):**
- `login(email: string, password: string): Promise<void>`:
    1. Calls `authService.login({ email, password })`.
    2. On success, stores the received `jwtToken` in `localStorage` using the key `'token'`.
    3. Decodes the JWT to extract user information (e.g., email, roles) and sets the `user` state.
    4. Sets `token` state and `isAuthenticated` to `true`.
    5. Handles errors by setting appropriate state and potentially throwing.
- `logout(): void`:
    1. Removes the JWT token from `localStorage` using the key `'token'`.
    2. Clears the `token` and `user` states.
    3. Sets `isAuthenticated` to `false`.
- `checkAuthStatus(): void`:
    1. Called on initial component mount of the `AuthProvider`.
    2. Sets `isLoading` to `true`.
    3. Retrieves the token from `localStorage` using the key `'token'`.
    4. If a token exists, attempts to decode it to extract user information and set the `user` and `token` states, and `isAuthenticated` to `true`.
    5. If no token or an invalid token, clears states and sets `isAuthenticated` to `false`.
    6. Sets `isLoading` to `false`.

### 4. `frontend/src/hooks/useAuth.ts`
This custom React hook provides a convenient way for functional components to access the authentication context. It abstracts away the `useContext` boilerplate and makes the `token`, `user`, `isAuthenticated`, `isLoading`, `login`, and `logout` functions easily available.

**Public Functions:**
- `useAuth(): { token: string | null; user: { id: string; email: string; roles: string[] } | null; isAuthenticated: boolean; isLoading: boolean; login: (email: string, password: string) => Promise<void>; logout: () => void; }`

### 5. `frontend/src/pages/LoginPage.tsx`
This page renders the user login form. It utilizes the `useAuth` hook to access the `login` function and authentication state. The form will include fields for email and password, with validation. Upon successful login, the user should be redirected to the home page or a dashboard.

**Design Details:**
- The page should feature a prominent, high-energy hero section with a background image relevant to a gym (e.g., `https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80`). An overlay `div` with `className="absolute inset-0 bg-black bg-opacity-50"` should be applied over the image.
- The main headline should be "Unleash Your Potential. Log In.", using `text-4xl md:text-6xl font-bold text-[#F5F5F5]`.
- A subheadline "Access your personalized fitness journey." should follow.
- The login form itself should be centrally located, perhaps within a `bg-white` or `bg-[#1A1A1A]` card with `rounded-xl shadow-md p-8`.
- Input fields for email and password should be clearly labeled.
- The login button should use the `Primary CTA` design token: `bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200`.
- Include a link for "Don't have an account? Register here." that navigates to a registration page (if one exists in another feature, otherwise it can be a placeholder).
- Error messages for failed login attempts should be displayed clearly to the user.

### 6. `frontend/src/components/ProtectedRoute.tsx`
This component acts as a wrapper for routes that require authentication. It uses the `useAuth` hook to check if the user is authenticated. If not, it redirects the user to the `LoginPage`. If the authentication status is still loading, it can display a loading spinner or similar indicator.

**Public Functions:**
- `ProtectedRoute({ children }: { children: React.ReactNode }): JSX.Element`:
    1. Retrieves `isAuthenticated` and `isLoading` from `useAuth()`.
    2. If `isLoading` is `true`, renders a loading indicator (e.g., `<div>Loading...</div>`).
    3. If `isLoading` is `false` and `isAuthenticated` is `false`, redirects to `/login` using `react-router-dom`'s `Navigate` component.
    4. Otherwise (authenticated), renders `children`.


---

## Frontend: Static & Marketing Pages

**Name:** `static-pages`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/pages/HomePage.tsx` — PAGE layer — the main landing page for MultiFit Aundh, integrating TrialForm, TestimonialsSection, and SocialFeed components.
- `frontend/src/pages/ContactPage.tsx` — PAGE layer — displays MultiFit Aundh's contact information, a contact form, business hours, and an embedded Google Map.
- `frontend/src/components/TrialForm.tsx` — COMPONENT layer — a reusable lead capture form for the '3-Day Free Trial' offer, utilizing the `useLeads` hook for submission.
- `frontend/src/components/TestimonialsSection.tsx` — COMPONENT layer — displays a rotating carousel or grid of customer testimonials, fetching data via the `useContent` hook.
- `frontend/src/components/SocialFeed.tsx` — COMPONENT layer — a simple presentational component that displays links to social media feeds.
- `frontend/src/components/GoogleMapsEmbed.tsx` — COMPONENT layer — embeds an interactive Google Map showing the gym's location based on provided coordinates.
- `frontend/src/services/leadService.ts` — SERVICE layer — provides the `submitTrialLead(lead: CreateTrialLeadRequest): Promise<TrialLeadResponse>` function for submitting lead capture form data to the backend.
- `frontend/src/hooks/useLeads.ts` — HOOK layer — a React Query hook `useSubmitTrialLead()` for submitting new trial leads via `leadService`.
- `frontend/src/types/lead.ts` — TypeScript types for trial lead data, defining the request and response structures for lead submission.

**Feature Instruction:**

## Design Tokens
- Navbar: bg-[#1A1A1A] text-[#F5F5F5]
- Primary CTA: bg-[#DFFF00] hover:bg-opacity-80 text-[#1A1A1A] font-bold rounded-full px-8 py-3 transition-all duration-200
- Brand text accent: text-[#DFFF00]
- Section bg (dark): bg-[#1A1A1A] text-[#F5F5F5]
- Section bg (medium dark): bg-[#333333] text-[#F5F5F5]
- Card: bg-[#333333] rounded-xl shadow-lg border border-[#1A1A1A] p-6 text-[#F5F5F5]
- Section container: <section className="py-16 px-4"><div className="max-w-7xl mx-auto">
- Hero h1: text-4xl md:text-6xl font-extrabold text-[#DFFF00]
- Body: text-[#F5F5F5] leading-relaxed

This feature implements the public-facing static and marketing pages for MultiFit Aundh, including the landing page, contact page, and supporting components. It focuses on lead generation through a '3-Day Trial' form and showcasing the gym's vibrant community and offerings. The pages are designed to be energetic, bold, and modern, aligning with the brand's identity as 'the antidote to boring gyms,' using the defined design tokens for a consistent visual experience. Data for testimonials is fetched from the `content-management-be` feature, and trial lead submissions are handled by the `lead-management-be` feature.

### HomePage.tsx
This page serves as the main landing page for MultiFit Aundh. It should be structured into several key sections:
1.  **Hero Section**: A full-width section with a dynamic background image (Unsplash URL: https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80) with a `bg-black bg-opacity-50` overlay. It features a prominent `h1` headline: "UNLEASH YOUR POTENTIAL AT MULTIFIT AUNDH" and a sub-headline: "Experience the energy, embrace the community. Your fitness journey starts here." Below the headlines, include a call-to-action button: "START YOUR 3-DAY FREE TRIAL" styled with the Primary CTA tokens, which scrolls down to the Trial Form section.
2.  **Trial Form Section**: This section, styled with `Section bg (dark)` tokens, prominently displays the `TrialForm` component. It should have a heading: "CLAIM YOUR FREE 3-DAY TRIAL" and a sub-heading encouraging sign-ups.
3.  **Class Highlights Section**: This section, styled with `Section bg (medium dark)` tokens, showcases a few key class types offered by MultiFit Aundh (e.g., "High-Intensity Interval Training", "Yoga & Flexibility", "Strength & Conditioning"). Each highlight should include a brief description and an image. This section should have a heading: "OUR CLASSES: FIND YOUR FIRE."
4.  **Testimonials Section**: This section, styled with `Section bg (dark)` tokens, integrates the `TestimonialsSection` component to display customer reviews. It should have a heading: "WHAT OUR MEMBERS SAY: REAL RESULTS, REAL COMMUNITY."
5.  **Social Feed Section**: This section, styled with `Section bg (medium dark)` tokens, integrates the `SocialFeed` component to display links to MultiFit Aundh's social media profiles. It should have a heading: "JOIN THE MULTIFIT AUNDH COMMUNITY ONLINE."
All content on the page must be wrapped in the `<Layout>` component from `shared-ui`.

### ContactPage.tsx
This page provides all necessary contact information for MultiFit Aundh. It should be structured into the following sections:
1.  **Hero Section**: A smaller hero section with a background image (can reuse the gym image or a relevant one) and a simple `h1` headline: "GET IN TOUCH WITH MULTIFIT AUNDH".
2.  **Contact Details Section**: This section, styled with `Section bg (dark)` tokens, displays the gym's address, phone number, and opening hours. Use the exact business context details:
    -   **Address**: Multifit Aundh , D.P. Road Medipoint Hospital Road, opp. to Indian Bank, Aundh, Pune, Maharashtra 411067
    -   **Phone**: 075070 08009
    -   **Opening Hours**: Monday - Saturday: 6:00 AM - 10:00 PM, Sunday: 8:00 AM - 6:00 PM (placeholder, as not provided in context).
3.  **Contact Form Section**: This section, styled with `Section bg (medium dark)` tokens, includes a simple contact form with fields for Name, Email, Subject, and Message. This form will be a client-side only form for now, with no backend integration in this feature. A submit button should be styled with `Primary CTA` tokens.
4.  **Google Map Section**: This section, styled with `Section bg (dark)` tokens, integrates the `GoogleMapsEmbed` component to display the gym's location using the coordinates `18.562876, 73.784389`. It should have a heading: "FIND US HERE."
All content on the page must be wrapped in the `<Layout>` component from `shared-ui`.

### TrialForm.tsx
This component is a reusable form for capturing trial lead information. It uses `react-hook-form` and `zod` for validation. The form should have fields for `name`, `email`, and `phone`. Upon successful submission, it calls the `useSubmitTrialLead` hook. The form fields should have appropriate labels and placeholders. The submit button should be styled with `Primary CTA` tokens.

### TestimonialsSection.tsx
This component displays a carousel or grid of customer testimonials. It utilizes the `useContent` hook from the `content-display-ui` feature to fetch testimonials. Each testimonial card should display the `author`, `text`, and `rating` (e.g., as star icons). The cards should be styled with `Card` tokens. The component should handle loading and error states gracefully.

### SocialFeed.tsx
This is a simple presentational component that displays links to MultiFit Aundh's social media profiles (e.g., Instagram, Facebook, Twitter). It should use icons for each social media platform and link to placeholder URLs. The links should be styled to fit the overall dark theme.

### GoogleMapsEmbed.tsx
This component embeds an interactive Google Map. It accepts `latitude` and `longitude` as props to center the map on the gym's location. The map should be responsive and display a marker at the specified coordinates. The component should use an `iframe` to embed the map, constructing the `src` URL with the provided coordinates.

### leadService.ts
This service file provides the `submitTrialLead` function, which is responsible for making the API call to the `lead-management-be` feature to record new trial leads. It uses the `apiClient` from `frontend/src/api/client.ts`.

### useLeads.ts
This React Query hook provides a mutation for submitting trial lead data. It wraps the `leadService.submitTrialLead` function, providing `isLoading`, `isError`, `isSuccess`, and `error` states, and a `mutate` function for form submission. It should invalidate relevant queries if needed (though none are present for leads in this feature).

### lead.ts
This file defines the TypeScript interfaces for the trial lead data, ensuring type safety across the frontend application when dealing with lead information. These interfaces should align with the `TrialLeadDto` data shape from the `lead-management-be` feature.


---

## Frontend: Membership & Account

**Name:** `membership-flow`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/pages/MembershipsPage.tsx` — PAGE layer — displays available membership plans and provides calls-to-action for purchase.
- `frontend/src/pages/AccountPage.tsx` — PAGE layer — provides an authenticated user's portal to view their current membership and booked classes.
- `frontend/src/services/membershipService.ts` — SERVICE layer — implements functions for fetching membership plans and managing user subscriptions by interacting with the backend API.
- `frontend/src/hooks/useMemberships.ts` — HOOK layer — provides React Query hooks for fetching membership plans and user-specific membership data, wrapping `membershipService.ts`.
- `frontend/src/types/membership.ts` — Generated from the backend API contract — defines TypeScript interfaces and enums for membership plans and user subscriptions.

**Feature Instruction:**

## Design Tokens
- Navbar: bg-[#1A1A1A] text-[#F5F5F5]
- Primary CTA: bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200
- Brand text accent: text-[#DFFF00]
- Section bg: bg-[#1A1A1A] (dark sections) / bg-[#333333] (slightly lighter sections) text-[#F5F5F5]
- Card: bg-[#333333] rounded-xl shadow-md border border-gray-700 p-6 text-[#F5F5F5]
- Section container: <section className="py-16 px-4 bg-[#1A1A1A] text-[#F5F5F5]"><div className="max-w-7xl mx-auto">
- Hero h1: text-4xl md:text-6xl font-bold text-[#F5F5F5]
- Body: text-gray-300 leading-relaxed

This feature provides the frontend user interface for viewing available membership plans and managing a user's account, including their current membership and booked classes. It consists of two main pages: `MembershipsPage.tsx` for displaying plans and `AccountPage.tsx` for user-specific information. These pages leverage `membershipService.ts` and `useMemberships.ts` for data fetching related to memberships, and integrate with the `class-booking-ui` feature's `useBookings.ts` for managing class bookings.

### `MembershipsPage.tsx`
This page displays all active membership plans from MultiFit Aundh in an engaging pricing table format. It uses the `Layout` component from `shared-ui` for consistent navigation and footer.

1.  **Hero Section**: A full-width hero section with a dynamic background image (`https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80`) and a `bg-black bg-opacity-50` overlay. The main headline will be "Unleash Your Potential at MultiFit Aundh" (using `Hero h1` tokens) and a subheadline "Join our vibrant community and transform your fitness journey with flexible membership plans." (using `Body` tokens).
2.  **Membership Plans Section**: This section will fetch all active membership plans using `useMemberships.useAllMembershipPlans()`. It will display each `MembershipPlanDto` in a card-like structure (using `Card` tokens) within a responsive grid.
    *   Each card will clearly show the `name`, `price` (formatted as currency), `durationInMonths`, and `description` of the plan.
    *   A "Choose Plan" button (using `Primary CTA` tokens) will be present on each card. This button will eventually trigger the `useMemberships.usePurchaseMembership()` mutation, passing the `id` of the selected plan. For now, it can be a placeholder.
3.  **Call to Action Section**: A concluding section encouraging users to sign up. It will feature a heading "Ready to Start Your Transformation?" and a sub-heading "Become a part of MultiFit Aundh today and experience fitness like never before." with a prominent "Join MultiFit Now" button (using `Primary CTA` tokens).

### `AccountPage.tsx`
This page serves as the authenticated user's personal portal, displaying their current membership status, booked classes, and a placeholder for payment history. It also uses the `Layout` component from `shared-ui`.

1.  **User Dashboard Section**: A welcoming section with a heading "Welcome, [User's First Name]!" and a sub-heading "Your MultiFit Aundh Account Overview."
2.  **Current Membership Section**: This section fetches the user's active membership using `useMemberships.useUserActiveMembership()`. If an active membership (`UserMembershipDto`) is found, it displays details such as `membershipPlan.name`, `startDate`, `endDate`, and `status`. If no active membership is found, it prompts the user to visit the `MembershipsPage` with a "View Plans" button (using `Primary CTA` tokens).
    *   A "Manage Membership" button (using `Primary CTA` tokens) will be present, serving as a placeholder for future functionality like upgrading or canceling.
3.  **Your Booked Classes Section**: This section integrates with the `class-booking-ui` feature by using `useBookings.useUserBookings()` (from `frontend/src/hooks/useBookings.ts`). It displays a list of the user's `ClassBookingDto`s.
    *   Each booking entry will show the `gymClass.name`, `gymClass.date`, `gymClass.startTime`, and `gymClass.trainerName`.
    *   A "Cancel Booking" button will be available for each booking. Clicking this button will trigger the `useBookings.useCancelBooking()` mutation, passing the `id` of the `ClassBookingDto`.
4.  **Payment History Section**: A placeholder section with the heading "Payment History" and content "Your payment history will appear here." for future integration.

### `membershipService.ts`
This service file acts as a client for the `membership-payment-be` backend API. It uses the shared `client` from `frontend/src/api/client.ts` to make HTTP requests.

1.  `getAllMembershipPlans()`: Makes a GET request to `/api/v1/memberships/plans` to retrieve a list of all active `MembershipPlanDto`s.
2.  `getUserActiveMembership()`: Makes a GET request to `/api/v1/memberships/my-membership` to retrieve the currently authenticated user's active `UserMembershipDto`. It should handle a 404 response by returning `null` if no active membership is found.
3.  `purchaseMembership(planId: string)`: Makes a POST request to `/api/v1/memberships/purchase/{planId}` to initiate a membership purchase for the authenticated user with the specified `planId`. It returns the newly created `UserMembershipDto`.

### `useMemberships.ts`
This file provides React Query hooks that abstract the data fetching and mutation logic for membership-related operations. It utilizes `membershipService.ts`.

1.  `useAllMembershipPlans()`: A `useQuery` hook to fetch all active membership plans. Its `queryKey` is `['membershipPlans']`.
2.  `useUserActiveMembership()`: A `useQuery` hook to fetch the authenticated user's active membership. Its `queryKey` is `['userActiveMembership']`.
3.  `usePurchaseMembership()`: A `useMutation` hook for purchasing a membership. Upon successful purchase, it invalidates the `['userActiveMembership']` and `['membershipPlans']` queries to ensure the UI reflects the updated membership status and potentially updated plan availability.

### `membership.ts`
This file defines the TypeScript interfaces and enums that mirror the DTOs and enums exposed by the `membership-payment-be` backend feature. These types ensure strong typing across the frontend application when dealing with membership data.

1.  `MembershipPlanDto`: Interface for membership plan data.
2.  `UserDto`: A simplified interface for user data, containing `id`, `email`, `firstName`, and `lastName`.
3.  `MembershipStatus`: An enum representing the possible statuses of a user's membership (e.g., ACTIVE, EXPIRED, CANCELLED, PENDING).
4.  `UserMembershipDto`: Interface for a user's specific membership, including references to `UserDto` and `MembershipPlanDto`.


---

## Frontend: Class Booking UI

**Name:** `class-booking-ui`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/pages/SchedulePage.tsx` — PAGE layer — Displays an interactive weekly class schedule, allowing users to view classes, filter, and perform booking/cancellation actions.
- `frontend/src/services/gymClassService.ts` — SERVICE layer — Provides asynchronous functions for fetching gym class data from the backend API.
- `frontend/src/hooks/useGymClasses.ts` — HOOK layer — Provides React Query hooks for fetching gym class data, abstracting service calls and managing caching.
- `frontend/src/types/gymClass.ts` — Generated from the backend API contract — Defines TypeScript interfaces for gym class data.
- `frontend/src/services/bookingService.ts` — SERVICE layer — Provides asynchronous functions for creating, viewing, and canceling class bookings via the backend API.
- `frontend/src/hooks/useBookings.ts` — HOOK layer — Provides React Query hooks for managing user class bookings, abstracting service calls and managing caching.
- `frontend/src/types/booking.ts` — Generated from the backend API contract — Defines TypeScript interfaces for class booking data.

**Feature Instruction:**

## Design Tokens
- Navbar: bg-[#1A1A1A] text-[#F5F5F5]
- Primary CTA: bg-[#DFFF00] hover:bg-[#B3CC00] text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200
- Brand text accent: text-[#DFFF00]
- Section bg: bg-[#F5F5F5] (odd sections) / bg-gray-100 (even sections)
- Card: bg-white rounded-xl shadow-md border border-gray-100 p-6
- Section container: <section className="py-16 px-4"><div className="max-w-7xl mx-auto">
- Hero h1: text-4xl md:text-6xl font-bold text-white
- Body: text-gray-700 leading-relaxed

This feature implements the frontend UI for displaying the gym class schedule and allowing users to book and manage their classes. It consists of a main schedule page, React Query hooks for data fetching and mutations, and frontend service layers that interact with the backend API. TypeScript types are defined to ensure strong typing throughout the application.

### SchedulePage.tsx
`SchedulePage.tsx` is the primary entry point for this feature. It will render an interactive weekly class schedule. The page will utilize the `Layout` component from `shared-ui` for consistent navigation and footer. The schedule will display classes grouped by day, showing details such as class name, time, trainer, and current booking status. Users will be able to filter classes (e.g., by date or trainer, though initial implementation focuses on weekly view). Each class entry will have a 'Book Now' or 'Cancel Booking' button, conditionally rendered based on user authentication and booking status.

**Page Sections and Content:**
1.  **Hero Section:**
    *   Background: `url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80)` with `<div className="absolute inset-0 bg-black bg-opacity-50" />` overlay.
    *   Headline: `<h1>Unleash Your Potential at MultiFit Aundh!</h1>` (text-4xl md:text-6xl font-bold text-white)
    *   Subheadline: `<p className="mt-4 text-xl text-white">Join our high-energy classes and transform your fitness journey.</p>`
2.  **Weekly Schedule Section:**
    *   Heading: `<h2 className="text-3xl font-bold text-[#1A1A1A] mb-8">Our Dynamic Class Schedule</h2>`
    *   A calendar navigation component (e.g., to select a week or day).
    *   A grid or list displaying classes for the selected week/day. Each class card will show `name`, `startTime`, `endTime`, `trainerName`, `currentBookings`, and `capacity`.
    *   Booking/Cancellation buttons: If a user is authenticated, a 'Book Now' button (Primary CTA style) will be shown if `currentBookings < capacity` and the user has not booked. If the user has booked, a 'Cancel Booking' button (e.g., bg-red-500) will be shown.
    *   Loading state: Display a spinner or skeleton loader while `useWeeklyGymClasses` and `useUserBookings` are fetching data.
    *   Error state: Display an error message if data fetching fails.

### Data Flow and Interaction
1.  `SchedulePage.tsx` will use the `useAuth` hook from `auth-flow` to check user authentication status and retrieve user details (specifically `userId`).
2.  `SchedulePage.tsx` will call `useWeeklyGymClasses(startDate, endDate)` to fetch the weekly class schedule. This hook, in turn, calls `gymClassService.getWeeklySchedule(startDate, endDate)`. `gymClassService` makes an `axios` GET request to `/api/v1/classes/weekly` on the `class-scheduling-be` backend.
3.  `SchedulePage.tsx` will also call `useUserBookings()` to fetch the currently logged-in user's bookings. This hook calls `bookingService.getUserBookings()`, which makes an `axios` GET request to `/api/v1/bookings/my-bookings` on the `class-scheduling-be` backend.
4.  When a user clicks 'Book Now', `SchedulePage.tsx` will call `useBookClass().mutate(classId)`. This mutation hook calls `bookingService.bookClass(classId)`, which makes an `axios` POST request to `/api/v1/classes/{classId}/book` on the `class-scheduling-be` backend.
5.  When a user clicks 'Cancel Booking', `SchedulePage.tsx` will call `useCancelBooking().mutate(bookingId)`. This mutation hook calls `bookingService.cancelBooking(bookingId)`, which makes an `axios` DELETE request to `/api/v1/bookings/{bookingId}` on the `class-scheduling-be` backend.
6.  All `axios` requests will use the `client` instance from `frontend/src/api/client.ts`, which includes an interceptor to attach the JWT token from `localStorage.getItem('token')` to authenticated requests.
7.  After successful booking or cancellation, the React Query caches for `useWeeklyGymClasses` and `useUserBookings` should be invalidated to refetch the latest data and update the UI.

### Type Definitions
- `gymClass.ts` defines the `GymClassDto` interface, mirroring the backend `GymClassDto` structure.
- `booking.ts` defines `UserPublicDto`, `BookingStatus`, and `ClassBookingDto` interfaces, mirroring the backend `ClassBookingDto` structure (with `gymClass` as `GymClassDto` and `user` as `UserPublicDto`). It also defines `CreateBookingRequest` for booking a class.

### Error Handling
- All service calls should include `try-catch` blocks to handle API errors. Errors should be propagated to the hooks and then to the UI for display (e.g., using `toast` notifications or inline error messages).
- Authentication errors (e.g., 401 Unauthorized) should be handled by the `client` interceptor, potentially redirecting to the login page.


---

## Frontend: Content Display (Trainers)

**Name:** `content-display-ui`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/pages/TrainersPage.tsx` — Public page displaying a list of gym trainers, using the `useAllTrainers` hook to fetch data and rendering them in a grid.
- `frontend/src/pages/TrainerDetailPage.tsx` — Public page displaying the detailed profile of a single gym trainer, using the `useTrainer` hook to fetch data based on the URL parameter.
- `frontend/src/services/contentService.ts` — Frontend service layer — implements `getAllTrainers(): Promise<Trainer[]>` to fetch all trainers and `getTrainerById(id: string): Promise<Trainer>` to fetch a single trainer from the backend.
- `frontend/src/hooks/useContent.ts` — React Query hooks for fetching trainer data, exposing `useAllTrainers()` for a list of trainers and `useTrainer(id: string)` for a single trainer.
- `frontend/src/types/content.ts` — Generated from the backend API contract — defines the TypeScript interface for Trainer data.

**Feature Instruction:**

## Design Tokens
- Navbar: bg-[#1A1A1A] text-[#F5F5F5]
- Primary CTA: bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200
- Brand text accent: text-[#DFFF00]
- Section bg: bg-[#1A1A1A]
- Card: bg-[#333333] rounded-xl shadow-md border border-gray-700 p-6 text-[#F5F5F5]
- Section container: <section className="py-16 px-4 bg-[#1A1A1A] text-[#F5F5F5]"><div className="max-w-7xl mx-auto">
- Hero h1: text-4xl md:text-6xl font-bold text-[#DFFF00]
- Body: text-[#F5F5F5] leading-relaxed

The `content-display-ui` feature is responsible for publicly displaying information about MultiFit Aundh's trainers. It consists of TypeScript types for trainer data, a frontend service to interact with the backend content API, React Query hooks for data fetching, and two public-facing pages: one for listing all trainers and one for displaying a single trainer's detailed profile. All UI components must adhere strictly to the provided design tokens and visual direction, emphasizing an energetic, bold, and modern aesthetic.

### `frontend/src/types/content.ts`
This file defines the TypeScript interface for `Trainer` objects, mirroring the `TrainerDto` structure from the `content-management-be` feature.

```

typescript
export interface Trainer {
  id: string;
  name: string;
  specialization: string;
  bio: string;
  photoUrl: string;
}


```

### `frontend/src/services/contentService.ts`
This service provides asynchronous functions to fetch trainer data from the `content-management-be` backend. It uses the `apiClient` from `frontend/src/api/client.ts` for HTTP requests.

1.  **`getAllTrainers(): Promise<Trainer[]>`**
    *   **Logic**: Makes a GET request to `/api/v1/content/trainers` using `apiClient.get<Trainer[]>('/api/v1/content/trainers')`.
    *   **Return Type**: `Promise<Trainer[]>`
    *   **Error Cases**: Throws an error if the API call fails (e.g., network error, 5xx status).

2.  **`getTrainerById(id: string): Promise<Trainer>`**
    *   **Logic**: Makes a GET request to `/api/v1/content/trainers/{id}` using `apiClient.get<Trainer>(`/api/v1/content/trainers/${id}`)`.
    *   **Return Type**: `Promise<Trainer>`
    *   **Error Cases**: Throws an error if the API call fails or if the trainer is not found (e.g., 404 response).

### `frontend/src/hooks/useContent.ts`
This file provides React Query hooks for efficient data fetching and caching of trainer information.

1.  **`useAllTrainers()`**
    *   **Signature**: `useAllTrainers(): UseQueryResult<Trainer[], Error>`
    *   **Logic**: Uses `react-query`'s `useQuery` hook.
        *   `queryKey`: `['trainers']`
        *   `queryFn`: `contentService.getAllTrainers`
    *   **Return Type**: A `UseQueryResult` object containing `data` (list of `Trainer`), `isLoading`, `isError`, `error`, etc.

2.  **`useTrainer(id: string)`**
    *   **Signature**: `useTrainer(id: string): UseQueryResult<Trainer, Error>`
    *   **Logic**: Uses `react-query`'s `useQuery` hook.
        *   `queryKey`: `['trainer', id]`
        *   `queryFn`: `() => contentService.getTrainerById(id)`
        *   `enabled`: `!!id` (only fetch if `id` is provided and truthy)
    *   **Return Type**: A `UseQueryResult` object containing `data` (single `Trainer`), `isLoading`, `isError`, `error`, etc.

### `frontend/src/pages/TrainersPage.tsx`
This page displays a grid of all trainers. It wraps its content in the `<Layout>` component from `shared-ui` and utilizes the `useAllTrainers` hook to fetch and display trainer data. Each trainer card links to their respective detail page.

**Structure:**
*   **Root Element**: `<Layout>`
*   **Hero Section**: This section provides a dynamic, motivational introduction to the trainers.
    *   `className`: `relative h-[400px] bg-cover bg-center text-white flex items-center justify-center`
    *   `style`: `backgroundImage: url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80')` (Gym/fitness image)
    *   Overlay: `<div className="absolute inset-0 bg-black bg-opacity-50" />`
    *   Content:
        *   `h1` with `className="relative z-10 text-4xl md:text-6xl font-bold text-[#DFFF00] text-center"`: "Meet Our Elite Trainers at MultiFit Aundh"
        *   `p` with `className="relative z-10 mt-4 text-lg md:text-xl text-[#F5F5F5] text-center max-w-2xl"`: "Our dedicated professionals are here to guide you to your fitness goals with expertise and passion."
*   **Trainers Grid Section**: This section displays all trainers in an organized grid.
    *   `className`: `py-16 px-4 bg-[#1A1A1A] text-[#F5F5F5]`
    *   Container: `<div className="max-w-7xl mx-auto">`
    *   Heading: `h2` with `className="text-3xl md:text-4xl font-bold text-[#DFFF00] text-center mb-12"`: "Our Expert Team"
    *   Loading State: If `isLoading` from `useAllTrainers` is true, display a loading spinner or a "Loading trainers..." message.
    *   Error State: If `isError` from `useAllTrainers` is true, display an error message like "Failed to load trainers: {error.message}".
    *   Trainers Grid: If `!isLoading` and `!isError` and `trainers` data is available:
        *   `className`: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`
        *   Map over `trainers` data. For each `trainer`:
            *   Render a card (`className="bg-[#333333] rounded-xl shadow-md border border-gray-700 p-6 text-[#F5F5F5] flex flex-col items-center text-center"`)
            *   Image: `img` with `src={trainer.photoUrl}`, `alt={trainer.name}`, `className="w-32 h-32 rounded-full object-cover mb-4 border-2 border-[#DFFF00]"`
            *   Name: `h3` with `className="text-xl font-semibold text-[#F5F5F5] mb-1"`: `{trainer.name}`
            *   Specialization: `p` with `className="text-[#DFFF00] mb-3"`: `{trainer.specialization}`
            *   Link to `TrainerDetailPage`: `Link` component from `react-router-dom` to `/trainers/${trainer.id}` with `className="mt-4 inline-block bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold rounded-full px-6 py-2 transition-all duration-200"`: "View Profile"

### `frontend/src/pages/TrainerDetailPage.tsx`
This page displays the detailed profile of a single trainer, identified by an `id` from the URL parameters. It wraps its content in the `<Layout>` component from `shared-ui` and uses the `useTrainer` hook to fetch the specific trainer's data.

**Structure:**
*   **Root Element**: `<Layout>`
*   **Hero Section**: This section features the trainer's name and specialization prominently.
    *   `className`: `relative h-[400px] bg-cover bg-center text-white flex items-center justify-center`
    *   `style`: `backgroundImage: url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80')` (Gym/fitness image)
    *   Overlay: `<div className="absolute inset-0 bg-black bg-opacity-50" />`
    *   Content:
        *   `h1` with `className="relative z-10 text-4xl md:text-6xl font-bold text-[#DFFF00] text-center"`: `{trainer.name}` (dynamic, if trainer data is available)
        *   `p` with `className="relative z-10 mt-4 text-lg md:text-xl text-[#F5F5F5] text-center max-w-2xl"`: `{trainer.specialization}` (dynamic, if trainer data is available)
*   **Trainer Detail Section**: This section presents the trainer's photo, bio, and specialization.
    *   `className`: `py-16 px-4 bg-[#1A1A1A] text-[#F5F5F5]`
    *   Container: `<div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start gap-8">`
    *   Loading State: If `isLoading` from `useTrainer` is true, display a loading spinner or a "Loading trainer details..." message.
    *   Error State: If `isError` from `useTrainer` is true, display an error message like "Failed to load trainer: {error.message}".
    *   Trainer Not Found: If `!trainer && !isLoading && !isError`, display a "Trainer not found." message.
    *   Trainer Content (if `trainer` exists):
        *   Image Column (`className="md:w-1/3 flex-shrink-0"`):
            *   `img` with `src={trainer.photoUrl}`, `alt={trainer.name}`, `className="w-full h-auto rounded-xl object-cover border-2 border-[#DFFF00]"`
        *   Details Column (`className="md:w-2/3"`):
            *   `h2` with `className="text-3xl font-bold text-[#DFFF00] mb-4"`: "About {trainer.name}"
            *   `p` with `className="text-lg leading-relaxed mb-6"`: `{trainer.bio}`
            *   `h3` with `className="text-2xl font-bold text-[#DFFF00] mb-3"`: "Specialization"
            *   `p` with `className="text-lg"`: `{trainer.specialization}`
            *   Back button: `Link` component from `react-router-dom` to `/trainers` with `className="mt-8 inline-block bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold rounded-full px-6 py-2 transition-all duration-200"`: "Back to Trainers"

---

## Frontend: Admin Portal

**Name:** `admin-portal`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/components/AdminLayout.tsx` — COMPONENT layer — provides a consistent layout for all admin pages, including a header and sidebar navigation.
- `frontend/src/pages/admin/AdminDashboardPage.tsx` — PAGE layer — serves as the main landing page for the admin portal, providing an overview and navigation links.
- `frontend/src/pages/admin/AdminMembershipsPage.tsx` — PAGE layer — provides an interface for administrators to manage (CRUD) membership plans.
- `frontend/src/pages/admin/AdminSchedulePage.tsx` — PAGE layer — provides an interface for administrators to manage (CRUD) gym class schedules.
- `frontend/src/pages/admin/AdminTrainersPage.tsx` — PAGE layer — provides an interface for administrators to manage (CRUD) trainer profiles.
- `frontend/src/pages/admin/AdminLeadsPage.tsx` — PAGE layer — provides an interface for administrators to view customer leads.
- `frontend/src/pages/admin/AdminTestimonialsPage.tsx` — PAGE layer — provides an interface for administrators to manage (CRUD) customer testimonials.

**Feature Instruction:**

## Design Tokens
- Admin Sidebar: bg-[#1A1A1A] text-[#F5F5F5]
- Admin Sidebar Active Link: bg-[#333333] text-[#DFFF00] font-bold
- Admin Header: bg-[#1A1A1A] text-[#F5F5F5]
- Admin Main Content Background: bg-gray-100
- Primary Button: bg-[#DFFF00] hover:bg-yellow-400 text-[#1A1A1A] font-semibold rounded-md px-4 py-2 transition-all duration-200
- Secondary Button: bg-[#333333] hover:bg-gray-700 text-[#F5F5F5] font-semibold rounded-md px-4 py-2 transition-all duration-200
- Danger Button: bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md px-4 py-2 transition-all duration-200
- Card/Panel: bg-white rounded-lg shadow-sm p-6
- Heading: text-2xl font-bold text-[#1A1A1A]
- Input Field: border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent

## Feature: Admin Portal
This feature provides the administrative interface for MultiFit Aundh, allowing authorized users (ADMIN role) to manage various aspects of the gym's operations, including membership plans, class schedules, trainer profiles, customer leads, and testimonials. All pages within this feature are protected by the `ProtectedRoute` from the `auth-flow` feature and utilize the `AdminLayout` component for consistent navigation and structure.

### AdminLayout.tsx
This component serves as the overarching layout for all admin pages. It provides a consistent header and a sidebar navigation. The header will display the business name "MultiFit Aundh Admin" and a logout button. The sidebar will contain links to the various admin management pages: Dashboard, Memberships, Schedule, Trainers, Leads, and Testimonials. Each navigation link should be styled according to the 'Admin Sidebar' and 'Admin Sidebar Active Link' design tokens. The `AdminLayout` component receives `children` as props, which will be the content of the specific admin page.

### AdminDashboardPage.tsx
This is the landing page for the admin portal. It will display a welcome message and provide quick links or summary statistics (e.g., total members, upcoming classes, new leads) to other management sections. The content should be structured using 'Card/Panel' design tokens for information display. No direct API calls are made from this page; it primarily serves as a navigation hub.

### AdminMembershipsPage.tsx
This page allows administrators to perform CRUD operations on `MembershipPlan` entities. It will display a table of existing membership plans, with options to view details, create new plans, edit existing plans, and delete plans. 

**Data Model:** `MembershipPlanDto` (id: UUID, name: String, description: String, price: BigDecimal, durationInMonths: Integer, isActive: Boolean)

**Operations:**
1.  **Fetch All Membership Plans:** On component mount, fetch all membership plans using `GET /api/v1/admin/memberships/plans`.
2.  **Create Membership Plan:** A form will be provided to create a new `MembershipPlan`. The form fields will correspond to `name`, `description`, `price`, `durationInMonths`, and `isActive`. Input validation will be handled using `react-hook-form` and `zod`. `price` will be a string input, converted to `z.coerce.number()` for validation. `durationInMonths` will be `z.coerce.number().positive()`. Upon submission, call `POST /api/v1/admin/memberships/plans` with the `CreateMembershipPlanRequest` body.
3.  **Update Membership Plan:** When editing, pre-fill the form with the existing `MembershipPlanDto` data. Upon submission, call `PUT /api/v1/admin/memberships/plans/{id}` with the `UpdateMembershipPlanRequest` body, where `{id}` is the UUID of the plan being updated.
4.  **Delete Membership Plan:** Provide a confirmation dialog before calling `DELETE /api/v1/admin/memberships/plans/{id}`.

### AdminSchedulePage.tsx
This page enables administrators to manage `GymClass` entities. It will display a list or calendar view of gym classes, with functionalities to create new classes, edit existing ones, and delete them.

**Data Model:** `GymClassDto` (id: UUID, name: String, description: String, date: LocalDate, startTime: LocalTime, endTime: LocalTime, capacity: Integer, currentBookings: Integer, trainerId: UUID, trainerName: String)

**Operations:**
1.  **Fetch All Gym Classes:** On component mount, fetch all gym classes using `GET /api/v1/admin/classes`.
2.  **Create Gym Class:** A form will be provided for creating a new `GymClass`. Fields include `name`, `description`, `date`, `startTime`, `endTime`, `capacity`, and `trainerId`. `date` will be a date picker, `startTime` and `endTime` time pickers, and `capacity` `z.coerce.number().positive()`. `trainerId` will be a dropdown populated by trainers fetched from `GET /api/v1/admin/trainers`. Input validation will use `react-hook-form` and `zod`. Upon submission, call `POST /api/v1/admin/classes` with the `CreateGymClassRequest` body.
3.  **Update Gym Class:** Pre-fill the form with existing `GymClassDto` data. Upon submission, call `PUT /api/v1/admin/classes/{classId}` with the `UpdateGymClassRequest` body, where `{classId}` is the UUID of the class being updated.
4.  **Delete Gym Class:** Provide a confirmation dialog before calling `DELETE /api/v1/admin/classes/{classId}`.

### AdminTrainersPage.tsx
This page allows administrators to manage `Trainer` profiles. It will display a list of trainers, with options to create new trainers, edit existing ones, and delete them.

**Data Model:** `TrainerDto` (id: UUID, name: String, specialization: String, bio: String, photoUrl: String)

**Operations:**
1.  **Fetch All Trainers:** On component mount, fetch all trainers using `GET /api/v1/admin/trainers`.
2.  **Create Trainer:** A form will be provided for creating a new `Trainer`. Fields include `name`, `specialization`, `bio`, and `photoUrl`. Input validation will use `react-hook-form` and `zod`. Upon submission, call `POST /api/v1/admin/trainers` with the `TrainerDto` body.
3.  **Update Trainer:** Pre-fill the form with existing `TrainerDto` data. Upon submission, call `PUT /api/v1/admin/trainers/{id}` with the `TrainerDto` body, where `{id}` is the UUID of the trainer being updated.
4.  **Delete Trainer:** Provide a confirmation dialog before calling `DELETE /api/v1/admin/trainers/{id}`.

### AdminLeadsPage.tsx
This page enables administrators to view `TrialLead` entries captured from the public-facing free trial form. It will display a list of leads with their details.

**Data Model:** `TrialLeadDto` (name: String, email: String, phone: String)

**Operations:**
1.  **Fetch All Trial Leads:** On component mount, fetch all trial leads using `GET /api/v1/admin/leads/trial`.
2.  **View Lead Details:** Allow viewing individual lead details, potentially by calling `GET /api/v1/admin/leads/trial/{id}`.

### AdminTestimonialsPage.tsx
This page allows administrators to manage `Testimonial` entries displayed on the website. It will display a list of testimonials, with options to create new testimonials, edit existing ones, and delete them.

**Data Model:** `Testimonial` (id: UUID, author: String, text: String, rating: Integer)

**Operations:**
1.  **Fetch All Testimonials:** On component mount, fetch all testimonials using `GET /api/v1/admin/testimonials`.
2.  **Create Testimonial:** A form will be provided for creating a new `Testimonial`. Fields include `author`, `text`, and `rating`. `rating` will be `z.coerce.number().min(1).max(5)`. Input validation will use `react-hook-form` and `zod`. Upon submission, call `POST /api/v1/admin/testimonials` with the `Testimonial` body.
3.  **Update Testimonial:** Pre-fill the form with existing `Testimonial` data. Upon submission, call `PUT /api/v1/admin/testimonials/{id}` with the `Testimonial` body, where `{id}` is the UUID of the testimonial being updated.
4.  **Delete Testimonial:** Provide a confirmation dialog before calling `DELETE /api/v1/admin/testimonials/{id}`.


---

## Infrastructure

**Name:** `infrastructure`  
**Type:** INFRA  
**Change required:** true

**Files in this feature:**
- `.github/workflows/ci.yml`

**Feature Instruction:**

_Not enriched (INFRA or skipped)._

---

