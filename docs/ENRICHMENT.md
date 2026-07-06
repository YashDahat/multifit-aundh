# Feature Enrichment — Attempt 1

Generated: 2026-07-06

Each section is one LLM call (~5–8K tokens). The instruction tells the generator how all files in the feature interact and what contracts they must honour.

---

## Shared Infrastructure (Backend)

**Name:** `shared-infra-backend`  
**Type:** SHARED  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/multifitaundh/exception/GlobalExceptionHandler.java` — Exception handler for the entire application, providing `handleResourceNotFoundException`, `handleValidationExceptions`, and `handleAllUncaughtExceptions` to return standardized `ErrorResponse` objects.
- `backend/src/main/java/com/multifitaundh/exception/ResourceNotFoundException.java` — Custom exception for resource not found scenarios, thrown by services when an entity cannot be located.
- `backend/src/main/java/com/multifitaundh/dto/ErrorResponse.java` — DTO for standardized API error responses, used by `GlobalExceptionHandler` to provide consistent error payloads.
- `backend/src/main/java/com/multifitaundh/controller/SpaController.java` — Controller to serve the React SPA's `index.html` for all non-API and non-static routes, enabling client-side routing.
- `backend/src/main/java/com/multifitaundh/config/DataSeeder.java` — Component for populating initial database data on application startup, implementing `CommandLineRunner`.

**Feature Instruction:**

The `shared-infra-backend` feature establishes core backend infrastructure components, including a robust exception handling mechanism, seamless integration with the frontend Single Page Application (SPA), and a system for populating initial database data.

1.  **Exception Handling**:
    This sub-feature ensures a consistent and informative error response structure across the entire API.
    *   `ResourceNotFoundException.java` is a custom `RuntimeException` that services should throw when a requested entity (e.g., `User`, `Membership`) cannot be found based on its identifier.
    *   `ErrorResponse.java` defines the standardized JSON payload for all API error responses. It includes the `timestamp` (as `java.time.LocalDateTime`), `status` (as `int`), `error` (as `String`, representing the HTTP status reason phrase), `message` (as `String`, providing a detailed error description), and `path` (as `String`, indicating the request URI).
    *   `GlobalExceptionHandler.java` is an `@RestControllerAdvice` component that acts as a centralized exception handler for the entire application.
        *   It contains an `@ExceptionHandler` method for `ResourceNotFoundException`, which maps this exception to an `ErrorResponse` with an HTTP status of `404 NOT_FOUND`. The `message` field of the `ErrorResponse` will contain the exception's message.
        *   It includes an `@ExceptionHandler` method for `org.springframework.web.bind.MethodArgumentNotValidException`, which is triggered when `@Valid` or `@Validated` annotations fail on controller method arguments. This handler constructs an `ErrorResponse` with an HTTP status of `400 BAD_REQUEST`, and its `message` field will aggregate all validation error details.
        *   A general `@ExceptionHandler` method for `java.lang.Exception` serves as a fallback for any other uncaught exceptions, returning an `ErrorResponse` with an HTTP status of `500 INTERNAL_SERVER_ERROR` and a generic error message, preventing sensitive internal details from being exposed to the client. Each handler method will return a `ResponseEntity<ErrorResponse>`.

2.  **SPA Routing**:
    This component facilitates the integration of the Spring Boot backend with the React SPA frontend.
    *   `SpaController.java` is a standard Spring `@Controller` (not `@RestController`). Its sole purpose is to serve the `index.html` file for all frontend routes.
    *   It defines a single `@GetMapping` method with the path `value = {"/", "/{path:[^\\.]*}"}`. This pattern ensures that requests to the root URL (`/`) and any URL that does not contain a file extension (e.g., `/login`, `/admin/dashboard`, but not `/assets/main.js`) are forwarded to `/index.html`. This allows the React Router to handle client-side routing. The method returns the `String` "forward:/index.html".

3.  **Data Seeding**:
    This component is responsible for initializing the database with essential baseline data required for the application's operation.
    *   `DataSeeder.java` is a Spring `@Component` that implements `org.springframework.boot.CommandLineRunner`. This interface mandates the implementation of a `run(String... args)` method, which Spring Boot automatically executes once the application context has been fully loaded.
    *   Within its `run` method, `DataSeeder` will inject and utilize repositories from other features (e.g., `MembershipRepository` from `membership-backend`, `GymClassRepository` from `scheduling-core-backend`) to persist initial entities such as default membership plans, predefined gym class types, or any other static configuration data. This ensures that the application has a functional dataset upon startup, particularly useful for development and testing environments.

---

## User Management (Backend)

**Name:** `user-management-backend`  
**Type:** SHARED  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/multifitaundh/model/User.java` — MODEL layer — Represents a user account, implementing Spring Security's UserDetails interface for authentication and authorization.
- `backend/src/main/java/com/multifitaundh/model/Role.java` — MODEL layer — Enum defining user roles (e.g., ROLE_USER, ROLE_ADMIN) for Spring Security authorization.
- `backend/src/main/java/com/multifitaundh/repository/UserRepository.java` — REPOSITORY layer — Provides data access operations for User entities, including finding users by email.
- `backend/src/main/java/com/multifitaundh/config/AdminInitializer.java` — CONFIG layer — Creates a default admin user on application startup if one doesn't exist, using UserRepository and PasswordEncoder.

**Feature Instruction:**

This feature defines the core user entity and role enumeration for the MultiFit Aundh application, integrating with Spring Security for authentication and authorization. It also includes an initializer to ensure a default administrator account exists upon application startup.

## Core Entities

**User.java** serves as the primary entity for user accounts. It implements Spring Security's `UserDetails` interface, providing the necessary methods for authentication and authorization. Each user has a unique `id`, `email`, `password` (hashed), `firstName`, `lastName`, and a collection of `roles`. The `email` field is used as the username for authentication.

**Role.java** is an enum defining the distinct roles within the application, specifically `ROLE_USER` and `ROLE_ADMIN`. These roles are used by Spring Security for access control.

## Data Persistence

**UserRepository.java** is a Spring Data JPA repository that provides standard CRUD operations for `User` entities. It also declares a custom query method, `findByEmail(String email)`, which is crucial for retrieving user details during the authentication process.

## Application Initialization

**AdminInitializer.java** is a `@Component` that implements Spring Boot's `CommandLineRunner` interface. Its `run` method is executed once the application context is loaded. This initializer is responsible for checking if an administrator user already exists in the database. If no user with the email 'admin@multifitaundh.com' is found, it proceeds to create a new `User` with the `ROLE_ADMIN` role. The password for this default admin user is 'admin123'. The initializer injects `UserRepository` to perform database operations and `PasswordEncoder` (expected to be provided by the `authentication-backend` feature's `SecurityConfig`) to securely hash the default password before saving the user.

### AdminInitializer.run() Logic:
1.  Check if a user with the email 'admin@multifitaundh.com' exists by calling `userRepository.findByEmail("admin@multifitaundh.com")`.
2.  If the `Optional<User>` returned is empty (i.e., no admin user exists):
    a.  Create a new `User` instance.
    b.  Set `email` to 'admin@multifitaundh.com'.
    c.  Set `password` to the result of `passwordEncoder.encode("admin123")`.
    d.  Set `firstName` to 'Admin'.
    e.  Set `lastName` to 'User'.
    f.  Add `Role.ROLE_ADMIN` to the user's `roles` collection.
    g.  Save the new admin user to the database using `userRepository.save(adminUser)`.
    h.  Log a message indicating the default admin user has been created.
3.  If an admin user already exists, log a message indicating that the default admin user already exists and no action is taken.

## Inter-Feature Interactions

*   This feature's `User` entity and `Role` enum are fundamental to the `authentication-backend` feature, which will use `UserRepository.findByEmail` in its `UserService` (implementing `UserDetailsService`) to load user details for authentication.
*   `AdminInitializer` depends on a `PasswordEncoder` bean, which is expected to be configured and exposed by the `authentication-backend` feature's `SecurityConfig`.

---

## Authentication (Backend)

**Name:** `authentication-backend`  
**Type:** SHARED  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/multifitaundh/service/UserService.java` — SERVICE layer — implements `UserDetailsService` and provides methods for user creation and retrieval, specifically `loadUserByUsername(String email): UserDetails` and `createUser(User user): User`.
- `backend/src/main/java/com/multifitaundh/controller/AuthController.java` — CONTROLLER layer — exposes REST API endpoints for user registration and authentication, specifically `registerUser(AuthRequest request): ResponseEntity<AuthResponse>` and `authenticateUser(AuthRequest request): ResponseEntity<AuthResponse>`.
- `backend/src/main/java/com/multifitaundh/dto/AuthRequest.java` — DTO — Data Transfer Object for user login and registration requests.
- `backend/src/main/java/com/multifitaundh/dto/AuthResponse.java` — DTO — Data Transfer Object for authentication responses, carrying the JWT.
- `backend/src/main/java/com/multifitaundh/util/JwtUtil.java` — UTILITY class — provides methods for generating, parsing, and validating JWTs, specifically `extractUsername(String token): String`, `generateToken(UserDetails userDetails): String`, and `validateToken(String token, UserDetails userDetails): boolean`.
- `backend/src/main/java/com/multifitaundh/security/JwtAuthFilter.java` — CONFIG layer — a Spring Security filter that intercepts requests, validates the JWT from the Authorization header, and sets the security context.
- `backend/src/main/java/com/multifitaundh/config/SecurityConfig.java` — CONFIG layer — configures Spring Security's filter chain, password encoder, and authentication manager, exposing `securityFilterChain(HttpSecurity http): SecurityFilterChain`, `passwordEncoder(): PasswordEncoder`, and `authenticationManager(AuthenticationConfiguration config): AuthenticationManager`.

**Feature Instruction:**

The `authentication-backend` feature provides robust user authentication and authorization capabilities using JSON Web Tokens (JWTs) for the MultiFit Aundh application. It encompasses user registration, login, JWT generation, validation, and integration with Spring Security.

## Core Flow:
1.  **User Registration/Login:** A user sends their credentials (email, password) to the `AuthController` via `/api/v1/auth/register` or `/api/v1/auth/login` endpoints. The request body is an `AuthRequest` DTO.
2.  **User Service Interaction:** The `AuthController` delegates to the `UserService` to either create a new user (for registration) or authenticate an existing user. The `UserService` interacts with the `UserRepository` (from `user-management-backend`) to persist or retrieve user data.
3.  **JWT Generation:** Upon successful authentication, the `UserService` (or `AuthController` after `UserService` confirms authentication) utilizes the `JwtUtil` to generate a new JWT. This token is then wrapped in an `AuthResponse` DTO and returned to the client.
4.  **Subsequent Request Authentication:** For all subsequent authenticated requests, the client includes the JWT in the `Authorization` header (e.g., `Bearer <token>`).
5.  **JWT Validation Filter:** The `JwtAuthFilter` intercepts these requests. It extracts the JWT from the header, validates it using `JwtUtil`, and then loads the `UserDetails` (User entity from `user-management-backend`) via `UserService.loadUserByUsername()`. If valid, the filter sets the authentication context in Spring Security, allowing the request to proceed to the intended controller.
6.  **Security Configuration:** The `SecurityConfig` class defines the overall security posture of the application. It configures the `JwtAuthFilter` to run before Spring Security's `UsernamePasswordAuthenticationFilter`, sets up a `BCryptPasswordEncoder` for secure password hashing, and defines authorization rules for different API paths (e.g., public, authenticated, admin-only).

## File Interactions:
*   `AuthController` injects `UserService` and `JwtUtil`.
*   `UserService` injects `UserRepository` (from `user-management-backend`) and `BCryptPasswordEncoder`.
*   `JwtAuthFilter` injects `JwtUtil` and `UserService`.
*   `SecurityConfig` configures `JwtAuthFilter`, `UserService` (as `UserDetailsService`), `BCryptPasswordEncoder`, and `AuthenticationManager`.

## Detailed Method Contracts:

### `UserService.java`
*   **`loadUserByUsername(String email): UserDetails`**
    1.  Attempts to find a `User` by `email` using `UserRepository.findByEmail(email)`.
    2.  If the user is not found, throws `UsernameNotFoundException`.
    3.  Returns the `User` entity (which implements `UserDetails`) if found.
*   **`createUser(User user): User`**
    1.  Checks if a user with the given email already exists using `UserRepository.findByEmail(user.getEmail())`.
    2.  If a user exists, throws `IllegalArgumentException` with a message like "User with email {email} already exists."
    3.  Encrypts the user's password using `BCryptPasswordEncoder.encode()`.
    4.  Saves the new `User` entity using `UserRepository.save(user)`.
    5.  Returns the saved `User` entity.

### `AuthController.java`
*   **`registerUser(@RequestBody @Valid AuthRequest request): ResponseEntity<AuthResponse>`**
    1.  Creates a new `User` object from the `AuthRequest` (setting `email` and `password`).
    2.  Calls `userService.createUser(user)`.
    3.  Upon successful creation, generates a JWT for the newly registered user using `jwtUtil.generateToken(user)`.
    4.  Returns `ResponseEntity.ok(new AuthResponse(token))` with HTTP status 200.
    5.  **Error Cases:**
        *   `IllegalArgumentException` (from `UserService`): Returns HTTP status 400 (Bad Request).
        *   `MethodArgumentNotValidException` (from `@Valid`): Handled by `GlobalExceptionHandler` returning HTTP status 400.
*   **`authenticateUser(@RequestBody @Valid AuthRequest request): ResponseEntity<AuthResponse>`**
    1.  Attempts to authenticate the user using `authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()))`.
    2.  If authentication fails (e.g., bad credentials), `BadCredentialsException` is thrown.
    3.  If authentication is successful, loads `UserDetails` using `userService.loadUserByUsername(request.getEmail())`.
    4.  Generates a JWT using `jwtUtil.generateToken(userDetails)`.
    5.  Returns `ResponseEntity.ok(new AuthResponse(token))` with HTTP status 200.
    6.  **Error Cases:**
        *   `BadCredentialsException`: Returns HTTP status 401 (Unauthorized).
        *   `MethodArgumentNotValidException` (from `@Valid`): Handled by `GlobalExceptionHandler` returning HTTP status 400.

### `JwtUtil.java`
*   **`extractUsername(String token): String`**
    1.  Parses the JWT and extracts the subject (which is the username/email).
*   **`generateToken(UserDetails userDetails): String`**
    1.  Creates claims including the subject (username/email) and any roles.
    2.  Sets expiration date (e.g., 24 hours from now).
    3.  Signs the token using `Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwt.secret))`.
    4.  Builds and returns the compact JWT string.
*   **`validateToken(String token, UserDetails userDetails): boolean`**
    1.  Extracts the username from the token.
    2.  Checks if the extracted username matches `userDetails.getUsername()`.
    3.  Checks if the token is expired.
    4.  Returns `true` if valid, `false` otherwise.
    5.  **Error Cases:** Throws `MalformedJwtException`, `ExpiredJwtException`, `UnsupportedJwtException`, `IllegalArgumentException` if token is invalid or malformed. These should be caught by the filter.

### `JwtAuthFilter.java`
*   **`doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain): void`**
    1.  Extracts the `Authorization` header.
    2.  If the header is present and starts with "Bearer ", extracts the JWT.
    3.  If a JWT is found and no authentication is currently set in the security context:
        a.  Extracts the username from the JWT using `jwtUtil.extractUsername(jwt)`.
        b.  Loads `UserDetails` using `userService.loadUserByUsername(username)`.
        c.  Validates the token using `jwtUtil.validateToken(jwt, userDetails)`.
        d.  If valid, creates a `UsernamePasswordAuthenticationToken` and sets it in the `SecurityContextHolder`.
    4.  Calls `filterChain.doFilter(request, response)` to pass the request to the next filter in the chain.

### `SecurityConfig.java`
*   **`securityFilterChain(HttpSecurity http): SecurityFilterChain`**
    1.  Disables CSRF: `.csrf(csrf -> csrf.disable())`.
    2.  Configures session management to be stateless: `.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))`.
    3.  Authorizes HTTP requests:
        *   `.requestMatchers("/api/v1/auth/**").permitAll()`
        *   `.requestMatchers("/api/v1/admin/**").hasRole("ADMIN")`
        *   `.requestMatchers("/api/**").authenticated()`
        *   `.anyRequest().permitAll()`
    4.  Adds `JwtAuthFilter` before `UsernamePasswordAuthenticationFilter`.
    5.  Builds and returns the `SecurityFilterChain`.
*   **`passwordEncoder(): PasswordEncoder`**
    1.  Returns a `BCryptPasswordEncoder` instance.
*   **`authenticationManager(AuthenticationConfiguration config): AuthenticationManager`**
    1.  Returns `config.getAuthenticationManager()`.

## DTOs:
*   `AuthRequest`: Used for user login and registration. Contains `email` and `password` fields with appropriate validation annotations.
*   `AuthResponse`: Used to return the generated `token` after successful authentication.

## Cross-Feature Contracts:
*   This feature consumes `UserRepository.findByEmail(String email): Optional<User>` from `user-management-backend`.
*   This feature consumes the `User` entity (which implements `UserDetails`) from `user-management-backend`.
*   This feature uses `GlobalExceptionHandler` from `shared-infra-backend` for handling exceptions like `MethodArgumentNotValidException`.

## Security Considerations:
*   Passwords are encrypted using `BCryptPasswordEncoder`.
*   JWT secret is configured in `application.properties` (e.g., `jwt.secret`).
*   Roles are managed using `ROLE_` prefix (e.g., `ROLE_ADMIN`) and checked using `hasRole()` in `SecurityConfig` and `@PreAuthorize` annotations.
*   Stateless session management is enforced for JWT-based authentication.

---

## Membership Management (Backend)

**Name:** `membership-backend`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/multifitaundh/model/Membership.java`
- `backend/src/main/java/com/multifitaundh/model/MembershipType.java`
- `backend/src/main/java/com/multifitaundh/model/UserMembership.java`
- `backend/src/main/java/com/multifitaundh/repository/MembershipRepository.java`
- `backend/src/main/java/com/multifitaundh/repository/UserMembershipRepository.java`
- `backend/src/main/java/com/multifitaundh/service/MembershipService.java`
- `backend/src/main/java/com/multifitaundh/controller/MembershipController.java`
- `backend/src/main/java/com/multifitaundh/controller/AdminMembershipController.java`
- `backend/src/main/java/com/multifitaundh/dto/MembershipDto.java`

**Feature Instruction:**

The Membership Management (Backend) feature provides a robust system for defining gym membership plans and managing user subscriptions. It consists of three core model entities: `Membership`, `MembershipType`, and `UserMembership`, along with their respective Spring Data JPA repositories, a service layer for business logic, and two REST controllers for public and administrative access.

## Models
1.  **`Membership.java`**: This JPA entity represents a distinct membership plan offered by MultiFit Aundh, such as 'Gold Monthly' or 'Annual Platinum'. It includes fields for `id` (UUID, primary key), `name` (String, unique, e.g., 'Gold Monthly'), `description` (String), `price` (BigDecimal), `durationInMonths` (Integer), `membershipType` (an enum of type `MembershipType`), and `isActive` (Boolean, indicating if the plan is currently offered). All fields except `id` and `isActive` are non-nullable.
2.  **`MembershipType.java`**: An enum defining the possible durations for membership plans: `MONTHLY`, `QUARTERLY`, `YEARLY`.
3.  **`UserMembership.java`**: This entity acts as a join table, linking a `User` (from the `user-management-backend` feature) to a purchased `Membership`. It tracks the individual user's subscription details, including `id` (UUID, primary key), `user` (ManyToOne relationship to `User`), `membership` (ManyToOne relationship to `Membership`), `startDate` (LocalDate), `endDate` (LocalDate), and `isCurrent` (Boolean, indicating if this is the user's currently active membership). All fields are non-nullable.

## Repositories
1.  **`MembershipRepository.java`**: A Spring Data JPA repository extending `JpaRepository<Membership, UUID>`. It provides standard CRUD operations for `Membership` entities and declares custom finder methods: `findByName(String name): Optional<Membership>` to retrieve a membership by its unique name, and `findAllByIsActiveTrue(): List<Membership>` to fetch all currently active membership plans.
2.  **`UserMembershipRepository.java`**: A Spring Data JPA repository extending `JpaRepository<UserMembership, UUID>`. It provides standard CRUD operations for `UserMembership` entities and declares custom finder methods: `findByUser_IdAndIsCurrentTrue(UUID userId): Optional<UserMembership>` to find a user's active membership, and `findAllByUser_Id(UUID userId): List<UserMembership>` to retrieve all past and current memberships for a specific user.

## DTO
1.  **`MembershipDto.java`**: A Data Transfer Object used for exposing `Membership` data via the API and for receiving input for creating/updating memberships. It mirrors the `Membership` entity's fields: `id` (UUID), `name` (String, `@NotBlank`), `description` (String, `@NotBlank`), `price` (BigDecimal, `@NotNull`, `@Positive`), `durationInMonths` (Integer, `@NotNull`, `@Positive`), `membershipType` (MembershipType, `@NotNull`), and `isActive` (Boolean).

## Service
1.  **`MembershipService.java`**: This service encapsulates the business logic for membership management. It is injected with `MembershipRepository` and `UserMembershipRepository`.
    *   **`getAllMemberships(): List<MembershipDto>`**: Retrieves all active membership plans, converting them to `MembershipDto`.
    *   **`getMembershipById(UUID id): MembershipDto`**: Fetches a single membership by its ID. Throws `ResourceNotFoundException` (from `shared-infra-backend`) if the membership is not found.
    *   **`createMembership(MembershipDto membershipDto): MembershipDto`**: Creates a new membership plan. Validates input using `@Valid` annotations on the DTO. Returns the created `MembershipDto`.
    *   **`updateMembership(UUID id, MembershipDto membershipDto): MembershipDto`**: Updates an existing membership plan identified by its ID. Throws `ResourceNotFoundException` if the membership is not found. Returns the updated `MembershipDto`.
    *   **`deleteMembership(UUID id): void`**: Deactivates a membership plan by setting `isActive` to `false`. Throws `ResourceNotFoundException` if the membership is not found.
    *   **`assignMembershipToUser(UUID userId, UUID membershipId): UserMembership`**: Assigns a specified membership to a user. It first checks if the user and membership exist (throwing `ResourceNotFoundException` if not). It also checks if the user already has an active membership, throwing `IllegalArgumentException` if so. It calculates the `startDate` (current date) and `endDate` based on the membership's `durationInMonths` and sets `isCurrent` to `true`.
    *   **`getCurrentUserMembership(UUID userId): Optional<UserMembership>`**: Retrieves the currently active membership for a given user ID.
    *   **`getAllUserMemberships(UUID userId): List<UserMembership>`**: Retrieves all past and current memberships for a given user ID.
    *   **`revokeUserMembership(UUID userMembershipId): void`**: Revokes a user's specific membership by setting `isCurrent` to `false` and updating the `endDate` to the current date. Throws `ResourceNotFoundException` if the `UserMembership` is not found.

## Controllers
1.  **`MembershipController.java`**: This is the public-facing REST controller for retrieving membership information. It is injected with `MembershipService`.
    *   **`getAllMemberships()`**: Handles `GET /api/v1/memberships`. Returns `ResponseEntity<List<MembershipDto>>` containing all active membership plans. This endpoint is publicly accessible.
    *   **`getMembershipById(UUID id)`**: Handles `GET /api/v1/memberships/{id}`. Returns `ResponseEntity<MembershipDto>` for a specific membership. This endpoint is publicly accessible.
2.  **`AdminMembershipController.java`**: This is the admin-only REST controller for performing CRUD operations on membership plans. It is injected with `MembershipService` and requires `ROLE_ADMIN` authority for all its endpoints, enforced by `@PreAuthorize("hasRole('ADMIN')")`.
    *   **`createMembership(@Valid @RequestBody MembershipDto membershipDto)`**: Handles `POST /api/v1/admin/memberships`. Creates a new membership plan. Returns `ResponseEntity<MembershipDto>` with HTTP status 201 (Created).
    *   **`updateMembership(@PathVariable UUID id, @Valid @RequestBody MembershipDto membershipDto)`**: Handles `PUT /api/v1/admin/memberships/{id}`. Updates an existing membership plan. Returns `ResponseEntity<MembershipDto>`.
    *   **`deleteMembership(@PathVariable UUID id)`**: Handles `DELETE /api/v1/admin/memberships/{id}`. Deactivates a membership plan. Returns `ResponseEntity<Void>` with HTTP status 204 (No Content).

## Error Handling
Both controllers utilize the `GlobalExceptionHandler` from `shared-infra-backend` to handle exceptions like `ResourceNotFoundException` (returning 404 Not Found) and `MethodArgumentNotValidException` (returning 400 Bad Request for DTO validation errors). `IllegalArgumentException` thrown by the service will result in a 400 Bad Request.

## Security Configuration
The `MembershipController` endpoints (`/api/v1/memberships/**`) should be configured in `SecurityConfig` (from `authentication-backend`) to be `permitAll()`. The `AdminMembershipController` endpoints (`/api/v1/admin/memberships/**`) must be secured with `hasRole("ADMIN")`.

---

## Class Scheduling Core (Backend)

**Name:** `scheduling-core-backend`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/multifitaundh/model/GymClass.java` — MODEL layer — defines the data structure for a gym class, including its name, description, duration, capacity, associated trainer, and image URL.
- `backend/src/main/java/com/multifitaundh/model/ClassSchedule.java` — MODEL layer — defines the data structure for a specific scheduled instance of a gym class, including its date, time, and booking capacity.
- `backend/src/main/java/com/multifitaundh/model/Booking.java` — MODEL layer — defines the data structure for a user's booking of a class schedule, including the user, schedule, booking time, and status.
- `backend/src/main/java/com/multifitaundh/model/BookingStatus.java` — MODEL layer — defines an enumeration for the possible states of a class booking.
- `backend/src/main/java/com/multifitaundh/repository/GymClassRepository.java` — REPOSITORY layer — provides standard CRUD operations for `GymClass` entities.
- `backend/src/main/java/com/multifitaundh/repository/ClassScheduleRepository.java` — REPOSITORY layer — provides standard CRUD operations for `ClassSchedule` entities.
- `backend/src/main/java/com/multifitaundh/repository/BookingRepository.java` — REPOSITORY layer — provides standard CRUD operations for `Booking` entities.

**Feature Instruction:**

The `scheduling-core-backend` feature establishes the foundational data models and persistence mechanisms for managing gym classes, class schedules, and user bookings. It comprises three core JPA entities: `GymClass`, `ClassSchedule`, and `Booking`, along with the `BookingStatus` enum. These entities are designed to be robust and interconnected, forming the backbone for class scheduling and reservation functionalities.

1.  **`GymClass.java`**: This entity defines the various types of fitness classes offered by MultiFit Aundh, such as 'Zumba' or 'CrossFit'. Each `GymClass` has a unique `name`, a `description`, a `durationMinutes`, and a `maxCapacity`. It also includes a `trainer` (a Many-to-One relationship with the `Trainer` entity from the `content-backend` feature) and an optional `imageUrl` for visual representation. The `name` must be unique.

2.  **`ClassSchedule.java`**: This entity represents a specific, scheduled instance of a `GymClass`. It links to a `GymClass` (Many-to-One relationship) and specifies the `date`, `startTime`, and `endTime` for that particular session. It also tracks the `currentBookings` and `maxCapacity` for this specific schedule, allowing for real-time availability checks. The `maxCapacity` for a schedule instance can be different from the `GymClass`'s default capacity.

3.  **`Booking.java`**: This entity records a user's reservation for a `ClassSchedule`. It establishes Many-to-One relationships with both the `User` entity (from the `user-management-backend` feature) and the `ClassSchedule` entity. Each booking includes a `bookingTime` (timestamp of the booking) and a `status` (managed by the `BookingStatus` enum).

4.  **`BookingStatus.java`**: This enum defines the possible states for a `Booking`, specifically `CONFIRMED` and `CANCELLED`.

5.  **Repositories**: `GymClassRepository`, `ClassScheduleRepository`, and `BookingRepository` are Spring Data JPA repositories. They extend `JpaRepository` and provide standard CRUD (Create, Read, Update, Delete) operations for their respective entities. No custom query methods are defined in this core feature; advanced querying will be handled by services in the `scheduling-api-backend` feature.

**Inter-file Wiring and Cross-Feature Contracts:**
*   `GymClass` entity is linked to `Trainer` entity from `content-backend` via a `@ManyToOne` relationship on `trainer_id`.
*   `ClassSchedule` entity is linked to `GymClass` entity via a `@ManyToOne` relationship on `gym_class_id`.
*   `Booking` entity is linked to `User` entity from `user-management-backend` via a `@ManyToOne` relationship on `user_id`.
*   `Booking` entity is linked to `ClassSchedule` entity via a `@ManyToOne` relationship on `class_schedule_id`.
*   `Booking` entity uses the `BookingStatus` enum defined within this feature.

All entities use `java.util.UUID` as their primary key type. Date and time fields use `java.time.LocalDate`, `java.time.LocalTime`, and `java.time.LocalDateTime` for precise temporal representation.

---

## Class Scheduling API (Backend)

**Name:** `scheduling-api-backend`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/multifitaundh/service/ClassScheduleService.java` — SERVICE layer — implements business logic for managing class schedules; provides methods for retrieving, creating, updating, and deleting class schedules, and fetching schedules by date range.
- `backend/src/main/java/com/multifitaundh/service/BookingService.java` — SERVICE layer — implements business logic for creating, canceling, and retrieving user bookings for classes; handles capacity checks and user-specific booking retrieval.
- `backend/src/main/java/com/multifitaundh/controller/ClassScheduleController.java` — CONTROLLER layer — exposes public REST endpoints for fetching class schedules.
- `backend/src/main/java/com/multifitaundh/controller/BookingController.java` — CONTROLLER layer — exposes authenticated REST endpoints for users to create, view, and cancel their bookings.
- `backend/src/main/java/com/multifitaundh/controller/AdminClassScheduleController.java` — CONTROLLER layer — exposes admin-only REST endpoints for CRUD operations on class schedules.
- `backend/src/main/java/com/multifitaundh/dto/ClassScheduleDto.java` — Data Transfer Object for ClassSchedule entities, used for exposing class schedule details via the API.
- `backend/src/main/java/com/multifitaundh/dto/BookingDto.java` — Data Transfer Object for Booking entities, used for exposing booking details via the API.

**Feature Instruction:**

The Class Scheduling API (Backend) feature provides a comprehensive set of functionalities for managing gym class schedules and user bookings. It consists of DTOs for data transfer, services for business logic, and controllers for exposing REST endpoints, catering to both public access and authenticated admin operations.

**1. Data Transfer Objects (DTOs):**
- `ClassScheduleDto.java`: Represents the data for a scheduled gym class, including details from the `GymClass` entity (name, description, duration, trainer) and the schedule itself (date, time, capacity, booked slots).
- `BookingDto.java`: Represents a user's booking for a specific class schedule, including booking ID, user ID, class schedule ID, booking time, and status.

**2. Services:**
- `ClassScheduleService.java`: Encapsulates the core business logic for class schedules. It interacts with `ClassScheduleRepository` (from `scheduling-core-backend`) to perform CRUD operations and retrieve schedules. It also needs to fetch `GymClass` details (from `scheduling-core-backend`) and `Trainer` details (from `content-backend`) when constructing `ClassScheduleDto` objects. It throws `ResourceNotFoundException` if a schedule is not found.
  - `getAllClassSchedules()`: Retrieves all scheduled classes.
  - `getClassScheduleById(UUID id)`: Retrieves a single scheduled class by its ID.
  - `createClassSchedule(ClassScheduleDto classScheduleDto)`: Creates a new class schedule. It must validate that the `gymClassId` exists.
  - `updateClassSchedule(UUID id, ClassScheduleDto classScheduleDto)`: Updates an existing class schedule. It must validate that the `gymClassId` exists.
  - `deleteClassSchedule(UUID id)`: Deletes a class schedule.
  - `getClassSchedulesByDateRange(LocalDate startDate, LocalDate endDate)`: Retrieves schedules within a specified date range.

- `BookingService.java`: Handles the business logic for user bookings. It interacts with `BookingRepository` and `ClassScheduleRepository` (both from `scheduling-core-backend`), and `UserRepository` (from `user-management-backend`). It ensures booking constraints like class capacity and preventing duplicate bookings.
  - `createBooking(UUID userId, UUID classScheduleId)`: Creates a new booking for a user for a specific class schedule. It must:
    1. Fetch the `User` by `userId` using `UserRepository.findById()`. Throw `ResourceNotFoundException` if not found.
    2. Fetch the `ClassSchedule` by `classScheduleId` using `ClassScheduleRepository.findById()`. Throw `ResourceNotFoundException` if not found.
    3. Check if the user already has a `CONFIRMED` booking for this `classScheduleId` using `BookingRepository.findByUserIdAndClassScheduleId()`. Throw `IllegalStateException` if a duplicate booking exists.
    4. Check if `classSchedule.bookedSlots < classSchedule.maxCapacity`. Throw `IllegalStateException` if the class is full.
    5. Increment `classSchedule.bookedSlots` and save the updated `ClassSchedule`.
    6. Create a new `Booking` entity with `CONFIRMED` status and save it using `BookingRepository.save()`.
    7. Return the created `BookingDto`.
  - `cancelBooking(UUID bookingId, UUID userId)`: Cancels an existing booking. It must:
    1. Fetch the `Booking` by `bookingId` using `BookingRepository.findById()`. Throw `ResourceNotFoundException` if not found.
    2. Verify that the `booking.user.id` matches the provided `userId`. Throw `IllegalStateException` if the user does not own the booking.
    3. Set `booking.status` to `CANCELLED` and save the updated `Booking`.
    4. Decrement `classSchedule.bookedSlots` for the associated `ClassSchedule` and save it.
  - `getUserBookings(UUID userId)`: Retrieves all bookings for a specific user.
  - `getBookingById(UUID bookingId, UUID userId)`: Retrieves a single booking by ID, ensuring the `userId` matches the booking owner.
  - `getAllBookings()`: Retrieves all bookings (for admin use).

**3. Controllers:**
- `ClassScheduleController.java`: Provides public API endpoints for fetching class schedules. All endpoints are publicly accessible.
- `BookingController.java`: Provides authenticated API endpoints for users to create, view, and cancel their own bookings. All endpoints require authentication.
- `AdminClassScheduleController.java`: Provides admin-only API endpoints for full CRUD operations on class schedules. All endpoints require the `ADMIN` role.

**4. Inter-file Wiring:**
- `ClassScheduleController` and `AdminClassScheduleController` inject `ClassScheduleService`.
- `BookingController` injects `BookingService`.
- `ClassScheduleService` injects `ClassScheduleRepository` (from `scheduling-core-backend`), `GymClassRepository` (from `scheduling-core-backend`), and `TrainerRepository` (from `content-backend`).
- `BookingService` injects `BookingRepository` (from `scheduling-core-backend`), `ClassScheduleRepository` (from `scheduling-core-backend`), and `UserRepository` (from `user-management-backend`).

**5. Security Configuration:**
- Endpoints under `/api/v1/schedules/**` (from `ClassScheduleController`) are `permitAll()`.
- Endpoints under `/api/v1/bookings/**` (from `BookingController`) are `authenticated()`.
- Endpoints under `/api/v1/admin/schedules/**` (from `AdminClassScheduleController`) require `hasRole("ADMIN")`.

**6. Error Handling:**
- Services will throw `ResourceNotFoundException` (from `shared-infra-backend`) for entities not found. Controllers will catch these and return a `404 NOT FOUND` response.
- Services will throw `IllegalStateException` for business rule violations (e.g., class full, duplicate booking). Controllers will catch these and return a `400 BAD REQUEST` or `409 CONFLICT` response.
- Controllers will use `@Valid` for DTOs and rely on `GlobalExceptionHandler` (from `shared-infra-backend`) for `MethodArgumentNotValidException` to return `400 BAD REQUEST`.

**7. DTO to Entity and Entity to DTO Conversion:**
- Services are responsible for converting DTOs received from controllers into entities for persistence, and converting entities retrieved from repositories into DTOs before returning them to controllers.

---

## Content Management (Backend)

**Name:** `content-backend`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/multifitaundh/model/Trainer.java` — MODEL layer — defines the data structure for a gym trainer, including their name, specializations, bio, and image URL.
- `backend/src/main/java/com/multifitaundh/model/Testimonial.java` — MODEL layer — defines the data structure for a customer testimonial, including author, quote, and a rating.
- `backend/src/main/java/com/multifitaundh/repository/TrainerRepository.java` — REPOSITORY layer — provides standard CRUD operations for `Trainer` entities.
- `backend/src/main/java/com/multifitaundh/repository/TestimonialRepository.java` — REPOSITORY layer — provides standard CRUD operations for `Testimonial` entities.
- `backend/src/main/java/com/multifitaundh/service/ContentService.java` — SERVICE layer — implements business logic for managing trainers and testimonials, including `getAllTrainers(): List<TrainerDto>`, `getTrainerById(UUID id): TrainerDto`, `createTrainer(TrainerDto trainerDto): TrainerDto`, `updateTrainer(UUID id, TrainerDto trainerDto): TrainerDto`, `deleteTrainer(UUID id): void`, and similar methods for testimonials.
- `backend/src/main/java/com/multifitaundh/controller/ContentController.java` — CONTROLLER layer — provides public REST API endpoints for fetching trainer and testimonial data.
- `backend/src/main/java/com/multifitaundh/controller/AdminContentController.java` — CONTROLLER layer — provides admin-only REST API endpoints for CRUD operations on trainers and testimonials, requiring `ROLE_ADMIN`.
- `backend/src/main/java/com/multifitaundh/dto/TrainerDto.java` — Data Transfer Object for Trainer entities, used for request and response bodies in the API layer.
- `backend/src/main/java/com/multifitaundh/dto/TestimonialDto.java` — Data Transfer Object for Testimonial entities, used for request and response bodies in the API layer.

**Feature Instruction:**

The Content Management (Backend) feature provides a robust API for managing and retrieving gym trainer profiles and customer testimonials. It consists of `Trainer` and `Testimonial` JPA entities, their respective Spring Data JPA repositories, a `ContentService` for business logic, and two REST controllers: `ContentController` for public access and `AdminContentController` for administrative CRUD operations.

## Data Models and DTOs
- `Trainer.java` is the JPA entity for gym trainers, storing their `id` (UUID), `name` (String), `specializations` (String, comma-separated), `bio` (String, max 1000 chars), and `imageUrl` (String).
- `Testimonial.java` is the JPA entity for customer testimonials, storing `id` (UUID), `author` (String), `quote` (String, max 1000 chars), and `rating` (Integer, 1-5).
- `TrainerDto.java` and `TestimonialDto.java` are Data Transfer Objects used for request and response bodies, mirroring the entity fields but including Jakarta Bean Validation annotations (`@NotBlank`, `@Size`, `@NotNull`, `@Min`, `@Max`) to ensure data integrity at the API boundary.

## Persistence Layer
- `TrainerRepository.java` extends `JpaRepository<Trainer, UUID>` to provide standard CRUD operations for `Trainer` entities.
- `TestimonialRepository.java` extends `JpaRepository<Testimonial, UUID>` to provide standard CRUD operations for `Testimonial` entities.

## Service Layer
- `ContentService.java` encapsulates the business logic. It is injected with `TrainerRepository` and `TestimonialRepository`.
- It provides methods for:
    - **Trainers:**
        - `List<TrainerDto> getAllTrainers()`: Retrieves all trainers, maps them to `TrainerDto`.
        - `TrainerDto getTrainerById(UUID id)`: Retrieves a trainer by ID. Throws `ResourceNotFoundException` if not found.
        - `TrainerDto createTrainer(TrainerDto trainerDto)`: Creates a new trainer from a DTO, saves it, and returns the saved DTO.
        - `TrainerDto updateTrainer(UUID id, TrainerDto trainerDto)`: Updates an existing trainer. Throws `ResourceNotFoundException` if the trainer ID does not exist. Updates `name`, `specializations`, `bio`, and `imageUrl`.
        - `void deleteTrainer(UUID id)`: Deletes a trainer by ID. Throws `ResourceNotFoundException` if not found.
    - **Testimonials:**
        - `List<TestimonialDto> getAllTestimonials()`: Retrieves all testimonials, maps them to `TestimonialDto`.
        - `TestimonialDto getTestimonialById(UUID id)`: Retrieves a testimonial by ID. Throws `ResourceNotFoundException` if not found.
        - `TestimonialDto createTestimonial(TestimonialDto testimonialDto)`: Creates a new testimonial from a DTO, saves it, and returns the saved DTO.
        - `TestimonialDto updateTestimonial(UUID id, TestimonialDto testimonialDto)`: Updates an existing testimonial. Throws `ResourceNotFoundException` if the testimonial ID does not exist. Updates `author`, `quote`, and `rating`.
        - `void deleteTestimonial(UUID id)`: Deletes a testimonial by ID. Throws `ResourceNotFoundException` if not found.

## API Layer
- `ContentController.java` handles public API requests for fetching trainers and testimonials. It is annotated with `@RestController` and `@RequestMapping("/api/v1/content")`. It injects `ContentService`.
    - Endpoints: `GET /api/v1/content/trainers`, `GET /api/v1/content/trainers/{id}`, `GET /api/v1/content/testimonials`, `GET /api/v1/content/testimonials/{id}`.
    - These endpoints are publicly accessible (permit all) and return `TrainerDto` or `TestimonialDto` lists/objects.
- `AdminContentController.java` handles administrative API requests for CRUD operations on trainers and testimonials. It is annotated with `@RestController`, `@RequestMapping("/api/v1/admin/content")`, and `@PreAuthorize("hasRole('ADMIN')")` to enforce admin-only access. It injects `ContentService`.
    - Endpoints: `POST /api/v1/admin/content/trainers`, `PUT /api/v1/admin/content/trainers/{id}`, `DELETE /api/v1/admin/content/trainers/{id}`, `POST /api/v1/admin/content/testimonials`, `PUT /api/v1/admin/content/testimonials/{id}`, `DELETE /api/v1/admin/content/testimonials/{id}`.
    - These endpoints require an authenticated user with the `ROLE_ADMIN` authority.

## Error Handling
- Both controllers will leverage the `GlobalExceptionHandler` from `shared-infra-backend` to handle `ResourceNotFoundException` (returning HTTP 404 Not Found) and `MethodArgumentNotValidException` (returning HTTP 400 Bad Request for DTO validation failures).

## Security Configuration
- The `SecurityConfig` (from `authentication-backend`) must be updated to permit all requests to `/api/v1/content/**` paths, while `/api/v1/admin/content/**` paths must be secured with `hasRole("ADMIN")`.

---

## Lead Capture (Backend)

**Name:** `lead-backend`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/multifitaundh/model/TrialLead.java` — MODEL layer — defines the data structure for a '3-Day Free Trial' lead, including its contact information and submission timestamp.
- `backend/src/main/java/com/multifitaundh/repository/TrialLeadRepository.java` — REPOSITORY layer — provides standard CRUD operations for `TrialLead` entities.
- `backend/src/main/java/com/multifitaundh/service/TrialLeadService.java` — SERVICE layer — implements `createTrialLead(CreateTrialLeadRequest): TrialLead` for public submission and `getAllTrialLeads(): List<TrialLead>` for admin retrieval.
- `backend/src/main/java/com/multifitaundh/controller/TrialLeadController.java` — Public REST controller — exposes `POST /api/v1/leads/trial` for submitting free trial forms.
- `backend/src/main/java/com/multifitaundh/controller/AdminTrialLeadController.java` — Admin-only REST controller — exposes `GET /api/v1/admin/leads/trial` for viewing all trial leads, secured with `hasRole('ADMIN')`.
- `backend/src/main/java/com/multifitaundh/dto/CreateTrialLeadRequest.java` — DTO — defines the request body structure for submitting a new trial lead.

**Feature Instruction:**

The `lead-backend` feature provides a backend API for capturing and managing '3-Day Free Trial' leads for MultiFit Aundh. It consists of a data model (`TrialLead`), a repository (`TrialLeadRepository`), a service layer (`TrialLeadService`) for business logic, and two controllers: one public (`TrialLeadController`) for lead submission and one admin-only (`AdminTrialLeadController`) for viewing leads. A DTO (`CreateTrialLeadRequest`) is used for public lead submission.

### Data Model (`TrialLead.java`)
This entity represents a single trial lead. It will have fields for `id` (UUID), `name` (String), `email` (String), `phone` (String), and `submissionDate` (LocalDateTime). All fields except `id` and `submissionDate` must be non-null.

### DTO (`CreateTrialLeadRequest.java`)
This DTO is used for receiving lead submission data from the frontend. It will contain `name`, `email`, and `phone` fields, all marked with `@NotBlank` and `email` with `@Email` for validation. The `phone` field should also have a `@Pattern` annotation for basic phone number validation (e.g., allowing digits and common separators).

### Repository (`TrialLeadRepository.java`)
This interface extends `JpaRepository<TrialLead, UUID>`, providing standard CRUD operations for `TrialLead` entities. No custom query methods are required for this feature.

### Service (`TrialLeadService.java`)
`TrialLeadService` encapsulates the business logic for trial leads. It will be injected with `TrialLeadRepository`.

1.  **`createTrialLead(CreateTrialLeadRequest request): TrialLead`**
    -   **Parameters:** `CreateTrialLeadRequest request`
    -   **Return Type:** `TrialLead`
    -   **Logic:**
        1.  Create a new `TrialLead` entity.
        2.  Map `request.getName()`, `request.getEmail()`, and `request.getPhone()` to the `TrialLead` entity.
        3.  Set `submissionDate` to `LocalDateTime.now()`.
        4.  Call `trialLeadRepository.save(trialLead)` to persist the entity.
        5.  Return the saved `TrialLead` entity.
    -   **Error Cases:** If validation fails at the controller level, a `MethodArgumentNotValidException` will be thrown and handled by `GlobalExceptionHandler` (from `shared-infra-backend`), returning HTTP 400.

2.  **`getAllTrialLeads(): List<TrialLead>`**
    -   **Parameters:** None
    -   **Return Type:** `List<TrialLead>`
    -   **Logic:**
        1.  Call `trialLeadRepository.findAll()`.
        2.  Return the list of `TrialLead` entities.
    -   **Error Cases:** None specific to this method; any database errors would propagate as internal server errors.

### Public Controller (`TrialLeadController.java`)
This controller exposes the public API for submitting trial leads. It will be injected with `TrialLeadService`.

1.  **`submitTrialLead(@Valid @RequestBody CreateTrialLeadRequest request): ResponseEntity<TrialLead>`**
    -   **HTTP Method:** `POST`
    -   **Path:** `/api/v1/leads/trial`
    -   **Logic:**
        1.  Call `trialLeadService.createTrialLead(request)`.
        2.  Return `ResponseEntity.status(HttpStatus.CREATED).body(createdLead)`.
    -   **Error Cases:** `MethodArgumentNotValidException` (HTTP 400) for invalid request body, handled by `GlobalExceptionHandler`.

### Admin Controller (`AdminTrialLeadController.java`)
This controller exposes admin-only API endpoints for managing trial leads. It will be injected with `TrialLeadService` and secured with `@PreAuthorize("hasRole('ADMIN')")`.

1.  **`getAllTrialLeads(): ResponseEntity<List<TrialLead>>`**
    -   **HTTP Method:** `GET`
    -   **Path:** `/api/v1/admin/leads/trial`
    -   **Logic:**
        1.  Call `trialLeadService.getAllTrialLeads()`.
        2.  Return `ResponseEntity.ok(leads)`.
    -   **Error Cases:** `AccessDeniedException` (HTTP 403) if the user does not have the ADMIN role.

### Security Configuration
In the `SecurityConfig` (from `authentication-backend`), the following authorization rules must be added:
-   `/api/v1/leads/trial` should be accessible to all (`permitAll()`).
-   `/api/v1/admin/leads/trial` should require the `ADMIN` role (`hasRole("ADMIN")`).

Example `SecurityConfig` snippet (ensure this is integrated correctly with existing rules):
```

java
.authorizeHttpRequests(auth -> auth
    .requestMatchers("/api/v1/auth/**").permitAll()
    .requestMatchers("/api/v1/leads/trial").permitAll()
    .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
    .requestMatchers("/api/**").authenticated()
    .anyRequest().permitAll()
)


```

---

## Payment Processing (Backend)

**Name:** `payment-backend`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/multifitaundh/model/Payment.java` — MODEL layer — defines the data structure for a payment transaction, linking to a UserMembership and tracking its status.
- `backend/src/main/java/com/multifitaundh/model/PaymentStatus.java` — MODEL layer — an enumeration defining the possible states of a payment transaction.
- `backend/src/main/java/com/multifitaundh/repository/PaymentRepository.java` — REPOSITORY layer — provides standard CRUD operations for `Payment` entities and custom query methods.
- `backend/src/main/java/com/multifitaundh/service/PaymentService.java` — SERVICE layer — implements `initiatePayment(UUID userMembershipId, BigDecimal amount, String currency)`: `PaymentOrderResponse` and `handlePaymentCallback(String paymentGatewayOrderId, String paymentGatewayTransactionId, PaymentStatus status)`: `Payment`.
- `backend/src/main/java/com/multifitaundh/controller/PaymentController.java` — CONTROLLER layer — exposes REST endpoints for initiating payments and receiving payment gateway callbacks.
- `backend/src/main/java/com/multifitaundh/dto/PaymentOrderResponse.java` — DTO layer — defines the data structure for the response returned to the frontend when a payment order is initiated.

**Feature Instruction:**

The Payment Processing (Backend) feature handles the lifecycle of payment transactions for user memberships. It consists of `Payment` and `PaymentStatus` models, `PaymentRepository` for persistence, `PaymentService` for business logic, `PaymentController` for exposing API endpoints, and `PaymentOrderResponse` as a DTO.

**1. Models (`Payment.java`, `PaymentStatus.java`):**
   - `Payment.java` is the JPA entity representing a single payment transaction. It stores details like the associated `UserMembership`, amount, currency, payment gateway order ID, transaction ID, and current `PaymentStatus`. It includes `createdAt` and `updatedAt` timestamps.
   - `PaymentStatus.java` is an enum defining the possible states of a payment: `PENDING`, `SUCCESS`, `FAILED`.

**2. Repository (`PaymentRepository.java`):**
   - `PaymentRepository` extends `JpaRepository` and provides standard CRUD operations for `Payment` entities. It also declares a custom finder method `findByPaymentGatewayOrderId(String orderId)` to retrieve a payment by the ID provided by the payment gateway.

**3. DTO (`PaymentOrderResponse.java`):**
   - `PaymentOrderResponse` is a Data Transfer Object used to send necessary payment initiation details back to the frontend. It includes the `orderId` from the payment gateway, `amount`, `currency`, and the `userMembershipId` and `userId` for context.

**4. Service (`PaymentService.java`):**
   - `PaymentService` encapsulates the core business logic for payment processing. It is responsible for:
     - **`initiatePayment(UUID userMembershipId, BigDecimal amount, String currency)`:**
       1.  It first retrieves the `UserMembership` entity using `membershipService.getUserMembershipById(userMembershipId)`. If the `UserMembership` is not found, it throws a `ResourceNotFoundException`.
       2.  It generates a unique `paymentGatewayOrderId` (e.g., using `UUID.randomUUID().toString()`).
       3.  A new `Payment` entity is created with `PENDING` status, linking to the fetched `UserMembership`, the provided `amount`, `currency`, and the generated `paymentGatewayOrderId`. The `paymentDate` is set to `Instant.now()`.
       4.  The new `Payment` entity is saved to the database via `paymentRepository.save()`.
       5.  Finally, it constructs and returns a `PaymentOrderResponse` containing the `paymentGatewayOrderId`, `amount`, `currency`, `userMembershipId`, and the `userId` from the `UserMembership`.
     - **`handlePaymentCallback(String paymentGatewayOrderId, String paymentGatewayTransactionId, PaymentStatus status)`:**
       1.  It retrieves the `Payment` entity using `paymentRepository.findByPaymentGatewayOrderId(paymentGatewayOrderId)`. If no payment is found, it throws a `ResourceNotFoundException`.
       2.  The retrieved `Payment` entity's `paymentGatewayTransactionId` and `status` are updated. The `updatedAt` timestamp is also updated.
       3.  If the `status` is `SUCCESS`, it calls `membershipService.activateUserMembership(payment.getUserMembership().getId(), payment.getPaymentDate(), payment.getUserMembership().getMembership().getDuration().calculateEndDate(payment.getPaymentDate()))` to activate the associated user membership. The `calculateEndDate` method on `MembershipType` enum (from `membership-backend`) is assumed to provide the correct end date based on the membership duration.
       4.  The updated `Payment` entity is saved to the database via `paymentRepository.save()`.
       5.  The updated `Payment` entity is returned.
   - `PaymentService` injects `PaymentRepository` for persistence and `MembershipService` (from the `membership-backend` feature) to interact with user memberships.

**5. Controller (`PaymentController.java`):**
   - `PaymentController` is a REST controller that exposes two API endpoints:
     - **`POST /api/v1/payments/initiate`:** This endpoint is used by the frontend to request the initiation of a payment. It expects `userMembershipId`, `amount`, and `currency` in the request body. It requires authentication. The controller extracts the authenticated user's ID and passes it along with other details to `paymentService.initiatePayment()`. It returns a `PaymentOrderResponse`.
     - **`POST /api/v1/payments/callback`:** This endpoint is designed to receive callbacks (webhooks) from payment gateways after a transaction is processed. It expects `paymentGatewayOrderId`, `paymentGatewayTransactionId`, and `status` in the request body. This endpoint does *not* require authentication, as it's called directly by the payment gateway. It delegates the processing to `paymentService.handlePaymentCallback()` and returns the updated `Payment` entity.
   - Error Handling: The controller uses `@ExceptionHandler` or relies on `GlobalExceptionHandler` (from `shared-infra-backend`) to handle `ResourceNotFoundException` by returning an HTTP 404 status.

---

## Email Notifications (Backend)

**Name:** `notification-backend`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/multifitaundh/service/EmailService.java` — SERVICE layer — implements methods for sending various transactional emails, including `sendWelcomeEmail(String, String)`, `sendBookingConfirmationEmail(String, String, String, String, String)`, `sendBookingCancellationEmail(String, String, String, String, String)`, and `sendMembershipConfirmationEmail(String, String, String, String, String)`.

**Feature Instruction:**

The `notification-backend` feature is responsible for sending various transactional emails to users of MultiFit Aundh. This feature contains a single service, `EmailService.java`, which encapsulates all email sending logic. It leverages Spring's `JavaMailSender` for sending emails and `SpringTemplateEngine` (Thymeleaf) for rendering dynamic HTML email templates.

## EmailService.java
This service provides methods to send specific types of transactional emails. It is designed to be injected into other backend services (e.g., `scheduling-api-backend`'s `BookingService` or `user-management-backend`'s `UserService`) to trigger email notifications upon relevant events.

**Dependencies:**
*   `JavaMailSender`: Spring's interface for sending emails.
*   `SpringTemplateEngine`: Used for processing Thymeleaf HTML templates to generate dynamic email content.

**Configuration:**
Email sending requires configuration in `application.properties` (or `application.yml`) for the `JavaMailSender`, including host, port, username, password, and protocol. Example:
```

properties
spring.mail.host=smtp.example.com
spring.mail.port=587
spring.mail.username=your_email@example.com
spring.mail.password=your_email_password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true


```

**Email Templates:**
HTML email templates should be located in `src/main/resources/templates/emails/`. Each email type will correspond to a specific template file (e.g., `welcome-email.html`, `booking-confirmation-email.html`). These templates will use Thymeleaf syntax to display dynamic content passed via the `Context` object.

**Public Methods:**

1.  **`sendWelcomeEmail(String toEmail, String userName)`**
    *   **Purpose:** Sends a welcome email to a newly registered user.
    *   **Logic:**
        1.  Create a `Context` object and add `userName` and `businessName` ("MultiFit Aundh") variables.
        2.  Process the `welcome-email.html` template using `templateEngine.process()` to generate the HTML email body.
        3.  Create a `MimeMessage` using `mailSender.createMimeMessage()`.
        4.  Initialize a `MimeMessageHelper` with the `MimeMessage`, setting `true` for multipart content to enable HTML.
        5.  Set the email's `from` address (e.g., "noreply@multifitaundh.com"), `to` address (`toEmail`), and `subject` (e.g., "Welcome to MultiFit Aundh, [userName]!").
        6.  Set the email's content using `helper.setText(htmlContent, true)`.
        7.  Send the email using `mailSender.send(message)`.
    *   **Error Cases:** Throws `jakarta.mail.MessagingException` if there's an issue with message construction, or `org.springframework.mail.MailException` if there's an issue during sending (e.g., connection problems).

2.  **`sendBookingConfirmationEmail(String toEmail, String userName, String className, String classDate, String classTime)`**
    *   **Purpose:** Sends a confirmation email after a user successfully books a class.
    *   **Logic:**
        1.  Create a `Context` object and add `userName`, `className`, `classDate`, `classTime`, and `businessName` ("MultiFit Aundh") variables.
        2.  Process the `booking-confirmation-email.html` template using `templateEngine.process()`.
        3.  Create and configure `MimeMessage` and `MimeMessageHelper` as described above.
        4.  Set the `subject` (e.g., "Your MultiFit Aundh Class Booking is Confirmed!").
        5.  Set the HTML content and send the email.
    *   **Error Cases:** Throws `jakarta.mail.MessagingException` or `org.springframework.mail.MailException`.

3.  **`sendBookingCancellationEmail(String toEmail, String userName, String className, String classDate, String classTime)`**
    *   **Purpose:** Notifies a user that their class booking has been cancelled.
    *   **Logic:**
        1.  Create a `Context` object and add `userName`, `className`, `classDate`, `classTime`, and `businessName` ("MultiFit Aundh") variables.
        2.  Process the `booking-cancellation-email.html` template using `templateEngine.process()`.
        3.  Create and configure `MimeMessage` and `MimeMessageHelper` as described above.
        4.  Set the `subject` (e.g., "MultiFit Aundh: Your Class Booking Has Been Cancelled").
        5.  Set the HTML content and send the email.
    *   **Error Cases:** Throws `jakarta.mail.MessagingException` or `org.springframework.mail.MailException`.

4.  **`sendMembershipConfirmationEmail(String toEmail, String userName, String membershipPlan, String startDate, String endDate)`**
    *   **Purpose:** Sends a confirmation email when a user purchases or renews a membership.
    *   **Logic:**
        1.  Create a `Context` object and add `userName`, `membershipPlan`, `startDate`, `endDate`, and `businessName` ("MultiFit Aundh") variables.
        2.  Process the `membership-confirmation-email.html` template using `templateEngine.process()`.
        3.  Create and configure `MimeMessage` and `MimeMessageHelper` as described above.
        4.  Set the `subject` (e.g., "Welcome to Your New MultiFit Aundh Membership, [userName]!").
        5.  Set the HTML content and send the email.
    *   **Error Cases:** Throws `jakarta.mail.MessagingException` or `org.springframework.mail.MailException`.

---

## Authentication UI

**Name:** `auth-ui`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/api/client.ts` — SERVICE layer — configures the global Axios instance (`axiosClient`) with base URL and interceptors for JWT handling and 401 error redirection.
- `frontend/src/context/AuthContext.tsx` — CONTEXT layer — provides `AuthContext` and `AuthProvider` for managing global authentication state, including `user`, `token`, `isAuthenticated`, `login`, `register`, and `logout` functions.
- `frontend/src/services/authService.ts` — SERVICE layer — provides `login(AuthRequest): Promise<AuthResponse>` and `register(AuthRequest): Promise<AuthResponse>` functions for interacting with the authentication backend.
- `frontend/src/hooks/useAuth.ts` — HOOK layer — provides `useAuth(): AuthContextType` for components to easily access the authentication context.
- `frontend/src/types/auth.ts` — Generated from the backend API contract — defines TypeScript interfaces for authentication request, response, and user data.
- `frontend/src/pages/LoginPage.tsx` — PAGE layer — renders the login form and handles user authentication via the `useAuth` hook.

**Feature Instruction:**

This feature provides the user interface and client-side logic for user authentication, including login and registration. It integrates with the `authentication-backend` feature for API calls and manages the authentication state globally using React Context.

## Design Tokens
- Page background: `bg-cover bg-center` with `background-image: url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80)` and `<div className="absolute inset-0 bg-black bg-opacity-50" />` overlay.
- Form container: `bg-[#1A1A1A] rounded-xl shadow-lg p-8 md:p-12 max-w-md w-full`
- Heading: `text-3xl md:text-4xl font-bold text-[#DFFF00] mb-6 text-center`
- Subheading/Body text: `text-[#F5F5F5]`
- Input fields: `bg-[#333333] text-[#F5F5F5] border border-[#333333] focus:border-[#DFFF00] rounded-md px-4 py-3 mb-4 w-full focus:outline-none`
- Primary CTA button: `bg-[#DFFF00] hover:bg-opacity-80 text-[#1A1A1A] font-bold py-3 px-6 rounded-md w-full transition-all duration-200`
- Link text: `text-[#DFFF00] hover:underline`

### 1. `frontend/src/types/auth.ts`
This file defines the TypeScript interfaces for authentication-related data structures. It will export `AuthRequest`, `AuthResponse`, and `AuthUser` interfaces, mirroring the backend DTOs.

### 2. `frontend/src/api/client.ts`
This file configures the global Axios instance (`axiosClient`) used for all API calls. It sets the `baseURL` to `/api/v1` and includes two interceptors:
1.  **Request Interceptor**: Before any request is sent, it checks `localStorage` for a JWT stored under the key `'token'`. If found, it adds an `Authorization` header with the format `Bearer <token>` to the request.
2.  **Response Interceptor**: It intercepts responses and specifically handles `401 Unauthorized` errors. If a 401 is received, it clears the `'token'` from `localStorage` and redirects the user to the `/login` page.

### 3. `frontend/src/services/authService.ts`
This service provides functions to interact with the `authentication-backend` API. It uses the `axiosClient` from `frontend/src/api/client.ts` and the types from `frontend/src/types/auth.ts`.
-   **`login(credentials: AuthRequest): Promise<AuthResponse>`**
    -   **Logic**: Sends a POST request to `/auth/login` with the provided `credentials` (email and password).
    -   **Returns**: A Promise resolving to `AuthResponse` on success.
    -   **Errors**: Throws an error if the API call fails (e.g., invalid credentials).
-   **`register(userData: AuthRequest): Promise<AuthResponse>`**
    -   **Logic**: Sends a POST request to `/auth/register` with the provided `userData` (email and password).
    -   **Returns**: A Promise resolving to `AuthResponse` on success.
    -   **Errors**: Throws an error if the API call fails (e.g., email already exists).

### 4. `frontend/src/context/AuthContext.tsx`
This file defines the `AuthContext` and `AuthProvider` component to manage the global authentication state. The `AuthProvider` wraps the application (or relevant parts) and makes the authentication state and functions available to its children.
-   **State**: Manages `user: AuthUser | null`, `token: string | null`, and `isAuthenticated: boolean`.
-   **Initialization**: On component mount, it attempts to load the token from `localStorage` (key: `'token'`). If a token is found, it decodes it (or makes a backend call to validate/fetch user details if a more robust approach is needed, but for simplicity, assume token presence implies authentication and user info can be derived or fetched later) and sets the initial `user` and `token` state.
-   **`login(email: string, password: string): Promise<void>`**
    1.  Calls `authService.login({ email, password })`.
    2.  On success, stores the received `token` in `localStorage` under the key `'token'`.
    3.  Updates the `user`, `token`, and `isAuthenticated` state.
    4.  Handles errors by setting an error state or throwing.
-   **`register(email: string, password: string): Promise<void>`**
    1.  Calls `authService.register({ email, password })`.
    2.  On success, stores the received `token` in `localStorage` under the key `'token'`.
    3.  Updates the `user`, `token`, and `isAuthenticated` state.
    4.  Handles errors by setting an error state or throwing.
-   **`logout(): void`**
    1.  Clears the `'token'` from `localStorage`.
    2.  Resets `user`, `token`, and `isAuthenticated` state to `null` and `false` respectively.

### 5. `frontend/src/hooks/useAuth.ts`
This custom React hook provides a convenient way for functional components to access the authentication context. It simply calls `useContext(AuthContext)` and returns the context value.

### 6. `frontend/src/pages/LoginPage.tsx`
This page renders the user login form. It uses the `useAuth` hook to access the `login` function and authentication state.
-   **UI Structure**: The page should have a full-screen background image (using the provided Unsplash URL for gym images) with a dark overlay. A central, dark-themed form container will house the login form.
-   **Form Fields**: Includes input fields for `email` and `password`.
-   **Form Submission**: On submission, it calls `useAuth().login(email, password)`. If successful, it redirects the user to the `/` (home) page or a dashboard page. If there's an error, it displays an appropriate message.
-   **Redirection**: If `useAuth().isAuthenticated` is already `true`, the page should immediately redirect the user away (e.g., to the home page) to prevent authenticated users from seeing the login form.
-   **Styling**: All elements on this page must strictly adhere to the Design Tokens defined above, using Tailwind CSS classes for colors, fonts, and spacing.

---

## Core UI & Pages

**Name:** `core-ui`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/App.tsx` — Main application component responsible for setting up client-side routing and providing global authentication context.
- `frontend/src/components/Layout.tsx` — Root layout component for public-facing pages, providing consistent header, footer, and content wrapper.
- `frontend/src/components/Header.tsx` — Navigation header component for the public site, displaying the brand logo and main navigation links, dynamically adjusting for authentication status.
- `frontend/src/components/Footer.tsx` — Footer component for the public site, displaying business contact information, social links, and an embedded Google Map.
- `frontend/src/components/ProtectedRoute.tsx` — A higher-order component that enforces authentication and optional role-based authorization for specific routes.
- `frontend/src/pages/HomePage.tsx` — Landing page of the application, designed to engage visitors with a high-energy introduction, calls to action, and integrated lead/content components.
- `frontend/src/pages/AboutPage.tsx` — Information page detailing the gym's philosophy, facilities through a virtual tour, and introducing the team.
- `frontend/src/pages/ContactPage.tsx` — Page providing comprehensive contact details, a contact form, and an embedded map for the gym's location.
- `frontend/src/components/WhatsAppCTA.tsx` — Floating action button component that provides a direct link to the business's WhatsApp for quick inquiries.

**Feature Instruction:**

## Design Tokens
- Navbar: bg-[#1A1A1A] text-[#F5F5F5]
- Primary CTA: bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-bold rounded-full px-8 py-3 transition-all duration-200 shadow-lg
- Secondary CTA: bg-[#333333] hover:bg-[#1A1A1A] text-[#F5F5F5] font-semibold rounded-full px-6 py-2 transition-all duration-200
- Brand text accent: text-[#DFFF00]
- Section bg: bg-[#F5F5F5] (odd sections) / bg-gray-100 (even sections)
- Card: bg-white rounded-xl shadow-md border border-gray-100 p-6
- Section container: <section className="py-16 px-4 md:py-24"><div className="max-w-7xl mx-auto">
- Hero h1: text-4xl md:text-6xl font-extrabold text-[#F5F5F5] leading-tight
- Hero subheadline: text-xl md:text-2xl text-[#F5F5F5] opacity-90 mt-4
- Body: text-[#333333] leading-relaxed
- Footer bg: bg-[#1A1A1A] text-[#F5F5F5]

This feature provides the core UI components and public-facing pages for the MultiFit Aundh application. It establishes the main application structure, routing, and shared layout elements, ensuring a consistent and energetic user experience across the site.

### App.tsx
`App.tsx` is the main entry point for the React application, responsible for setting up client-side routing using `react-router-dom` and providing global authentication context. It wraps the entire application with `AuthContext.AuthProvider` from the `auth-ui` feature to manage user authentication state. The application defines several routes:
1.  **Public Routes:** Paths like `/`, `/memberships`, `/schedule`, `/trainers`, `/trainers/:id`, `/contact`, `/about`, and `/login` are rendered within the `Layout` component. These routes are accessible to all users.
2.  **Admin Routes:** Paths starting with `/admin` (e.g., `/admin`, `/admin/*`) are rendered within the `AdminLayout` component (from `admin-portal-shell` feature) and are protected by the `ProtectedRoute` component. The `ProtectedRoute` ensures that only authenticated users with the 'ADMIN' role can access these routes. The `allowedRoles` prop for admin routes should be `['ADMIN']`.
3.  **Login Route:** The `/login` route is a public route and should not be wrapped by `ProtectedRoute`.

### Layout.tsx
`Layout.tsx` serves as the primary layout component for all public-facing pages. It receives `children` as a prop and renders the `Header` component at the top, followed by a `main` HTML element containing the `children` (the page content), and finally the `Footer` component at the bottom. The `WhatsAppCTA` component is also rendered within the `Layout` to ensure it appears consistently on all public pages, providing easy access to WhatsApp support.

### Header.tsx
`Header.tsx` implements the site-wide navigation bar. It displays the brand logo, "MultiFit Aundh", with "MultiFit" in `text-[#DFFF00]` and "Aundh" in `text-[#F5F5F5]`. It includes primary navigation links to `Home` (`/`), `Memberships` (`/memberships`), `Schedule` (`/schedule`), `Trainers` (`/trainers`), `About` (`/about`), and `Contact` (`/contact`). The header dynamically displays authentication-related links based on the user's login status, which is determined by calling `useAuth()` from the `auth-ui` feature. If a user is authenticated, a "Dashboard" link (`/admin`) and a "Logout" button (which calls `AuthContext.logout()`) are shown. If not authenticated, a "Login" link (`/login`) is displayed. The header must be responsive, featuring a hamburger menu for mobile viewports and a full navigation bar for desktop.

### Footer.tsx
`Footer.tsx` provides the site-wide footer, displaying essential business information and navigation. It includes:
-   The business name: "MultiFit Aundh"
-   The full address: "Multifit Aundh , D.P. Road Medipoint Hospital Road, opp. to Indian Bank, Aundh, Pune, Maharashtra 411067"
-   Phone number: "075070 08009"
-   Opening hours: "Mon-Sat: 6 AM - 10 PM | Sun: 8 AM - 6 PM"
-   Social media links (placeholder icons for Facebook, Instagram, YouTube).
-   A large embedded Google Map, centered on the coordinates `18.562876, 73.799898` (for MultiFit Aundh, Pune). The map embed should use an iframe with the `src` attribute pointing to `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=18.562876,73.799898` (API key should be an environment variable).

### ProtectedRoute.tsx
`ProtectedRoute.tsx` is a higher-order component designed to restrict access to routes based on the user's authentication status and roles. It accepts `children: React.ReactNode` and an optional `allowedRoles?: string[]` prop. It utilizes the `useAuth()` hook from the `auth-ui` feature to retrieve `isAuthenticated`, `userRole`, and `isLoading` status. If `isLoading` is true, it renders a loading indicator. If the user is not `isAuthenticated`, they are redirected to the `/login` page. If `allowedRoles` are specified and the `userRole` does not match any of the allowed roles, the user is redirected to the home page (`/`). Otherwise, it renders its `children` components.

### HomePage.tsx
`HomePage.tsx` is the landing page, designed to be energetic and action-oriented. It consists of several key sections:
1.  **Hero Section:** A full-width section (`className="relative h-[60vh] md:h-[80vh] flex items-center justify-center text-center"`) with a dynamic background image (`https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80`) and a `bg-black bg-opacity-50` overlay. It features a bold headline "Unleash Your Potential at MultiFit Aundh" (using `Hero h1` token) and a subheadline "Experience high-energy workouts, expert trainers, and a supportive community." (using `Hero subheadline` token). A prominent "Start Your Free 3-Day Trial" CTA (using `Primary CTA` token) links to the trial form section (`#trial-form`).
2.  **Trial Form Section:** This section (`className="bg-[#F5F5F5] py-16 px-4 md:py-24"`) includes a heading "Claim Your Free 3-Day Trial" and a subheading "Experience MultiFit Aundh firsthand. No commitments, just pure fitness." It renders the `TrialForm` component from the `lead-ui` feature.
3.  **Testimonials Section:** This section (`className="bg-gray-100 py-16 px-4 md:py-24"`) features a heading "Hear From Our Thriving Community" and renders the `TestimonialsSection` component from the `content-ui` feature.
4.  **Class Highlights Section:** This section (`className="bg-[#F5F5F5] py-16 px-4 md:py-24"`) has a heading "Our Signature Classes" and a subheading "From high-intensity interval training to calming yoga, find your perfect fit." It includes placeholder cards showcasing popular classes.

### AboutPage.tsx
`AboutPage.tsx` provides detailed information about MultiFit Aundh's philosophy and facilities:
1.  **Hero Section:** Similar to the home page, with a background image (`https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80`) and `bg-black bg-opacity-50` overlay. The headline is "Our Story: More Than Just a Gym" and the subheadline is "Discover the MultiFit Aundh philosophy and what drives our passion for fitness."
2.  **Philosophy Section:** (`className="bg-[#F5F5F5] py-16 px-4 md:py-24"`) Features a heading "Our Philosophy: Empowering Your Fitness Journey" and body text describing the gym's values, community focus, expert guidance, and holistic well-being approach.
3.  **Virtual Tour Section:** (`className="bg-gray-100 py-16 px-4 md:py-24"`) Includes a heading "Explore Our State-of-the-Art Facility" and a subheading "Take a 360-degree virtual tour of MultiFit Aundh." It contains a placeholder iframe for an embedded virtual tour video (e.g., from YouTube).
4.  **Team Intro Section:** (`className="bg-[#F5F5F5] py-16 px-4 md:py-24"`) Presents a heading "Meet Our Expert Trainers" and a subheading "Dedicated professionals committed to your success." It includes placeholder cards for trainer profiles (images, names, specializations).

### ContactPage.tsx
`ContactPage.tsx` provides all necessary contact information and methods for MultiFit Aundh:
1.  **Hero Section:** Features a background image (`https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80`) with a `bg-black bg-opacity-50` overlay. The headline is "Get in Touch with MultiFit Aundh" and the subheadline is "We're here to answer your questions and help you start your fitness journey."
2.  **Contact Info Section:** (`className="bg-[#F5F5F5] py-16 px-4 md:py-24"`) Includes a heading "Visit Us or Give Us a Call" and displays the business address, phone number, and opening hours.
3.  **Contact Form Section:** (`className="bg-gray-100 py-16 px-4 md:py-24"`) Contains a heading "Send Us a Message" and a placeholder contact form with fields for Name, Email, Subject, and Message, along with a submit button.
4.  **Google Map Section:** (`className="py-16 px-4 md:py-24"`) Features a heading "Find Us Easily" and a large embedded Google Map, identical to the one in the footer, showing the gym's location.

### WhatsAppCTA.tsx
`WhatsAppCTA.tsx` is a floating action button that provides a direct link to the MultiFit Aundh WhatsApp number. It is positioned fixed at the bottom-right of the viewport (`bottom-4 right-4`), styled with a WhatsApp green background (`bg-[#25D366]`), white text, rounded shape, and a shadow. The button contains a WhatsApp logo icon and links to `https://wa.me/917507008009` (using the business phone number, prepending `91` for India).


---

## Lead Capture UI

**Name:** `lead-ui`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/components/TrialForm.tsx`
- `frontend/src/services/leadService.ts`
- `frontend/src/hooks/useLeads.ts`
- `frontend/src/types/lead.ts`

**Feature Instruction:**

## Design Tokens
- Primary CTA: bg-[#DFFF00] hover:bg-[#DFFF00]/90 text-[#1A1A1A] font-bold rounded-full px-8 py-3 transition-all duration-200
- Secondary CTA: bg-[#333333] hover:bg-[#1A1A1A] text-[#F5F5F5] font-semibold rounded-full px-6 py-2 transition-all duration-200
- Brand text accent: text-[#DFFF00]
- Background dark: bg-[#1A1A1A]
- Text light: text-[#F5F5F5]
- Input field: bg-gray-700 text-white border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent
- Error text: text-red-500 text-sm
- Success text: text-green-500 text-sm

The `lead-ui` feature provides a user interface for capturing trial lead information for MultiFit Aundh's "3-Day Free Trial" offer. It consists of a reusable `TrialForm` component, a frontend service `leadService` for API interaction, a React Query hook `useLeads` for managing data submission, and TypeScript types defined in `lead.ts`.

The `TrialForm` component (`frontend/src/components/TrialForm.tsx`) is a self-contained React component designed to collect a potential member's `name`, `email`, and `phoneNumber`. It leverages `react-hook-form` for efficient form management and `zod` for robust client-side validation, ensuring that all fields are required and correctly formatted. Upon submission, the form calls the `mutate` function provided by the `useSubmitTrialLead` mutation hook from `frontend/src/hooks/useLeads.ts`. The form provides immediate feedback to the user, displaying success messages upon successful submission or clear error messages if the submission fails. It is styled using Tailwind CSS, adhering strictly to the provided design tokens to maintain a bold, energetic, and modern aesthetic consistent with MultiFit Aundh's brand. The form's heading will be "Claim Your 3-Day Free Trial!" and the call-to-action copy on the submit button will be "Start Your Fitness Journey!", both motivational and direct, encouraging users to take the first step towards a fitter lifestyle.

The `leadService` (`frontend/src/services/leadService.ts`) acts as the intermediary between the frontend application and the `lead-backend` API. It exports an asynchronous function `submitTrialLead(data: CreateTrialLeadRequest): Promise<TrialLead>` which makes a `POST` request to the `/api/v1/leads/trial` endpoint. This service utilizes the shared `axios` instance from `frontend/src/api/client.ts` for making HTTP requests and handles potential API errors by throwing them for the calling hook to catch.

The `useLeads` hook (`frontend/src/hooks/useLeads.ts`) provides a `useSubmitTrialLead` React Query mutation hook. This hook encapsulates the logic for submitting trial lead data, managing loading states, and handling success or error responses. It calls `leadService.submitTrialLead` internally. Upon a successful submission, it can trigger UI updates or notifications, and will reset the form. In case of an error, it will expose the error for display.

The `lead.ts` file (`frontend/src/types/lead.ts`) defines the TypeScript interfaces `CreateTrialLeadRequest` and `TrialLead`. These types precisely mirror the data structures expected by and returned from the `lead-backend`'s `/api/v1/leads/trial` endpoint, ensuring type safety across the frontend application. `CreateTrialLeadRequest` includes `name: string`, `email: string`, and `phoneNumber: string`. `TrialLead` includes `id: string`, `name: string`, `email: string`, `phoneNumber: string`, and `submissionDate: string`.

**Interaction Flow:**
1.  A user interacts with the `TrialForm.tsx` component, filling in their name, email, and phone number.
2.  Upon form submission, `TrialForm.tsx` invokes the `mutate` function returned by `useSubmitTrialLead` from `useLeads.ts`, passing the validated form data.
3.  `useSubmitTrialLead` then calls `leadService.submitTrialLead(data)`.
4.  `leadService.submitTrialLead` makes an `axios.post` call to the `lead-backend`'s `/api/v1/leads/trial` endpoint with the `CreateTrialLeadRequest` data.
5.  The backend processes the request and returns a `TrialLead` object upon success, or an error response.
6.  The `useSubmitTrialLead` hook receives the response. If successful, it updates its `isSuccess` state and `TrialForm.tsx` displays a success message and resets the form. If an error occurs, `isError` is set, and `TrialForm.tsx` displays an appropriate error message to the user.

---

## Content Display UI

**Name:** `content-ui`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/components/TestimonialsSection.tsx` — React component to display a carousel of customer testimonials, highlighting the high Google rating; consumes data via `useTestimonials()` from `frontend/src/hooks/useContent.ts`.
- `frontend/src/services/contentService.ts` — Frontend service layer — implements `fetchTrainers(): Promise<Trainer[]>`, `fetchTrainerById(id: string): Promise<Trainer>`, and `fetchTestimonials(): Promise<Testimonial[]>` for interacting with the backend content API.
- `frontend/src/hooks/useContent.ts` — React Query hook for fetching and caching trainers and testimonials — exports `useTrainers(): QueryObserverResult<Trainer[], Error>`, `useTrainer(trainerId: string): QueryObserverResult<Trainer, Error>`, and `useTestimonials(): QueryObserverResult<Testimonial[], Error>`.
- `frontend/src/types/content.ts` — Generated from the backend API contract — defines TypeScript interfaces for Trainer and Testimonial data structures.
- `frontend/src/pages/TrainersPage.tsx` — React page displaying a grid of all trainer profiles with photos and specializations; consumes data via `useTrainers()` from `frontend/src/hooks/useContent.ts`.
- `frontend/src/pages/TrainerDetailPage.tsx` — React page showing detailed information for a single trainer, identified by URL parameter; consumes data via `useTrainer(trainerId)` from `frontend/src/hooks/useContent.ts`.

**Feature Instruction:**

## Design Tokens
- Navbar: bg-[#1A1A1A] text-[#F5F5F5]
- Primary CTA: bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-bold rounded-full px-8 py-3 transition-all duration-200
- Brand text accent: text-[#DFFF00]
- Section bg: bg-[#1A1A1A] (dark sections) / bg-[#333333] (medium dark sections) text-[#F5F5F5]
- Card: bg-[#333333] rounded-xl shadow-lg border border-gray-700 p-6 text-[#F5F5F5]
- Section container: <section className="py-16 px-4"><div className="max-w-7xl mx-auto">
- Hero h1: text-4xl md:text-6xl font-bold text-[#F5F5F5]
- Body: text-gray-300 leading-relaxed

## Feature Overview
The `content-ui` feature is responsible for displaying public content such as trainer profiles and customer testimonials for MultiFit Aundh. It provides a user-friendly interface for potential and existing members to learn about the gym's expert trainers and read positive feedback from the community. The feature comprises TypeScript types for data structures, a frontend service for API interaction, a React Query hook for data fetching and caching, and two pages and one component for rendering the content.

## Core Entities
This feature primarily deals with two core entities:
- `Trainer`: Represents a gym trainer with details like name, specialization, bio, and image.
- `Testimonial`: Represents a customer testimonial including author, rating, feedback, and an optional image.

## Data Flow and Interactions
1.  **UI Components/Pages** (`TestimonialsSection.tsx`, `TrainersPage.tsx`, `TrainerDetailPage.tsx`):
    *   These components are responsible for rendering the content to the user.
    *   They consume data by calling the `useContent.ts` React Query hooks.
    *   `TrainersPage.tsx` displays a grid of all trainers.
    *   `TrainerDetailPage.tsx` displays detailed information for a single trainer, identified by a `trainerId` from the URL.
    *   `TestimonialsSection.tsx` displays a carousel of testimonials.
2.  **React Query Hook** (`useContent.ts`):
    *   This file exports custom React Query hooks (`useTrainers`, `useTrainer`, `useTestimonials`).
    *   These hooks abstract the data fetching logic, providing caching, loading, and error states to the UI components.
    *   They call the `contentService.ts` functions to perform actual API requests.
3.  **Frontend Service** (`contentService.ts`):
    *   This service (`contentService.ts`) is responsible for making HTTP requests to the `content-backend` API.
    *   It uses an `axios` client (assumed to be imported from `frontend/src/api/client.ts`) to communicate with the backend.
    *   It defines functions like `fetchTrainers`, `fetchTrainerById`, and `fetchTestimonials` which return Promises of the respective data types.
4.  **TypeScript Types** (`content.ts`):
    *   This file defines the `Trainer` and `Testimonial` interfaces, ensuring type safety across the frontend application.
    *   These types mirror the DTOs exposed by the `content-backend`.

## File-Specific Instructions

### `frontend/src/types/content.ts`
This file defines the TypeScript interfaces for `Trainer` and `Testimonial`.

**`interface Trainer`**
-   `id: string`: Unique identifier for the trainer (UUID).
-   `name: string`: Full name of the trainer.
-   `specialization: string`: Trainer's area of expertise (e.g., "Strength & Conditioning", "Yoga").
-   `bio: string`: A short biography of the trainer.
-   `imageUrl: string`: URL to the trainer's profile picture.
-   `socialMediaLinks: Record<string, string>`: An object mapping social media platform names (e.g., 'instagram', 'linkedin') to their respective URLs.

**`interface Testimonial`**
-   `id: string`: Unique identifier for the testimonial (UUID).
-   `author: string`: Name of the person who provided the testimonial.
-   `rating: number`: Numerical rating (e.g., 1-5).
-   `feedback: string`: The actual testimonial text.
-   `imageUrl?: string`: Optional URL to the author's profile picture.

### `frontend/src/services/contentService.ts`
This service interacts with the backend `content-backend` API to fetch trainer and testimonial data.

**`fetchTrainers(): Promise<Trainer[]>`**
1.  Makes a `GET` request to `/api/v1/content/trainers`.
2.  Returns a Promise that resolves to an array of `Trainer` objects.

**`fetchTrainerById(id: string): Promise<Trainer>`**
1.  Makes a `GET` request to `/api/v1/content/trainers/{id}` where `{id}` is the provided trainer ID.
2.  Returns a Promise that resolves to a single `Trainer` object.
3.  Throws an error if the trainer is not found.

**`fetchTestimonials(): Promise<Testimonial[]>`**
1.  Makes a `GET` request to `/api/v1/content/testimonials`.
2.  Returns a Promise that resolves to an array of `Testimonial` objects.

### `frontend/src/hooks/useContent.ts`
This file provides React Query hooks for fetching and managing content data.

**`useTrainers(): QueryObserverResult<Trainer[], Error>`**
1.  Uses `react-query`'s `useQuery` hook.
2.  The query key should be `['trainers']`.
3.  The query function calls `contentService.fetchTrainers()`.
4.  Returns the query result object containing `data`, `isLoading`, `isError`, `error`, etc.

**`useTrainer(trainerId: string): QueryObserverResult<Trainer, Error>`**
1.  Uses `react-query`'s `useQuery` hook.
2.  The query key should be `['trainer', trainerId]`.
3.  The query function calls `contentService.fetchTrainerById(trainerId)`.
4.  Returns the query result object.

**`useTestimonials(): QueryObserverResult<Testimonial[], Error>`**
1.  Uses `react-query`'s `useQuery` hook.
2.  The query key should be `['testimonials']`.
3.  The query function calls `contentService.fetchTestimonials()`.
4.  Returns the query result object.

### `frontend/src/components/TestimonialsSection.tsx`
This component displays customer testimonials in an engaging, high-energy carousel format.

**`TestimonialsSection()`**
1.  **Section Structure**: Wrap content in `<section className="py-16 px-4 bg-[#1A1A1A] text-[#F5F5F5]"><div className="max-w-7xl mx-auto">`.
2.  **Heading**: Display a bold, motivational heading like `<h2 className="text-4xl font-bold text-center mb-12">Hear From Our Thriving Community!</h2>`.
3.  **Google Rating Badge**: Prominently display a "5.0 Google Rating" badge using the accent color, e.g., `<div className="text-center mb-8 text-2xl font-semibold text-[#DFFF00]">5.0 Google Rating</div>`.
4.  **Testimonial Carousel**: Implement a responsive carousel (e.g., using a simple state-managed array or a library like `react-slick` if available) to cycle through testimonials.
    *   Each testimonial card should use `bg-[#333333] rounded-xl shadow-lg p-6 text-[#F5F5F5]`.
    *   Inside each card, display the `feedback`, `author`, and `rating` (e.g., using star icons).
    *   If `imageUrl` is present, display the author's image.
5.  **Data Fetching**: Use the `useTestimonials()` hook from `useContent.ts`.
    *   Display a loading spinner or message if `isLoading` is true.
    *   Display an error message if `isError` is true.
    *   Map over the `data` to render individual testimonial cards.

### `frontend/src/pages/TrainersPage.tsx`
This page displays a grid of all trainers at MultiFit Aundh.

**`TrainersPage()`**
1.  **Layout**: Wrap the page content in `<Layout>` from `@/components/Layout`.
2.  **Hero Section**: Create a hero section with a dynamic background image (e.g., `https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80`) and an overlay (`<div className="absolute inset-0 bg-black bg-opacity-50" />`).
    *   **Headline**: `<h1 className="text-4xl md:text-6xl font-bold text-[#F5F5F5]">Meet Your Fitness Architects at MultiFit Aundh</h1>`.
    *   **Sub-headline**: `<p className="mt-4 text-xl text-gray-300">Our expert trainers are here to guide you to your peak performance.</p>`.
3.  **Trainers Grid Section**: Wrap content in `<section className="py-16 px-4 bg-[#333333] text-[#F5F5F5]"><div className="max-w-7xl mx-auto">`.
    *   **Heading**: `<h2 className="text-3xl font-bold text-center mb-12">Our Elite Coaching Team</h2>`.
    *   **Data Fetching**: Use the `useTrainers()` hook from `useContent.ts`.
        *   Display a loading spinner or message if `isLoading` is true.
        *   Display an error message if `isError` is true.
    *   **Trainer Cards Grid**: Render a responsive grid (e.g., `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`) of trainer cards.
        *   Each card should be clickable and navigate to `TrainerDetailPage.tsx` for that trainer (e.g., `/trainers/{trainer.id}`).
        *   Each card should use `bg-[#1A1A1A] rounded-xl shadow-lg p-6 text-[#F5F5F5]`.
        *   Display `trainer.imageUrl` (as a circular image), `trainer.name` (bold), and `trainer.specialization`.

### `frontend/src/pages/TrainerDetailPage.tsx`
This page displays detailed information for a single trainer.

**`TrainerDetailPage()`**
1.  **Layout**: Wrap the page content in `<Layout>` from `@/components/Layout`.
2.  **Trainer ID**: Extract the `trainerId` from the URL parameters using `useParams()` from `react-router-dom`.
3.  **Data Fetching**: Use the `useTrainer(trainerId)` hook from `useContent.ts`.
    *   Display a loading spinner or message if `isLoading` is true.
    *   Display an error message if `isError` is true.
    *   If `data` (trainer) is null or undefined, display a "Trainer not found" message.
4.  **Trainer Detail Section**: Wrap content in `<section className="py-16 px-4 bg-[#1A1A1A] text-[#F5F5F5]"><div className="max-w-7xl mx-auto">`.
    *   **Structure**: Display the trainer's image prominently (e.g., large circular image).
    *   Display `trainer.name` as a main heading (`<h1 className="text-4xl font-bold text-[#DFFF00] mb-2">`).
    *   Display `trainer.specialization` (`<p className="text-xl text-gray-400 mb-4">`).
    *   Display `trainer.bio` (`<p className="text-lg leading-relaxed text-[#F5F5F5] mb-6">`).
    *   **Social Media Links**: If `trainer.socialMediaLinks` exist, display them as clickable icons or text links.



---

## Membership UI

**Name:** `membership-ui`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/pages/MembershipsPage.tsx` — PAGE layer — displays available membership plans fetched via `useMemberships.useMembershipPlans()`.
- `frontend/src/pages/MemberDashboardPage.tsx` — PAGE layer — displays a logged-in member's current membership, payment history, and booked classes, using `useMemberships.useUserMembership()` and `useSchedule.useUserBookings()`.
- `frontend/src/services/membershipService.ts` — SERVICE layer — provides functions to interact with the backend for membership plans and user subscriptions.
- `frontend/src/hooks/useMemberships.ts` — HOOK layer — React Query hooks for fetching and caching membership data.
- `frontend/src/types/membership.ts` — Generated from the backend API contract — defines TypeScript interfaces for membership plans and user subscriptions.

**Feature Instruction:**

## Design Tokens
- Navbar: bg-[#1A1A1A] text-[#F5F5F5]
- Primary CTA: bg-[#DFFF00] hover:bg-[#DFFF00]/80 text-[#1A1A1A] font-bold rounded-full px-8 py-3 transition-all duration-200
- Brand text accent: text-[#DFFF00]
- Section bg: bg-[#F5F5F5] (odd sections) / bg-gray-100 (even sections)
- Card: bg-white rounded-xl shadow-md border border-gray-100 p-6
- Section container: <section className="py-16 px-4"><div className="max-w-7xl mx-auto">
- Hero h1: text-4xl md:text-6xl font-bold text-[#F5F5F5]
- Body: text-gray-700 leading-relaxed

This `membership-ui` feature provides two main user interfaces: a public-facing page to display available membership plans (`MembershipsPage.tsx`) and a protected dashboard for logged-in members to view their current membership details and history (`MemberDashboardPage.tsx`). It interacts with the `membership-backend` for fetching membership plans and user-specific membership data, and with `scheduling-api-backend` for displaying booked classes on the member dashboard.

### `frontend/src/types/membership.ts`
This file defines the TypeScript interfaces for `MembershipPlan` and `UserMembership` which are derived from the backend DTOs. These types are crucial for ensuring type safety across the frontend application when handling membership-related data.

### `frontend/src/services/membershipService.ts`
This service acts as the data layer for membership-related operations. It contains two asynchronous functions: `getMembershipPlans()` to fetch all available plans from the backend, and `getUserMembership(userId: string)` to retrieve a specific user's membership details. It uses the `apiClient` from `@/api/client.ts` to make HTTP requests to the `membership-backend`.

### `frontend/src/hooks/useMemberships.ts`
This React Query hook provides a convenient way for components to fetch and cache membership data. It exposes `useMembershipPlans()` for retrieving all plans and `useUserMembership(userId: string)` for a specific user's membership. These hooks abstract away the data fetching logic and provide loading, error, and data states to the consuming components.

### `frontend/src/pages/MembershipsPage.tsx`
This public page displays all available membership plans in an energetic and bold layout. It utilizes the `useMembershipPlans()` hook to fetch data. The page is structured with a prominent hero section, followed by a grid of membership cards, and a call-to-action section. Each membership card clearly presents the plan name, price, duration, and key features, with a 'Join Now' CTA button. The page content is wrapped in the `<Layout>` component from `core-ui`.

**Page Sections:**
1.  **Hero Section:**
    *   Background: Dynamic image of a gym, e.g., `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80')` with a `bg-black bg-opacity-50` overlay.
    *   Headline (`h1`): "Ignite Your Potential at MultiFit Aundh!"
    *   Sub-headline (`p`): "Choose a membership that fuels your fitness journey. Bold. Energetic. Unstoppable."
    *   CTA Button: "View Our Plans" (Primary CTA style)
2.  **Membership Plans Section:**
    *   Heading (`h2`): "Our Membership Plans"
    *   Description (`p`): "Find the perfect plan to match your fitness goals and lifestyle."
    *   Grid of `MembershipPlan` cards:
        *   Each card displays `name`, `price`, `durationMonths`, and `features`.
        *   CTA Button: "Join Now" (Primary CTA style)
3.  **Call to Action Section:**
    *   Heading (`h2`): "Ready to Transform?"
    *   Description (`p`): "Join the MultiFit Aundh community today and experience the difference."
    *   CTA Button: "Get Started" (Primary CTA style)

### `frontend/src/pages/MemberDashboardPage.tsx`
This protected page provides a personalized dashboard for logged-in members. It displays their current membership details, payment history, and a list of their booked classes. It uses `useUserMembership(userId)` from `useMemberships.ts` and `useUserBookings()` from `scheduling-ui`'s `useSchedule.ts` (assuming `useSchedule` provides a hook for user bookings). The page content is wrapped in `<ProtectedRoute>` from `core-ui` (with `allowedRoles={['MEMBER', 'ADMIN']}`) and then `<Layout>`.

**Page Sections:**
1.  **Hero Section (Personalized):**
    *   Headline (`h1`): "Welcome Back, [Member Name]!"
    *   Sub-headline (`p`): "Your fitness journey continues at MultiFit Aundh."
2.  **Current Membership Section:**
    *   Heading (`h2`): "Your Current Membership"
    *   Displays `membershipPlan.name`, `startDate`, `endDate`, and `status` from `UserMembership`.
    *   CTA Button (if applicable): "Renew Membership" (Primary CTA style)
3.  **Booked Classes Section:**
    *   Heading (`h2`): "Your Upcoming Classes"
    *   Lists classes fetched via `useSchedule.ts` (e.g., `useUserBookings()`). Each entry shows class name, date, and time.
4.  **Payment History Section:**
    *   Heading (`h2`): "Payment History"
    *   Displays a table or list of `paymentHistory` from `UserMembership`, showing `amount`, `transactionDate`, and `status`.

**Interactions:**
*   `MembershipsPage.tsx` calls `useMemberships.useMembershipPlans()`.
*   `MemberDashboardPage.tsx` calls `useMemberships.useUserMembership(userId)` and `useSchedule.useUserBookings(userId)` (assuming this hook exists in `scheduling-ui`).
*   `useMemberships.ts` calls `membershipService.getMembershipPlans()` and `membershipService.getUserMembership()`.
*   `membershipService.ts` makes API calls to `membership-backend` via `apiClient`.


---

## Class Scheduling UI

**Name:** `scheduling-ui`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/pages/SchedulePage.tsx` — PAGE layer — Renders the interactive weekly class schedule grid, displaying class details and allowing users to book or cancel spots by interacting with the `useSchedule` hook.
- `frontend/src/services/scheduleService.ts` — SERVICE layer — Provides asynchronous functions to interact with the backend API for fetching class schedules and managing user bookings, returning typed data.
- `frontend/src/hooks/useSchedule.ts` — HOOK layer — A React Query hook that encapsulates data fetching and mutation logic for class schedules and bookings, providing loading states, error handling, and data invalidation.
- `frontend/src/types/schedule.ts` — Generated from the backend API contract — TypeScript interfaces defining the structure of class-related data entities like trainers, gym classes, schedules, and bookings.

**Feature Instruction:**

## Design Tokens
- Navbar: bg-[#1A1A1A] text-[#F5F5F5]
- Primary CTA: bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200
- Brand text accent: text-[#DFFF00]
- Section bg: bg-[#F5F5F5] (odd sections) / bg-gray-50 (even sections)
- Card: bg-white rounded-xl shadow-md border border-gray-100 p-6
- Section container: <section className="py-16 px-4"><div className="max-w-7xl mx-auto">
- Hero h1: text-4xl md:text-6xl font-bold text-[#F5F5F5]
- Body: text-gray-700 leading-relaxed

## Feature Instruction: Class Scheduling UI

This feature provides an interactive weekly class schedule for users to view class details and book a spot. It consists of a React page (`SchedulePage.tsx`), a frontend service (`scheduleService.ts`), a React Query hook (`useSchedule.ts`), and TypeScript type definitions (`schedule.ts`).

### 1. `frontend/src/types/schedule.ts`
This file defines the TypeScript interfaces for `Trainer`, `GymClass`, `ClassSchedule`, and `Booking`, mirroring the backend DTOs. These types are used across the frontend service and hook to ensure type safety.

### 2. `frontend/src/services/scheduleService.ts`
This service is responsible for making API calls to the `scheduling-api-backend` to fetch class schedules and handle booking/cancellation requests. It uses the `apiClient` from `frontend/src/api/client.ts` for authenticated requests.

- **`fetchClassSchedules(startDate: string, endDate: string): Promise<ClassSchedule[]>`**
  1. Makes a GET request to `/api/v1/schedules/by-date-range` with `startDate` and `endDate` query parameters.
  2. Returns a `Promise` resolving to an array of `ClassSchedule` objects.
  3. Throws an error if the API call fails.

- **`bookClass(classScheduleId: string): Promise<Booking>`**
  1. Makes a POST request to `/api/v1/bookings/{classScheduleId}`.
  2. Returns a `Promise` resolving to the created `Booking` object.
  3. Throws an error if the API call fails (e.g., class full, already booked).

- **`cancelClassBooking(bookingId: string): Promise<void>`**
  1. Makes a DELETE request to `/api/v1/bookings/{bookingId}`.
  2. Returns a `Promise` resolving to `void` on success.
  3. Throws an error if the API call fails (e.g., booking not found, not authorized).

### 3. `frontend/src/hooks/useSchedule.ts`
This React Query hook provides an abstraction over `scheduleService.ts` for fetching and mutating class schedule and booking data. It manages loading states, errors, and data caching, making it easy for `SchedulePage.tsx` to consume.

- **`useSchedule(startDate: string, endDate: string): { schedules: ClassSchedule[], isLoading: boolean, isError: boolean, error: Error | null, bookClass: UseMutationResult, cancelBooking: UseMutationResult }`**
  1. Uses `react-query`'s `useQuery` to call `scheduleService.fetchClassSchedules` with the provided `startDate` and `endDate`.
  2. Returns `schedules`, `isLoading`, `isError`, and `error` from the query.
  3. Provides a `bookClass` mutation using `useMutation` that calls `scheduleService.bookClass`. On success, it invalidates the `['schedules']` query to refetch the latest schedule data.
  4. Provides a `cancelBooking` mutation using `useMutation` that calls `scheduleService.cancelClassBooking`. On success, it invalidates the `['schedules']` query to refetch the latest schedule data.

### 4. `frontend/src/pages/SchedulePage.tsx`
This page renders the interactive weekly class schedule grid. It consumes the `useSchedule` hook to display class data and handle user interactions for booking and cancellation.

- **Structure and Content:**
  - The page will be wrapped in the `<Layout>` component from `@/components/Layout`.
  - **Hero Section:**
    - Background: Use a dynamic gym image from Unsplash: `https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80` with a `bg-black bg-opacity-50` overlay.
    - Headline (`h1`): "YOUR WEEK. YOUR WORKOUT. YOUR TRANSFORMATION."
    - Subheadline (`p`): "Browse our diverse class schedule and book your spot to unleash your full potential at MultiFit Aundh."
    - CTA Button: "Book Your First Class" (links to the schedule grid below), styled with `Primary CTA` tokens.
  - **Schedule Grid Section:**
    - Title (`h2`): "MultiFit Aundh Class Schedule", styled with `text-[#1A1A1A]`.
    - A weekly view of classes, allowing navigation between weeks (e.g., previous/next week buttons).
    - Each day displays a list of `ClassSchedule` entries.
    - Each class entry will show:
      - Class Name (`gymClass.name`)
      - Trainer Name (`gymClass.trainer.name`)
      - Time (`startTime` - `endTime`)
      - Available Slots (`capacity - bookedSlots`)
      - A "Book Now" button (if slots are available and not already booked by the current user), styled with `Primary CTA` tokens.
      - A "Cancel Booking" button (if the user has booked this class), styled with a secondary button style (e.g., `bg-gray-300 text-gray-800 hover:bg-gray-400`).
    - Loading state: Display a spinner or "Loading schedule..." message when `isLoading` is true.
    - Error state: Display an error message (e.g., "Failed to load schedule. Please try again later.") when `isError` is true.

- **Interactions:**
  - When a user clicks "Book Now" for a class, `useSchedule().bookClass.mutate(classSchedule.id)` is called.
  - When a user clicks "Cancel Booking" for a booked class, `useSchedule().cancelBooking.mutate(booking.id)` is called.
  - Success/error messages for booking/cancellation should be displayed using a toast notification system (if available in `core-ui` or a common utility).

**Cross-Feature Interactions:**
- `SchedulePage.tsx` imports `Layout` from `core-ui`.
- `scheduleService.ts` uses `apiClient` from `frontend/src/api/client.ts` (shared-infra-backend).
- Authentication status (e.g., current user ID) is implicitly handled by the `apiClient`'s JWT token and the backend's `Authentication` object in `scheduling-api-backend` controllers. The frontend does not explicitly pass `userId` for booking/cancellation; the backend infers it from the authenticated user's token.


---

## Admin Portal Shell

**Name:** `admin-portal-shell`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/components/AdminLayout.tsx` — COMPONENT layer — provides the overarching layout for all admin-facing pages, including sidebar navigation, header, and authentication/authorization checks.
- `frontend/src/pages/AdminDashboardPage.tsx` — PAGE layer — serves as the landing page for the admin portal, displaying an overview and quick access points within the AdminLayout.

**Feature Instruction:**

## Design Tokens
- Admin Layout Background: bg-[#1A1A1A]
- Sidebar Background: bg-[#1A1A1A]
- Sidebar Link Text: text-[#F5F5F5]
- Sidebar Link Hover/Active: bg-[#333333] text-[#DFFF00]
- Header Background: bg-[#1A1A1A]
- Header Text: text-[#F5F5F5]
- Main Content Area Background: bg-[#333333]
- Dashboard Card Background: bg-[#1A1A1A] rounded-lg shadow-md p-6
- Dashboard Card Text: text-[#F5F5F5]
- Accent Text: text-[#DFFF00]
- Button (Logout): bg-[#DFFF00] text-[#1A1A1A] font-semibold rounded-md px-4 py-2 transition-all duration-200
- Hero h1: text-4xl md:text-6xl font-bold text-[#F5F5F5]
- Body: text-[#F5F5F5] leading-relaxed

## Feature Overview: Admin Portal Shell
This feature provides the foundational user interface for the MultiFit Aundh admin portal. It includes a consistent layout (`AdminLayout.tsx`) with navigation and authentication enforcement, and a landing dashboard page (`AdminDashboardPage.tsx`) for administrators.

### AdminLayout.tsx
This component serves as the primary layout wrapper for all administrative pages. It ensures a consistent look and feel, provides navigation, and enforces access control for admin users.

**Structure and Content:**
1.  **Authentication and Authorization:**
    *   Utilize the `useAuth` hook from the `auth-ui` feature to access the current user's authentication status and roles. Import `useNavigate` from `react-router-dom`.
    *   Upon rendering, use `useEffect` to check if `isAuthenticated` is `true` and if the `user` object exists and its `roles` array includes the string 'ADMIN'.
    *   If the user is not authenticated or does not have the 'ADMIN' role, redirect them to the `/login` page using `navigate('/login')`.
2.  **Layout Structure:**
    *   The layout should consist of a fixed sidebar on the left and a main content area that expands to fill the remaining width. Use a flexbox or grid layout for this.
    *   A header should be present at the top of the main content area.
3.  **Sidebar (`<aside>`):**
    *   **Styling:** Apply `bg-[#1A1A1A]` for the background, `text-[#F5F5F5]` for default text, and appropriate padding/width (e.g., `w-64 h-screen fixed top-0 left-0`).
    *   **Brand/Logo:** Display "MultiFit Admin" at the top, styled with `text-[#DFFF00]` for "MultiFit" and `text-[#F5F5F5]` for "Admin".
    *   **Navigation Links:** Include `NavLink` components for the following admin sections. Each link should use `text-[#F5F5F5]` by default and `bg-[#333333] text-[#DFFF00]` when active or hovered. Ensure `NavLink` uses `className` for styling and `activeClassName` or a similar pattern for active state.
        *   Dashboard: `/admin`
        *   Users: `/admin/users`
        *   Memberships: `/admin/memberships`
        *   Bookings: `/admin/bookings`
        *   Schedule: `/admin/schedule`
        *   Trainers: `/admin/trainers`
        *   Testimonials: `/admin/testimonials`
        *   Leads: `/admin/leads`
4.  **Header (`<header>`):**
    *   **Styling:** Apply `bg-[#1A1A1A]` for the background, `text-[#F5F5F5]` for text, and appropriate padding. Position it at the top of the main content area (e.g., `sticky top-0`).
    *   **Content:** Display a welcome message like "Welcome, {user.email}" (using the email from the `useAuth` hook's `user` object).
    *   **Logout Button:** Include a button labeled "Logout" that, when clicked, calls the `logout` function from `useAuth` and redirects to `/login` using `navigate('/login')`. Style this button using the defined Button design token.
5.  **Main Content Area (`<main>`):**
    *   **Styling:** Apply `bg-[#333333]` for the background and `p-8` for padding. Ensure it takes up the remaining screen width next to the sidebar (e.g., `ml-64`).
    *   **Children:** Render `children` prop within this area, allowing specific admin pages to be displayed.

### AdminDashboardPage.tsx
This component represents the main dashboard page for the admin portal, providing an overview and quick access points.

**Structure and Content:**
1.  **Wrapper:** The page content will be rendered within the `AdminLayout` component.
2.  **Heading:** Display a prominent heading "Admin Dashboard" using `text-[#F5F5F5]` and `font-bold text-3xl`.
3.  **Overview Section:** Create a section with a grid of cards to display key metrics or quick links. Each card should use the `Dashboard Card Background` and `Dashboard Card Text` design tokens.
    *   **Placeholder Cards:** Include at least three placeholder cards with titles and brief descriptions, e.g., "Total Users", "Upcoming Classes", "New Leads". The content should be motivational and high-energy, reflecting the brand tone.
        *   Example Card 1: "Total Members: 1500+" - "Keep the energy high!"
        *   Example Card 2: "Upcoming Classes: 25" - "Stay on top of the schedule."
        *   Example Card 3: "New Trial Leads: 10" - "Convert potential into power!"

### Inter-file Wiring and Cross-Feature Contracts
*   `AdminLayout.tsx` consumes the `useAuth` hook from the `auth-ui` feature to manage user authentication and authorization. It calls `useAuth().isAuthenticated`, `useAuth().user`, and `useAuth().logout()`. It also uses `useNavigate` from `react-router-dom` for redirection.
*   `AdminDashboardPage.tsx` is rendered as a child of `AdminLayout.tsx` in the application's routing configuration.


---

## Admin Portal (Members)

**Name:** `admin-portal-members`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/pages/admin/AdminUsersPage.tsx` — Admin PAGE — displays a list of all registered users and provides actions for managing user roles and deletion.
- `frontend/src/pages/admin/AdminMembershipsPage.tsx` — Admin PAGE — provides an interface for administrators to perform CRUD operations on membership plans.
- `frontend/src/pages/admin/AdminBookingsPage.tsx` — Admin PAGE — displays a list of all class bookings and provides actions for managing booking statuses and cancellations.

**Feature Instruction:**

## Design Tokens
- Admin Layout background: bg-[#1A1A1A]
- Admin Layout text: text-[#F5F5F5]
- Admin Sidebar active item background: bg-[#333333]
- Admin Sidebar active item text: text-[#DFFF00]
- Page content background: bg-white
- Primary button: bg-[#DFFF00] hover:bg-[#cce600] text-[#1A1A1A] font-semibold rounded-md px-4 py-2 transition-all duration-200
- Secondary button: bg-[#333333] hover:bg-[#1A1A1A] text-[#F5F5F5] font-semibold rounded-md px-4 py-2 transition-all duration-200
- Accent text/icons: text-[#DFFF00]
- Table header background: bg-gray-100
- Table header text: text-gray-700 font-semibold
- Table row background: bg-white
- Table row border: border-b border-gray-200
- Input field: border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent
- Heading 1 (page title): text-3xl font-bold text-gray-900
- Heading 2 (section title): text-2xl font-semibold text-gray-800
- Body text: text-gray-700

The `admin-portal-members` feature provides the administrative interface for managing core gym entities: users, membership plans, and class bookings. These pages are accessible only to users with the 'ADMIN' role and are rendered within the `<AdminLayout>` component from the `admin-portal-shell` feature. Each page will display data in a tabular format, offering actions for viewing details, creating, updating, and deleting records where applicable. Forms for creation and editing will utilize `react-hook-form` and `zod` for validation, ensuring type safety and adherence to backend API contracts.

All pages in this feature must be wrapped in the `<ProtectedRoute allowedRoles={['ADMIN']}>` component from `core-ui` to enforce access control, ensuring only authenticated administrators can view them.

### AdminUsersPage.tsx
This page allows administrators to view a list of all registered users and provides an interface for potential user management actions. The page will be structured with a main heading, a search/filter bar, and a table to display user data.

1.  The page will attempt to fetch a list of all users from the backend. **Note**: As per the provided peer API contracts, there are no explicit admin endpoints for fetching all users from the `user-management-backend`. The page will display a placeholder message or an empty table until such an API is available.
2.  The UI will present users in a paginated table, showing key details such as `email`, `firstName`, `lastName`, and assigned `roles`.
3.  Each user row will include action buttons (e.g., "Edit Roles", "Delete User").
4.  **Edit Roles**: Clicking this action would typically open a modal or navigate to a dedicated page to modify a user's roles (e.g., changing a user from 'USER' to 'ADMIN').
5.  **Delete User**: Clicking this action would trigger a confirmation dialog before sending a request to delete the user.
6.  The page will use `useQuery` from `react-query` to manage data fetching and `useMutation` for any update/delete operations, once the corresponding backend APIs are available.
7.  Error handling will display user-friendly messages for failed operations.

### AdminMembershipsPage.tsx
This page enables administrators to perform full CRUD (Create, Read, Update, Delete) operations on membership plans. The page will feature a main heading, a "Create New Membership" button, and a table to list existing membership plans, along with a modal or dedicated form for creation and editing.

1.  Upon loading, the page will fetch all membership plans using a `GET` request to `/api/v1/admin/memberships`.
2.  Membership plans will be displayed in a table with columns for `Name`, `Description`, `Price`, and `MembershipType`.
3.  **Create Membership**: A "Create New Membership" button will open a form (either a modal or a separate page) for inputting new membership details.
    *   The form will include fields for `name` (string, required, `z.string().min(1)`), `description` (string, optional, `z.string().optional()`), `price` (string, required, validated as a positive number, `z.string().regex(/^[0-9]+(.[0-9]{1,2})?$/, 'Invalid price format').transform(Number).refine(val => val > 0, 'Price must be positive')`), `membershipType` (enum, e.g., 'MONTHLY', 'QUARTERLY', 'YEARLY', required, `z.enum(['MONTHLY', 'QUARTERLY', 'YEARLY'])`).
    *   Submission will send a `POST` request to `/api/v1/admin/memberships` with the new membership data (e.g., `MembershipDto`).
4.  **Edit Membership**: Each row in the table will have an "Edit" action button.
    *   Clicking "Edit" will open the creation/editing form, pre-populated with the existing membership data.
    *   Submission will send a `PUT` request to `/api/v1/admin/memberships/{id}` with the updated membership data.
5.  **Delete Membership**: Each row will have a "Delete" action button.
    *   Clicking "Delete" will prompt a confirmation dialog.
    *   Upon confirmation, a `DELETE` request will be sent to `/api/v1/admin/memberships/{id}`.
6.  The page will use `useQuery` for fetching memberships and `useMutation` for create, update, and delete operations, likely through a dedicated frontend service or hook.
7.  Form validation will be implemented using `zod` schemas that align with the backend `MembershipDto`.
8.  Success and error notifications will be displayed to the user using a toast notification system.

### AdminBookingsPage.tsx
This page allows administrators to view and manage all class bookings made by users. The page will feature a main heading, potentially filter options, and a table to display booking details.

1.  The page will attempt to fetch a list of all bookings from the backend. **Note**: As per the provided peer API contracts, there are no explicit admin endpoints for fetching all bookings from the `scheduling-api-backend`. The page will display a placeholder message or an empty table until such an API is available.
2.  Bookings will be displayed in a paginated table, showing details such as `User Email`, `Class Name`, `Schedule Date & Time`, and `Booking Status`.
3.  Each booking row will include action buttons (e.g., "Update Status", "Cancel Booking").
4.  **Update Status**: Clicking this action would typically open a modal or inline editor to change the booking status (e.g., from PENDING to CONFIRMED, or to CANCELLED).
5.  **Cancel Booking**: Clicking this action would trigger a confirmation dialog before sending a request to cancel the booking.
6.  The page will use `useQuery` from `react-query` to manage data fetching and `useMutation` for any update/delete operations, once the corresponding backend APIs are available.
7.  Error handling will display user-friendly messages for failed operations.

---

## Admin Portal (Content)

**Name:** `admin-portal-content`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/pages/admin/AdminSchedulePage.tsx` — Admin page for managing gym class schedules. It displays a table of schedules and provides forms for creating, updating, and deleting them.
- `frontend/src/pages/admin/AdminTrainersPage.tsx` — Admin page for managing trainer profiles. It displays a table of trainers and provides forms for creating, updating, and deleting them.
- `frontend/src/pages/admin/AdminTestimonialsPage.tsx` — Admin page for managing customer testimonials. It displays a table of testimonials and provides forms for creating, updating, and deleting them.
- `frontend/src/pages/admin/AdminLeadsPage.tsx` — Admin page for viewing free trial leads. It displays a read-only table of submitted leads.

**Feature Instruction:**

## Design Tokens
- Navbar: bg-[#1A1A1A] text-[#F5F5F5]
- Primary CTA: bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200
- Brand text accent: text-[#DFFF00]
- Section bg: bg-[#F5F5F5] (odd sections) / bg-gray-50 (even sections)
- Card: bg-white rounded-xl shadow-md border border-gray-100 p-6
- Section container: <section className="py-16 px-4"><div className="max-w-7xl mx-auto">
- Hero h1: text-4xl md:text-6xl font-bold text-white
- Body: text-gray-700 leading-relaxed
- Admin Table Header: bg-[#333333] text-[#F5F5F5]
- Admin Button Primary: bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold py-2 px-4 rounded
- Admin Button Danger: bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded
- Admin Input Field: border border-gray-300 rounded-md p-2 focus:ring-[#DFFF00] focus:border-[#DFFF00]

This feature provides the administrative interface for managing various content aspects of MultiFit Aundh, including class schedules, trainer profiles, customer testimonials, and trial leads. All pages within this feature are accessible only to authenticated users with the `ADMIN` role and are wrapped by the `AdminLayout` component from the `admin-portal-shell` feature for consistent navigation and styling. Each page will implement CRUD (Create, Read, Update, Delete) operations where applicable, using data tables for listing items and modal forms for creation and editing. Data fetching and mutations will be handled by React Query hooks, which will interact with dedicated frontend services that call the respective backend API endpoints.

### Common Implementation Details
- **Authentication & Authorization**: All pages must be wrapped in `<ProtectedRoute allowedRoles={['ADMIN']}>` from `@/components/ProtectedRoute` (from `core-ui`).
- **Layout**: All page content must be rendered within `<AdminLayout>` from `@/components/AdminLayout` (from `admin-portal-shell`).
- **Forms**: Forms for creating and editing entities will utilize `react-hook-form` with `zod` for validation. The zod schemas must precisely match the backend DTOs (e.g., `ClassScheduleDto`, `TrainerDto`, `TestimonialDto`). String fields that are `@NotBlank` in the backend should be `z.string().min(1)` in zod. Numeric fields should use `z.coerce.number()`.
- **Data Management**: Use React Query hooks (e.g., `useQuery`, `useMutation`) for efficient data fetching, caching, and invalidation. These hooks will call specific frontend services (e.g., `scheduleService.ts`, `contentService.ts`, `leadService.ts`) which encapsulate the API calls.

### AdminSchedulePage.tsx
This page allows administrators to manage the gym's class schedule. It will display a paginated table of all scheduled classes with options to view, create, edit, and delete entries.

**Sections:**
1.  **Header**: "Manage Class Schedules" (text-3xl font-bold text-[#1A1A1A]) with a "Add New Schedule" button (Admin Button Primary).
2.  **Class Schedule Table**: A table listing `ClassSchedule` entries with columns for Class Name, Trainer, Date, Start Time, End Time, Capacity, and Actions (Edit, Delete buttons).
3.  **Create/Edit Schedule Modal**: A modal form that appears when adding a new schedule or editing an existing one. Fields include:
    -   `gymClassId`: Dropdown/autocomplete for selecting an existing `GymClass`.
    -   `trainerId`: Dropdown/autocomplete for selecting an existing `Trainer`.
    -   `scheduleDate`: Date input.
    -   `startTime`: Time input.
    -   `endTime`: Time input.
    -   `capacity`: Number input.

**API Interactions (via frontend services/hooks)**:
-   **Fetch all schedules**: Calls `GET /api/v1/admin/schedules` (returns `List<ClassScheduleDto>`).
-   **Fetch single schedule**: Calls `GET /api/v1/admin/schedules/{id}` (returns `ClassScheduleDto`).
-   **Create schedule**: Calls `POST /api/v1/admin/schedules` with `ClassScheduleDto` (returns `ClassScheduleDto`).
-   **Update schedule**: Calls `PUT /api/v1/admin/schedules/{id}` with `ClassScheduleDto` (returns `ClassScheduleDto`).
-   **Delete schedule**: Calls `DELETE /api/v1/admin/schedules/{id}` (returns `void`).

### AdminTrainersPage.tsx
This page enables administrators to manage trainer profiles. It will feature a table of trainers and forms for creating, updating, and deleting trainer information.

**Sections:**
1.  **Header**: "Manage Trainers" (text-3xl font-bold text-[#1A1A1A]) with an "Add New Trainer" button (Admin Button Primary).
2.  **Trainers Table**: A table listing `Trainer` entries with columns for Name, Specialization, Bio (truncated), Image, and Actions (Edit, Delete buttons).
3.  **Create/Edit Trainer Modal**: A modal form for adding or modifying trainer details. Fields include:
    -   `name`: Text input.
    -   `specialization`: Text input.
    -   `bio`: Textarea.
    -   `imageUrl`: Text input (URL for trainer's photo).

**API Interactions (via frontend services/hooks)**:
-   **Fetch all trainers**: Calls `GET /api/v1/content/trainers` (returns `List<TrainerDto>`).
-   **Fetch single trainer**: Calls `GET /api/v1/content/trainers/{id}` (returns `TrainerDto`).
-   **Create trainer**: Calls `POST /api/v1/admin/content/trainers` with `TrainerDto` (returns `TrainerDto`).
-   **Update trainer**: Calls `PUT /api/v1/admin/content/trainers/{id}` with `TrainerDto` (returns `TrainerDto`).
-   **Delete trainer**: Calls `DELETE /api/v1/admin/content/trainers/{id}` (returns `void`).

### AdminTestimonialsPage.tsx
This page is for managing customer testimonials. It will display a table of testimonials and provide functionality to add, edit, and remove them.

**Sections:**
1.  **Header**: "Manage Testimonials" (text-3xl font-bold text-[#1A1A1A]) with an "Add New Testimonial" button (Admin Button Primary).
2.  **Testimonials Table**: A table listing `Testimonial` entries with columns for Author, Quote (truncated), Rating, Image, and Actions (Edit, Delete buttons).
3.  **Create/Edit Testimonial Modal**: A modal form for adding or modifying testimonial details. Fields include:
    -   `authorName`: Text input.
    -   `quote`: Textarea.
    -   `imageUrl`: Text input (URL for author's photo, optional).
    -   `rating`: Number input (1-5).

**API Interactions (via frontend services/hooks)**:
-   **Fetch all testimonials**: Calls `GET /api/v1/content/testimonials` (returns `List<TestimonialDto>`).
-   **Fetch single testimonial**: Calls `GET /api/v1/content/testimonials/{id}` (returns `TestimonialDto`).
-   **Create testimonial**: Calls `POST /api/v1/admin/content/testimonials` with `TestimonialDto` (returns `TestimonialDto`).
-   **Update testimonial**: Calls `PUT /api/v1/admin/content/testimonials/{id}` with `TestimonialDto` (returns `TestimonialDto`).
-   **Delete testimonial**: Calls `DELETE /api/v1/admin/content/testimonials/{id}` (returns `void`).

### AdminLeadsPage.tsx
This page provides a read-only view of all free trial leads submitted through the website. It will display a table of lead information.

**Sections:**
1.  **Header**: "Manage Trial Leads" (text-3xl font-bold text-[#1A1A1A]).
2.  **Trial Leads Table**: A table listing `TrialLead` entries with columns for Name, Email, Phone, and Submission Date.

**API Interactions (via frontend services/hooks)**:
-   **Fetch all trial leads**: Calls `GET /api/v1/admin/leads/trial` (returns `List<TrialLead>`).

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

