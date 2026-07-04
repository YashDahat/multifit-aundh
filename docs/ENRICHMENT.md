# Feature Enrichment — Attempt 1

Generated: 2026-07-04

Each section is one LLM call (~5–8K tokens). The instruction tells the generator how all files in the feature interact and what contracts they must honour.

---

## Shared Backend

**Name:** `shared-backend`  
**Type:** SHARED  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/multifitaundh/model/User.java` — MODEL layer - Defines the core User entity for authentication and membership status. It is referenced by UserRepository and UserService.
- `backend/src/main/java/com/multifitaundh/model/Role.java` — MODEL layer - Defines the Role enum (ADMIN, CUSTOMER) used by the User entity and SecurityConfig for authorization.
- `backend/src/main/java/com/multifitaundh/repository/UserRepository.java` — REPOSITORY layer - Provides data access methods for the User entity, including the critical findByEmail(String email): Optional<User> method used by UserService for authentication.
- `backend/src/main/java/com/multifitaundh/service/UserService.java` — SERVICE layer - Implements Spring Security's UserDetailsService to fetch user details for authentication via its loadUserByUsername(String email): UserDetails method.
- `backend/src/main/java/com/multifitaundh/util/JwtUtil.java` — UTIL layer - Provides static methods for JWT operations: generateToken(UserDetails), validateToken(String, UserDetails), and extractEmail(String). Used by AuthController and JwtAuthFilter.
- `backend/src/main/java/com/multifitaundh/security/JwtAuthFilter.java` — CONFIG layer - A Spring Security filter that intercepts all API requests, extracts the JWT from the 'Authorization' header, validates it using JwtUtil, and sets the authentication context.
- `backend/src/main/java/com/multifitaundh/config/SecurityConfig.java` — CONFIG layer - Defines the core security rules for the application, including CORS policy, session management, and HTTP authorization rules. It integrates the JwtAuthFilter into the security chain.
- `backend/src/main/java/com/multifitaundh/controller/SpaController.java` — CONTROLLER layer - Handles client-side routing for the React SPA by forwarding all non-API routes (e.g., /memberships, /schedule) to index.html.
- `backend/src/main/java/com/multifitaundh/config/AdminInitializer.java` — CONFIG layer - A CommandLineRunner that ensures an admin user exists on startup by checking the database and creating one from environment variables if necessary.
- `backend/src/main/java/com/multifitaundh/exception/GlobalExceptionHandler.java` — EXCEPTION layer - A @ControllerAdvice class that catches exceptions (e.g., ResourceNotFoundException) from controllers and formats them into a standardized ErrorResponse DTO.
- `backend/src/main/java/com/multifitaundh/dto/ErrorResponse.java` — DTO layer - Defines the standard JSON structure for all error responses from the API, used by GlobalExceptionHandler.
- `backend/src/main/java/com/multifitaundh/exception/ResourceNotFoundException.java` — EXCEPTION layer - A custom runtime exception thrown by services when an entity (e.g., MembershipPlan, Trainer) cannot be found by its ID. Handled by GlobalExceptionHandler.
- `backend/src/main/java/com/multifitaundh/config/DataSeeder.java` — CONFIG layer - A CommandLineRunner that populates the database with realistic sample membership plans and trainers for MultiFit Aundh on first startup, ensuring the site has content immediately.

**Feature Instruction:**

The `shared-backend` feature provides foundational components for the MultiFit Aundh application, including user authentication and authorization, global exception handling, and initial data seeding. It defines core models, repositories, services, and security configurations that are utilized across other backend features.

### File: `User.java`
This file defines the `User` entity, representing a user or member in the system. It is a JPA entity mapped to a database table.
-   **Fields:**
    -   `id`: `UUID` (Primary key, generated automatically).
    -   `email`: `String` (Unique, not null, used for login).
    -   `password`: `String` (Hashed password, not null).
    -   `role`: `Role` (Enum, determines access level, not null).
    -   `fullName`: `String`.
    -   `membershipPlan`: `MembershipPlan` (Many-to-one relationship, nullable).
    -   `membershipExpiryDate`: `LocalDate` (Nullable).
-   **Relationships:**
    -   Many-to-one with `MembershipPlan`.
-   **Constraints:** `email` must be unique.

### File: `Role.java`
This file defines the `Role` enumeration, used for access control within the application.
-   **Enum Values:**
    -   `ADMIN`: Represents an administrator with full access.
    -   `CUSTOMER`: Represents a standard member with access to booking and profile features.

### File: `UserRepository.java`
This file defines the Spring Data JPA repository for the `User` entity.
-   **Extends:** `JpaRepository<User, UUID>`.
-   **Public Methods:**
    -   `Optional<User> findByEmail(String email)`: Finds a user by their email address. This method is crucial for authentication.

### File: `UserService.java`
This file implements Spring Security's `UserDetailsService` to load user-specific data during authentication.
-   **Dependencies:** Injects `UserRepository`.
-   **Public Methods:**
    -   `UserDetails loadUserByUsername(String email)`:
        1.  Finds a `User` by `email` using `userRepository.findByEmail(email)`.
        2.  If the user is not found, throws `UsernameNotFoundException`.
        3.  Returns a Spring Security `User` object constructed from the retrieved `com.multifitaundh.model.User` (using its email, password, and granted authorities based on the `role`).

### File: `JwtUtil.java`
This utility class handles the creation, validation, and parsing of JSON Web Tokens (JWTs).
-   **Configuration:** Reads JWT secret and expiration time from application properties.
-   **Public Methods:**
    -   `String generateToken(UserDetails userDetails)`:
        1.  Takes `UserDetails` as input.
        2.  Sets the subject of the token to `userDetails.getUsername()` (which is the user's email).
        3.  Sets the issued at and expiration dates.
        4.  Signs the token with a secret key.
        5.  Returns the generated JWT string.
    -   `boolean validateToken(String token, UserDetails userDetails)`:
        1.  Extracts the email from the `token` using `extractEmail(token)`.
        2.  Compares the extracted email with `userDetails.getUsername()`.
        3.  Checks if the token is expired.
        4.  Returns `true` if the email matches and the token is not expired, `false` otherwise.
    -   `String extractEmail(String token)`:
        1.  Parses the token to extract the subject (email).
        2.  Returns the email string.

### File: `JwtAuthFilter.java`
This Spring Security filter intercepts incoming requests to validate JWTs and set the security context.
-   **Extends:** `OncePerRequestFilter`.
-   **Dependencies:** Injects `JwtUtil` and `UserService`.
-   **Logic (within `doFilterInternal`):**
    1.  Extracts the `Authorization` header from the request.
    2.  Checks if the header starts with "Bearer ".
    3.  If a JWT is found:
        a.  Extracts the token string.
        b.  Extracts the email from the token using `jwtUtil.extractEmail(token)`.
        c.  If the email is not null and no authentication is currently set in the security context:
            i.  Loads `UserDetails` using `userService.loadUserByUsername(email)`.
            ii. Validates the token using `jwtUtil.validateToken(token, userDetails)`.
            iii. If valid, creates an `UsernamePasswordAuthenticationToken` with `userDetails` and `userDetails.getAuthorities()`.
            iv. Sets the authentication token in the `SecurityContextHolder`.
    4.  Continues the filter chain.

### File: `SecurityConfig.java`
This class configures Spring Security for the application, defining authorization rules, CORS, and integrating the JWT filter.
-   **Dependencies:** Injects `JwtAuthFilter`, `UserService`, `PasswordEncoder`, and `AuthenticationConfiguration`.
-   **`SecurityFilterChain` Bean:**
    -   Configures HTTP security:
        -   Disables CSRF (`csrf(csrf -> csrf.disable())`).
        -   Configures CORS to allow all origins, methods, and headers.
        -   Sets session management to `STATELESS`.
        -   Defines authorization rules using `authorizeHttpRequests()`:
            -   `/api/v1/auth/**`: Permit all.
            -   `/api/v1/trials`: Permit all (for lead capture).
            -   `/api/v1/memberships`: Permit all (for public membership plans).
            -   `/api/v1/trainers`: Permit all (for public trainer profiles).
            -   `/api/v1/admin/**`: Requires `ADMIN` role.
            -   Any other authenticated request: Requires `CUSTOMER` or `ADMIN` role.
            -   Any other request (e.g., static assets, SPA routes): Permit all.
        -   Adds `JwtAuthFilter` before `UsernamePasswordAuthenticationFilter`.
-   **`AuthenticationManager` Bean:** Exposes `AuthenticationManager` from `AuthenticationConfiguration`.
-   **`PasswordEncoder` Bean:** Provides a `BCryptPasswordEncoder` for password hashing.

### File: `SpaController.java`
This controller handles client-side routing for the React SPA.
-   **Public Methods:**
    -   `String fallback()`:
        1.  Mapped to `/**` (all non-API, non-static routes).
        2.  Returns `forward:/index.html` to serve the React application's entry point.

### File: `AdminInitializer.java`
This `CommandLineRunner` ensures a default admin user exists in the database on application startup.
-   **Dependencies:** Injects `UserRepository` and `PasswordEncoder`.
-   **Public Methods:**
    -   `void run(String... args)`:
        1.  Checks if a user with the email `admin@multifitaundh.com` exists using `userRepository.findByEmail()`.
        2.  If not found:
            a.  Creates a new `User` entity.
            b.  Sets `email` to `admin@multifitaundh.com`.
            c.  Sets `password` to `admin123` (hashed using `passwordEncoder.encode()`).
            d.  Sets `role` to `Role.ADMIN`.
            e.  Sets `fullName` to "MultiFit Aundh Admin".
            f.  Saves the new admin user using `userRepository.save()`.

### File: `GlobalExceptionHandler.java`
This `@ControllerAdvice` provides centralized exception handling for the application, returning consistent `ErrorResponse` objects.
-   **Dependencies:** Injects `HttpServletRequest`.
-   **Exception Handlers:**
    -   `ResponseEntity<ErrorResponse> handleResourceNotFoundException(ResourceNotFoundException ex, HttpServletRequest request)`:
        1.  Catches `ResourceNotFoundException`.
        2.  Returns an `ErrorResponse` with HTTP status `NOT_FOUND` (404), the exception message, and the request path.
    -   `ResponseEntity<ErrorResponse> handleIllegalArgumentException(IllegalArgumentException ex, HttpServletRequest request)`:
        1.  Catches `IllegalArgumentException`.
        2.  Returns an `ErrorResponse` with HTTP status `BAD_REQUEST` (400), the exception message, and the request path.
    -   `ResponseEntity<ErrorResponse> handleJacksonException(tools.jackson.core.JacksonException ex, HttpServletRequest request)`:
        1.  Catches `tools.jackson.core.JacksonException` (for JSON parsing errors).
        2.  Returns an `ErrorResponse` with HTTP status `BAD_REQUEST` (400), the exception message, and the request path.
    -   `ResponseEntity<ErrorResponse> handleException(Exception ex, HttpServletRequest request)`:
        1.  Catches generic `Exception`.
        2.  Returns an `ErrorResponse` with HTTP status `INTERNAL_SERVER_ERROR` (500), a generic error message, and the request path.

### File: `ErrorResponse.java`
This DTO defines the standardized structure for error responses returned by the API.
-   **Fields:**
    -   `timestamp`: `LocalDateTime` (Time of the error).
    -   `status`: `int` (HTTP status code).
    -   `error`: `String` (Error message).
    -   `path`: `String` (Request path where the error occurred).

### File: `ResourceNotFoundException.java`
This custom runtime exception is thrown when a requested resource cannot be found.
-   **Extends:** `RuntimeException`.
-   **Constructor:** `ResourceNotFoundException(String message)`: Initializes the exception with a message.

### File: `DataSeeder.java`
This `CommandLineRunner` populates the database with initial sample data for MultiFit Aundh on application startup if the relevant repositories are empty.
-   **Dependencies:** Injects `MembershipPlanRepository` (from `membership-management-backend`) and `TrainerRepository` (from `content-management-backend`).
-   **Public Methods:**
    -   `void run(String... args)`:
        1.  Checks if `membershipPlanRepository` is empty. If so, creates and saves several `MembershipPlan` entities (e.g., "Monthly Pass", "Quarterly Premium", "Annual Elite") with realistic names, prices, durations, and descriptions for MultiFit Aundh.
        2.  Checks if `trainerRepository` is empty. If so, creates and saves several `Trainer` entities (e.g., "Rajesh Kumar", "Priya Sharma", "Vikram Singh") with realistic names, specialties, and short bios for MultiFit Aundh.

---

## Authentication API

**Name:** `authentication-api`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/multifitaundh/controller/AuthController.java` — CONTROLLER layer - Exposes the public POST /api/v1/auth/login endpoint. It validates credentials and, on success, uses JwtUtil to generate a token and returns it in an AuthResponse.
- `backend/src/main/java/com/multifitaundh/dto/AuthRequest.java` — DTO layer - Defines the request body for the login endpoint, containing email and password fields with validation annotations (@NotBlank, @Email).
- `backend/src/main/java/com/multifitaundh/dto/AuthResponse.java` — DTO layer - Defines the successful response body for the login endpoint, containing the JWT, user role, and expiration time.

**Feature Instruction:**

This feature implements the backend authentication API for MultiFit Aundh, allowing users to log in and receive a JSON Web Token (JWT). It consists of a controller (`AuthController.java`) and two Data Transfer Objects (DTOs): `AuthRequest.java` for login requests and `AuthResponse.java` for login responses.

### `AuthRequest.java`
This DTO defines the structure for user login requests. It uses Lombok annotations for boilerplate code and Jakarta Bean Validation for input validation.

**Class Definition:**
```

java
package com.multifitaundh.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthRequest {
    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Email must be a valid email format")
    private String email;

    @NotBlank(message = "Password cannot be blank")
    private String password;
}


```

**Public Variables:**
- `email`: `String`. Represents the user's email. Must not be blank and must be a valid email format.
- `password`: `String`. Represents the user's password. Must not be blank.

### `AuthResponse.java`
This DTO defines the structure for successful user login responses, containing the generated JWT, the user's role, and the token's expiration timestamp.

**Class Definition:**
```

java
package com.multifitaundh.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String role;
    private long expiresAt;
}


```

**Public Variables:**
- `token`: `String`. The generated JWT for the authenticated user.
- `role`: `String`. The role of the authenticated user (e.g., "USER", "ADMIN").
- `expiresAt`: `long`. The timestamp in epoch milliseconds when the JWT expires.

### `AuthController.java`
This controller handles the `/api/v1/auth/login` endpoint, processing user authentication requests.

**Class Definition:**
```

java
package com.multifitaundh.controller;

import com.multifitaundh.dto.AuthRequest;
import com.multifitaundh.dto.AuthResponse;
import com.multifitaundh.util.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest authRequest) {
        // Logic for login method
    }
}


```

**Dependencies:**
- `AuthController` injects `AuthenticationManager` (from Spring Security) and `JwtUtil` (from the `shared-backend` feature).

**Public Methods:**
- `login(AuthRequest authRequest): ResponseEntity<AuthResponse>`
    1.  Attempt to authenticate the user using `authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword()))`.
    2.  If authentication fails (e.g., incorrect email or password), a `BadCredentialsException` will be thrown by Spring Security. Catch this exception and return `ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()`.
    3.  If authentication is successful, retrieve the `Authentication` object.
    4.  Extract `UserDetails` from the `Authentication` object: `(UserDetails) authentication.getPrincipal()`.
    5.  Generate a JWT by calling `jwtUtil.generateToken(userDetails)`.
    6.  Determine the user's role from `userDetails.getAuthorities().stream().findFirst().map(GrantedAuthority::getAuthority).orElse("USER")`. (Assuming a single role for simplicity, or implement more complex role extraction if needed).
    7.  Calculate the token expiration timestamp (`expiresAt`). This should be consistent with the JWT's actual expiration time, typically `System.currentTimeMillis() + JWT_EXPIRATION_MILLISECONDS` where `JWT_EXPIRATION_MILLISECONDS` is a configured value in `JwtUtil`.
    8.  Construct an `AuthResponse` object with the generated `token`, `role`, and `expiresAt`.
    9.  Return `ResponseEntity.ok(authResponse)`.

**API Endpoints:**
- `POST /api/v1/auth/login`
    - **Request Body:** `AuthRequest` (JSON)
    - **Response Body:** `AuthResponse` (JSON) on success (HTTP 200 OK).
    - **Error Cases:** Returns HTTP 401 Unauthorized if authentication fails due to invalid credentials.

---

## Membership Management (Backend)

**Name:** `membership-management-backend`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/multifitaundh/model/MembershipPlan.java` — MODEL layer - Defines the MembershipPlan entity, including its name, price, and duration. This is the core data structure for the membership system.
- `backend/src/main/java/com/multifitaundh/repository/MembershipPlanRepository.java` — REPOSITORY layer - Provides data access for MembershipPlan entities, including a custom query findAllByActiveTrue() to fetch plans for the public-facing page.
- `backend/src/main/java/com/multifitaundh/dto/MembershipPlanDto.java` — DTO layer - Defines the public representation of a MembershipPlan for API responses, excluding internal fields like 'active'.
- `backend/src/main/java/com/multifitaundh/dto/CreateMembershipPlanRequest.java` — DTO layer - Defines the request body for creating and updating membership plans via the admin API, with bean validation annotations.
- `backend/src/main/java/com/multifitaundh/service/MembershipPlanService.java` — SERVICE layer - Implements business logic for memberships, such as getAllActivePlans(): List<MembershipPlanDto> and createPlan(CreateMembershipPlanRequest): MembershipPlanDto. It interacts with MembershipPlanRepository.
- `backend/src/main/java/com/multifitaundh/controller/MembershipPlanController.java` — CONTROLLER layer - Exposes the public GET /api/v1/memberships endpoint, which delegates to MembershipPlanService to fetch and return active plans.
- `backend/src/main/java/com/multifitaundh/controller/AdminMembershipPlanController.java` — CONTROLLER layer - Provides secured CRUD endpoints under /api/v1/admin/memberships for managing membership plans. All methods are protected and require ADMIN role.

**Feature Instruction:**

The `membership-management-backend` feature provides a complete backend solution for managing gym membership plans, including public-facing endpoints to view active plans and admin-specific CRUD operations. It consists of model, repository, DTO, service, and controller layers.

### `MembershipPlan.java`
This file defines the `MembershipPlan` JPA entity. It is annotated with `@Entity` and `@Table(name = "membership_plans")`.
-   **Fields**:
    -   `id`: `UUID` (Primary key, annotated with `@Id` and `@GeneratedValue`) 
    -   `name`: `String` (Annotated with `@Column(nullable = false)`) 
    -   `description`: `String` (Annotated with `@Column(columnDefinition = "TEXT")`) 
    -   `price`: `BigDecimal` (Annotated with `@Column(nullable = false)`) 
    -   `durationInDays`: `int` (Annotated with `@Column(nullable = false)`) 
    -   `active`: `boolean` (Annotated with `@Column(nullable = false)`) 
-   It should have a no-argument constructor and an all-argument constructor, along with standard getters and setters for all fields.

### `MembershipPlanRepository.java`
This file defines the `MembershipPlanRepository` interface, extending `org.springframework.data.jpa.repository.JpaRepository<MembershipPlan, UUID>`.
-   **Public Methods**:
    -   `findAllByActiveTrue(): List<MembershipPlan>`: This method is a custom finder that retrieves all `MembershipPlan` entities where the `active` field is `true`.

### `MembershipPlanDto.java`
This file defines the `MembershipPlanDto` record (or class with constructor, getters).
-   **Fields**:
    -   `id`: `UUID`
    -   `name`: `String`
    -   `description`: `String`
    -   `price`: `BigDecimal`
    -   `durationInDays`: `int`
-   It should include a static factory method `fromEntity(MembershipPlan membershipPlan): MembershipPlanDto` that maps a `MembershipPlan` entity to a `MembershipPlanDto`.

### `CreateMembershipPlanRequest.java`
This file defines the `CreateMembershipPlanRequest` record (or class with constructor, getters).
-   **Fields**:
    -   `name`: `String` (Annotated with `@NotBlank(message = "Plan name cannot be blank")`) 
    -   `description`: `String` (Annotated with `@NotBlank(message = "Plan description cannot be blank")`) 
    -   `price`: `BigDecimal` (Annotated with `@NotNull(message = "Price cannot be null")` and `@Positive(message = "Price must be positive")`) 
    -   `durationInDays`: `int` (Annotated with `@NotNull(message = "Duration cannot be null")` and `@Positive(message = "Duration must be positive")`) 
    -   `active`: `boolean` (Annotated with `@NotNull(message = "Active status cannot be null")`) 

### `MembershipPlanService.java`
This file defines the `MembershipPlanService` class, annotated with `@Service`.
-   **Dependencies**:
    -   `MembershipPlanRepository` (injected via constructor).
-   **Public Methods**:
    -   `getAllActivePlans(): List<MembershipPlanDto>`:
        1.  Calls `membershipPlanRepository.findAllByActiveTrue()` to retrieve all active `MembershipPlan` entities.
        2.  Maps each `MembershipPlan` entity to a `MembershipPlanDto` using `MembershipPlanDto.fromEntity()`.
        3.  Returns the list of `MembershipPlanDto`.
    -   `getAllPlansForAdmin(): List<MembershipPlanDto>`:
        1.  Calls `membershipPlanRepository.findAll()` to retrieve all `MembershipPlan` entities.
        2.  Maps each `MembershipPlan` entity to a `MembershipPlanDto` using `MembershipPlanDto.fromEntity()`.
        3.  Returns the list of `MembershipPlanDto`.
    -   `createPlan(CreateMembershipPlanRequest request): MembershipPlanDto`:
        1.  Creates a new `MembershipPlan` entity.
        2.  Sets the `name`, `description`, `price`, `durationInDays`, and `active` fields from the `request`.
        3.  Saves the new `MembershipPlan` entity using `membershipPlanRepository.save()`.
        4.  Maps the saved entity to a `MembershipPlanDto`.
        5.  Returns the `MembershipPlanDto`.
    -   `updatePlan(UUID id, CreateMembershipPlanRequest request): MembershipPlanDto`:
        1.  Finds the `MembershipPlan` entity by `id` using `membershipPlanRepository.findById(id)`.
        2.  If the plan is not found, throws `ResourceNotFoundException("Membership plan not found with ID: " + id)` (from `shared-backend`).
        3.  Updates the `name`, `description`, `price`, `durationInDays`, and `active` fields of the found entity from the `request`.
        4.  Saves the updated `MembershipPlan` entity using `membershipPlanRepository.save()`.
        5.  Maps the updated entity to a `MembershipPlanDto`.
        6.  Returns the `MembershipPlanDto`.
    -   `deletePlan(UUID id): void`:
        1.  Checks if a `MembershipPlan` entity with the given `id` exists using `membershipPlanRepository.existsById(id)`.
        2.  If the plan does not exist, throws `ResourceNotFoundException("Membership plan not found with ID: " + id)` (from `shared-backend`).
        3.  Deletes the `MembershipPlan` entity by `id` using `membershipPlanRepository.deleteById(id)`.

### `MembershipPlanController.java`
This file defines the `MembershipPlanController` class, annotated with `@RestController` and `@RequestMapping("/api/v1/memberships")`.
-   **Dependencies**:
    -   `MembershipPlanService` (injected via constructor).
-   **Public Endpoints**:
    -   `GET /api/v1/memberships`:
        -   **Method**: `getActivePlans(): List<MembershipPlanDto>`
        -   Annotated with `@GetMapping`.
        -   Calls `membershipPlanService.getAllActivePlans()`.
        -   Returns `ResponseEntity.ok()` with the list of `MembershipPlanDto`.

### `AdminMembershipPlanController.java`
This file defines the `AdminMembershipPlanController` class, annotated with `@RestController` and `@RequestMapping("/api/v1/admin/memberships")`.
-   **Security**: All methods in this controller must be protected with `@PreAuthorize("hasRole('ADMIN')")`.
-   **Dependencies**:
    -   `MembershipPlanService` (injected via constructor).
-   **Public Endpoints**:
    -   `GET /api/v1/admin/memberships`:
        -   **Method**: `getAllPlansForAdmin(): List<MembershipPlanDto>`
        -   Annotated with `@GetMapping`.
        -   Calls `membershipPlanService.getAllPlansForAdmin()`.
        -   Returns `ResponseEntity.ok()` with the list of `MembershipPlanDto`.
    -   `POST /api/v1/admin/memberships`:
        -   **Method**: `createPlan(@Valid @RequestBody CreateMembershipPlanRequest request): MembershipPlanDto`
        -   Annotated with `@PostMapping`.
        -   Calls `membershipPlanService.createPlan(request)`.
        -   Returns `ResponseEntity.status(HttpStatus.CREATED).body()` with the created `MembershipPlanDto`.
    -   `PUT /api/v1/admin/memberships/{id}`:
        -   **Method**: `updatePlan(@PathVariable UUID id, @Valid @RequestBody CreateMembershipPlanRequest request): MembershipPlanDto`
        -   Annotated with `@PutMapping("/{id}")`.
        -   Calls `membershipPlanService.updatePlan(id, request)`.
        -   Returns `ResponseEntity.ok()` with the updated `MembershipPlanDto`.
        -   **Error Handling**: If `membershipPlanService.updatePlan` throws `ResourceNotFoundException`, the controller should catch it and return an `HttpStatus.NOT_FOUND` (404) response.
    -   `DELETE /api/v1/admin/memberships/{id}`:
        -   **Method**: `deletePlan(@PathVariable UUID id): ResponseEntity<Void>`
        -   Annotated with `@DeleteMapping("/{id}")`.
        -   Calls `membershipPlanService.deletePlan(id)`.
        -   Returns `ResponseEntity.noContent().build()`.
        -   **Error Handling**: If `membershipPlanService.deletePlan` throws `ResourceNotFoundException`, the controller should catch it and return an `HttpStatus.NOT_FOUND` (404) response.

---

## Content Management (Backend)

**Name:** `content-management-backend`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/multifitaundh/model/Trainer.java` — MODEL layer - Defines the Trainer entity with fields for name, bio, specializations, and photo URL. This data is displayed on the public trainer pages.
- `backend/src/main/java/com/multifitaundh/repository/TrainerRepository.java` — REPOSITORY layer - Provides standard CRUD data access methods for the Trainer entity, used by TrainerService.
- `backend/src/main/java/com/multifitaundh/dto/TrainerDto.java` — DTO layer - Defines the public representation of a Trainer for API responses, ensuring a consistent contract with the frontend.
- `backend/src/main/java/com/multifitaundh/dto/CreateTrainerRequest.java` — DTO layer - Defines the request body for creating and updating trainers via the admin API, with bean validation annotations.
- `backend/src/main/java/com/multifitaundh/service/TrainerService.java` — SERVICE layer - Implements business logic for trainers, providing methods like getAllTrainers(): List<TrainerDto> and createTrainer(CreateTrainerRequest): TrainerDto. It interacts with TrainerRepository.
- `backend/src/main/java/com/multifitaundh/controller/TrainerController.java` — CONTROLLER layer - Exposes public endpoints GET /api/v1/trainers and GET /api/v1/trainers/{id} to display trainer information on the website.
- `backend/src/main/java/com/multifitaundh/controller/AdminTrainerController.java` — CONTROLLER layer - Provides secured CRUD endpoints under /api/v1/admin/trainers for managing trainer profiles. All methods require ADMIN role.

**Feature Instruction:**

The `content-management-backend` feature provides a complete backend solution for managing trainer profiles, including persistence, business logic, and API endpoints for both public display and administrative CRUD operations.

## File: `backend/src/main/java/com/multifitaundh/model/Trainer.java`
This file defines the `Trainer` JPA entity. It represents a trainer at MultiFit Aundh.
-   **Fields:**
    -   `id`: `UUID` (Primary key, generated automatically).
    -   `name`: `String` (Trainer's full name).
    -   `bio`: `String` (A short biography of the trainer).
    -   `specializations`: `String` (Comma-separated list of specializations, e.g., CrossFit, Yoga).
    -   `imageUrl`: `String` (URL to the trainer's photo).
-   **Annotations:** `@Entity`, `@Table(name = "trainers")`, `@Id`, `@GeneratedValue` for `id`.

## File: `backend/src/main/java/com/multifitaundh/repository/TrainerRepository.java`
This file defines the `TrainerRepository` interface, which extends Spring Data JPA's `JpaRepository` to provide standard CRUD operations for the `Trainer` entity.
-   **Extends:** `org.springframework.data.jpa.repository.JpaRepository<Trainer, UUID>`.
-   No custom finder methods are required beyond those provided by `JpaRepository`.

## File: `backend/src/main/java/com/multifitaundh/dto/TrainerDto.java`
This file defines the `TrainerDto` (Data Transfer Object) used for representing `Trainer` data in API responses.
-   **Fields:**
    -   `id`: `UUID`
    -   `name`: `String`
    -   `bio`: `String`
    -   `specializations`: `String`
    -   `imageUrl`: `String`
-   **Constructor:** A constructor that takes a `Trainer` entity and maps its fields to the `TrainerDto` fields.

## File: `backend/src/main/java/com/multifitaundh/dto/CreateTrainerRequest.java`
This file defines the `CreateTrainerRequest` DTO, used as the request body for creating and updating `Trainer` entities via the admin API.
-   **Fields:**
    -   `name`: `String` (Annotated with `@NotBlank`)
    -   `bio`: `String` (Annotated with `@NotBlank`)
    -   `specializations`: `String` (Annotated with `@NotBlank`)
    -   `imageUrl`: `String` (Annotated with `@NotBlank` and `@URL`)
-   **Annotations:** `@Data` (Lombok) or explicit getters/setters, `@NoArgsConstructor`, `@AllArgsConstructor`.

## File: `backend/src/main/java/com/multifitaundh/service/TrainerService.java`
This file implements the business logic for managing `Trainer` entities. It interacts with `TrainerRepository` and maps entities to DTOs.
-   **Dependencies:** Injects `TrainerRepository`.
-   **Public Methods:**
    -   `public List<TrainerDto> getAllTrainers()`
        1.  Retrieve all `Trainer` entities from `trainerRepository.findAll()`.
        2.  Map each `Trainer` entity to a `TrainerDto`.
        3.  Return the list of `TrainerDto`.
    -   `public TrainerDto getTrainerById(UUID id)`
        1.  Retrieve a `Trainer` entity by `id` from `trainerRepository.findById(id)`.
        2.  If the `Trainer` is not found, throw `com.multifitaundh.exception.ResourceNotFoundException` with a message like "Trainer not found with ID: " + `id`.
        3.  Map the found `Trainer` entity to a `TrainerDto`.
        4.  Return the `TrainerDto`.
    -   `public TrainerDto createTrainer(CreateTrainerRequest request)`
        1.  Create a new `Trainer` entity.
        2.  Set the `id` of the new `Trainer` using `UUID.randomUUID()`.
        3.  Set `name`, `bio`, `specializations`, and `imageUrl` from the `request`.
        4.  Save the new `Trainer` entity using `trainerRepository.save()`.
        5.  Map the saved `Trainer` entity to a `TrainerDto`.
        6.  Return the `TrainerDto`.
    -   `public TrainerDto updateTrainer(UUID id, CreateTrainerRequest request)`
        1.  Retrieve an existing `Trainer` entity by `id` from `trainerRepository.findById(id)`.
        2.  If the `Trainer` is not found, throw `com.multifitaundh.exception.ResourceNotFoundException` with a message like "Trainer not found with ID: " + `id`.
        3.  Update the `name`, `bio`, `specializations`, and `imageUrl` of the existing `Trainer` entity from the `request`.
        4.  Save the updated `Trainer` entity using `trainerRepository.save()`.
        5.  Map the updated `Trainer` entity to a `TrainerDto`.
        6.  Return the `TrainerDto`.
    -   `public void deleteTrainer(UUID id)`
        1.  Check if a `Trainer` entity with the given `id` exists using `trainerRepository.existsById(id)`.
        2.  If the `Trainer` does not exist, throw `com.multifitaundh.exception.ResourceNotFoundException` with a message like "Trainer not found with ID: " + `id`.
        3.  Delete the `Trainer` entity using `trainerRepository.deleteById(id)`.

## File: `backend/src/main/java/com/multifitaundh/controller/TrainerController.java`
This file defines the public-facing REST controller for `Trainer` information. These endpoints are accessible to all users.
-   **Dependencies:** Injects `TrainerService`.
-   **Annotations:** `@RestController`, `@RequestMapping("/api/v1/trainers")`.
-   **API Endpoints:**
    -   `GET /api/v1/trainers`
        -   **Method:** `public ResponseEntity<List<TrainerDto>> getAllTrainers()`
        -   **Logic:**
            1.  Call `trainerService.getAllTrainers()`.
            2.  Return the result with HTTP status 200 OK.
    -   `GET /api/v1/trainers/{id}`
        -   **Method:** `public ResponseEntity<TrainerDto> getTrainerById(@PathVariable UUID id)`
        -   **Logic:**
            1.  Call `trainerService.getTrainerById(id)`.
            2.  Return the result with HTTP status 200 OK.
        -   **Error Cases:**
            -   If `trainerService.getTrainerById()` throws `ResourceNotFoundException`, return HTTP status 404 NOT FOUND.

## File: `backend/src/main/java/com/multifitaundh/controller/AdminTrainerController.java`
This file defines the administrative REST controller for `Trainer` CRUD operations. These endpoints are secured and require an ADMIN role.
-   **Dependencies:** Injects `TrainerService`.
-   **Annotations:** `@RestController`, `@RequestMapping("/api/v1/admin/trainers")`.
-   **API Endpoints:**
    -   `POST /api/v1/admin/trainers`
        -   **Method:** `public ResponseEntity<TrainerDto> createTrainer(@Valid @RequestBody CreateTrainerRequest request)`
        -   **Logic:**
            1.  Call `trainerService.createTrainer(request)`.
            2.  Return the result with HTTP status 201 CREATED.
    -   `PUT /api/v1/admin/trainers/{id}`
        -   **Method:** `public ResponseEntity<TrainerDto> updateTrainer(@PathVariable UUID id, @Valid @RequestBody CreateTrainerRequest request)`
        -   **Logic:**
            1.  Call `trainerService.updateTrainer(id, request)`.
            2.  Return the result with HTTP status 200 OK.
        -   **Error Cases:**
            -   If `trainerService.updateTrainer()` throws `ResourceNotFoundException`, return HTTP status 404 NOT FOUND.
    -   `DELETE /api/v1/admin/trainers/{id}`
        -   **Method:** `public ResponseEntity<Void> deleteTrainer(@PathVariable UUID id)`
        -   **Logic:**
            1.  Call `trainerService.deleteTrainer(id)`.
            2.  Return with HTTP status 204 NO CONTENT.
        -   **Error Cases:**
            -   If `trainerService.deleteTrainer()` throws `ResourceNotFoundException`, return HTTP status 404 NOT FOUND.

---

## Lead Management (Backend)

**Name:** `lead-management-backend`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/multifitaundh/model/TrialLead.java` — MODEL layer - Defines the TrialLead entity for storing information captured from the free trial form on the homepage.
- `backend/src/main/java/com/multifitaundh/repository/TrialLeadRepository.java` — REPOSITORY layer - Provides data access for TrialLead entities, including a findAllByOrderBySubmittedAtDesc() method for the admin panel.
- `backend/src/main/java/com/multifitaundh/dto/TrialLeadDto.java` — DTO layer - Defines the representation of a TrialLead for the admin API, ensuring all captured data is available.
- `backend/src/main/java/com/multifitaundh/dto/CreateTrialLeadRequest.java` — DTO layer - Defines the request body for the public-facing trial lead submission form, with validation for all fields.
- `backend/src/main/java/com/multifitaundh/service/TrialLeadService.java` — SERVICE layer - Implements business logic for trial leads, including createTrialLead(CreateTrialLeadRequest): TrialLeadDto for the public form and getAllTrialLeads(): List<TrialLeadDto> for the admin panel.
- `backend/src/main/java/com/multifitaundh/controller/TrialLeadController.java` — CONTROLLER layer - Exposes the public POST /api/v1/trials endpoint for the '3-Day Free Trial' form submission.
- `backend/src/main/java/com/multifitaundh/controller/AdminTrialLeadController.java` — CONTROLLER layer - Provides the secured GET /api/v1/admin/trials endpoint for admins to view all captured leads.

**Feature Instruction:**

The `lead-management-backend` feature provides the backend functionality for capturing and managing trial leads for MultiFit Aundh. It consists of a JPA entity, a repository, DTOs for request and response, a service layer for business logic, and two controllers: one for public submission and one for admin viewing.

### `TrialLead.java` (Model)
This file defines the `TrialLead` JPA entity. It maps to a database table and holds the following fields:
- `id`: `UUID` (Primary key, auto-generated).
- `name`: `String` (Lead's full name).
- `email`: `String` (Lead's email address).
- `phone`: `String` (Lead's phone number).
- `submittedAt`: `LocalDateTime` (Timestamp of when the lead was submitted).

### `TrialLeadRepository.java` (Repository)
This interface extends `JpaRepository<TrialLead, UUID>` to provide standard CRUD operations for `TrialLead` entities. It declares one custom finder method:
- `findAllByOrderBySubmittedAtDesc()`: `List<TrialLead>`
  - **Logic**: Retrieves all `TrialLead` entities from the database, ordered in descending order by their `submittedAt` timestamp.

### `TrialLeadDto.java` (DTO)
This class serves as a Data Transfer Object for `TrialLead` entities, used in API responses. It contains the following fields:
- `id`: `UUID`
- `name`: `String`
- `email`: `String`
- `phone`: `String`
- `submittedAt`: `LocalDateTime`

### `CreateTrialLeadRequest.java` (DTO)
This class serves as a Data Transfer Object for receiving new trial lead submissions via API requests. It contains the following fields, with validation annotations:
- `name`: `String` (@NotBlank)
- `email`: `String` (@NotBlank, @Email)
- `phone`: `String` (@NotBlank)

### `TrialLeadService.java` (Service)
This class implements the business logic for managing trial leads. It is annotated with `@Service` and injects `TrialLeadRepository`.

#### Public Methods:

1.  `createTrialLead(CreateTrialLeadRequest request)`: `TrialLeadDto`
    - **Logic**:
        1.  Create a new `TrialLead` entity.
        2.  Set the `name`, `email`, and `phone` from the `request` DTO.
        3.  Set `submittedAt` to `LocalDateTime.now()`.
        4.  Save the `TrialLead` entity using `trialLeadRepository.save()`.
        5.  Convert the saved `TrialLead` entity to a `TrialLeadDto`.
        6.  Return the `TrialLeadDto`.
    - **Error Cases**: Throws `IllegalArgumentException` if input `request` is invalid (handled by Spring's `@Valid` in controller).

2.  `getAllTrialLeads()`: `List<TrialLeadDto>`
    - **Logic**:
        1.  Retrieve all `TrialLead` entities using `trialLeadRepository.findAllByOrderBySubmittedAtDesc()`.
        2.  Map each `TrialLead` entity to a `TrialLeadDto`.
        3.  Return the list of `TrialLeadDto`.

### `TrialLeadController.java` (Controller - Public)
This REST controller handles public-facing API requests for trial lead submission. It is annotated with `@RestController` and `@RequestMapping("/api/v1/trials")`. It injects `TrialLeadService`.

#### API Endpoints:

1.  `POST /api/v1/trials`
    - **Description**: Submits a new trial lead from the public '3-Day Free Trial' form.
    - **Request Body**: `CreateTrialLeadRequest` (validated with `@Valid`)
    - **Response Body**: `TrialLeadDto`
    - **Logic**:
        1.  Receive the `CreateTrialLeadRequest`.
        2.  Call `trialLeadService.createTrialLead(request)`.
        3.  Return the resulting `TrialLeadDto` with HTTP status `201 Created`.
    - **Error Cases**: Returns `400 Bad Request` if `CreateTrialLeadRequest` fails validation.

### `AdminTrialLeadController.java` (Controller - Admin)
This REST controller handles admin-specific API requests for viewing trial leads. It is annotated with `@RestController` and `@RequestMapping("/api/v1/admin/trials")`. It injects `TrialLeadService`. This controller should be secured, requiring authentication and authorization for admin roles.

#### API Endpoints:

1.  `GET /api/v1/admin/trials`
    - **Description**: Retrieves all submitted trial leads for the admin panel.
    - **Request Body**: None
    - **Response Body**: `List<TrialLeadDto>`
    - **Logic**:
        1.  Call `trialLeadService.getAllTrialLeads()`.
        2.  Return the list of `TrialLeadDto` with HTTP status `200 OK`.
    - **Security**: This endpoint requires authentication and authorization (e.g., `hasRole('ADMIN')`).

---

## Core Frontend

**Name:** `core-frontend`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/api/client.ts` — SERVICE layer - Creates and exports a global Axios instance. It includes a request interceptor that reads the JWT from localStorage and adds the 'Authorization: Bearer {token}' header to all outgoing requests.
- `frontend/src/App.tsx` — PAGE layer - The application's entry point, which sets up react-router-dom routes for all public and admin pages. It wraps the entire application in necessary providers like QueryClientProvider and AuthProvider.
- `frontend/src/components/Layout.tsx` — COMPONENT layer - A wrapper component used by all public pages (HomePage, MembershipPage, etc.) to provide a consistent structure by rendering the Header, page-specific children, and the Footer.
- `frontend/src/components/Header.tsx` — COMPONENT layer - Renders the sticky top navigation bar. It includes the 'MultiFit Aundh' brand name, navigation links derived from recommendedPages, and a high-visibility 'Get a 3-Day Free Trial' CTA button styled with the accent color.
- `frontend/src/components/Footer.tsx` — COMPONENT layer - Renders the site footer in a three-column layout. It displays the business address, phone number, opening hours, and an embedded Google Map pointing to the gym's location in Aundh, Pune.
- `frontend/src/pages/HomePage.tsx` — PAGE layer - The main landing page. It features a high-energy hero section, the prominent '3-Day Free Trial' form, sections highlighting class types and trainers, and a testimonials section to build social proof.

**Feature Instruction:**

## Design Tokens
- Navbar: bg-[#1A1A1A] text-[#F5F5F5]
- Primary CTA: bg-[#DFFF00] hover:bg-opacity-80 text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200
- Secondary CTA: border border-[#DFFF00] text-[#DFFF00] hover:bg-[#DFFF00] hover:text-[#1A1A1A] font-semibold rounded-full px-6 py-2 transition-all duration-200
- Brand text accent: text-[#DFFF00]
- Section bg: bg-[#F5F5F5] (light sections) / bg-[#333333] (dark sections)
- Card: bg-[#F5F5F5] rounded-xl shadow-md border border-gray-100 p-6
- Section container: <section className="py-16 px-4"><div className="max-w-7xl mx-auto">
- Hero h1: text-4xl md:text-6xl font-bold text-[#F5F5F5]
- Body text (light background): text-[#1A1A1A] leading-relaxed
- Body text (dark background): text-[#F5F5F5] leading-relaxed

This feature, `core-frontend`, establishes the foundational structure for the MultiFit Aundh website, including API client configuration, global routing, and shared layout components like the header and footer, along with the main landing page. All components and pages within this feature must strictly adhere to the defined design tokens for a consistent and branded user experience.

### `frontend/src/api/client.ts`
This file configures and exports a singleton Axios instance (`apiClient`) for all API communication. It ensures that every outgoing request includes the JWT for authentication.

**Public Variables:**
- `apiClient: AxiosInstance`
  - **Logic:**
    1.  Initialize an Axios instance with a base URL pointing to `/api/v1`. This assumes the backend API is served from the same domain under `/api/v1`.
    2.  Add a request interceptor to the `apiClient`.
    3.  Inside the interceptor, retrieve the JWT from `localStorage` using the key `'token'`.
    4.  If a token exists, set the `Authorization` header for the request to `Bearer {token}`.
    5.  Return the modified `config` object.

### `frontend/src/App.tsx`
This is the root component of the React application, responsible for setting up global providers and routing using `react-router-dom`. It ensures that the entire application is wrapped in necessary contexts like `QueryClientProvider` (from `@tanstack/react-query`) and `AuthProvider` (from `auth-ui`).

**Public Functions:**
- `App(): JSX.Element`
  - **Logic:**
    1.  Initialize `QueryClient` for `@tanstack/react-query`.
    2.  Return a `BrowserRouter` component.
    3.  Inside `BrowserRouter`, wrap the application with `QueryClientProvider` and `AuthProvider` (imported from `frontend/src/context/AuthContext.tsx` from the `auth-ui` feature).
    4.  Define `Routes` for the application:
        -   Route `/`: Renders `HomePage`.
        -   Route `/memberships`: Renders `MembershipPage` (imported from `frontend/src/pages/MembershipPage.tsx` from the `membership-ui` feature).
        -   Route `/trainers`: Renders `TrainersPage` (imported from `frontend/src/pages/TrainersPage.tsx` from the `trainer-profiles-ui` feature).
        -   Route `/login`: Renders `LoginPage` (imported from `frontend/src/pages/LoginPage.tsx` from the `auth-ui` feature).
        -   Route `/admin`: Renders `ProtectedRoute` (imported from `frontend/src/components/ProtectedRoute.tsx` from the `auth-ui` feature) wrapping `AdminDashboardPage` (imported from `frontend/src/pages/AdminDashboardPage.tsx` from the `admin-portal-ui` feature).

### `frontend/src/components/Layout.tsx`
This component provides the main layout for all public-facing pages, ensuring a consistent header and footer across the site.

**Public Functions:**
- `Layout({ children: React.ReactNode }): JSX.Element`
  - **Logic:**
    1.  Render the `Header` component.
    2.  Render the `children` prop within a `<main>` tag.
    3.  Render the `Footer` component.

### `frontend/src/components/Header.tsx`
This component renders the responsive navigation header for the website, featuring the brand name, navigation links, and a prominent call-to-action.

**Public Functions:**
- `Header(): JSX.Element`
  - **Logic:**
    1.  Render a sticky top navigation bar with `bg-[#1A1A1A]` and `text-[#F5F5F5]`.
    2.  Display the brand name "MultiFit Aundh" with `text-[#DFFF00]` accent for "MultiFit" and `font-bold`.
    3.  Include navigation links:
        -   "Home" linking to `/`
        -   "Memberships" linking to `/memberships`
        -   "Trainers" linking to `/trainers`
    4.  Include a high-visibility CTA button: "Get a 3-Day Free Trial" styled with `Primary CTA` design token, linking to `/`.
    5.  Implement responsive design for mobile navigation (e.g., a hamburger menu).

### `frontend/src/components/Footer.tsx`
This component renders the site-wide footer, displaying essential business contact information and an embedded map.

**Public Functions:**
- `Footer(): JSX.Element`
  - **Logic:**
    1.  Render a footer with `bg-[#1A1A1A]` and `text-[#F5F5F5]`.
    2.  Structure content in a three-column layout (or stacked on mobile).
    3.  **Column 1 (About MultiFit Aundh):** Display a brief, motivational statement about MultiFit Aundh, e.g., "MultiFit Aundh is your ultimate fitness destination, dedicated to helping you achieve your goals in a high-energy, supportive community. Unleash your potential with us!"
    4.  **Column 2 (Contact Information):**
        -   **Address:** "Multifit Aundh , D.P. Road Medipoint Hospital Road, opp. to Indian Bank, Aundh, Pune, Maharashtra 411067"
        -   **Phone:** "075070 08009"
        -   **Opening Hours:** "Please contact us for current hours."
    5.  **Column 3 (Location Map):** Embed a Google Map iframe pointing to the gym's coordinates: `18.562876, 73.783691` (Aundh, Pune). The iframe should be responsive and clearly display the gym's location.
    6.  Include a copyright notice: "© {Current Year} MultiFit Aundh. All rights reserved."

### `frontend/src/pages/HomePage.tsx`
This is the main landing page, designed to be energetic and action-oriented, guiding users towards key calls-to-action.

**Public Functions:**
- `HomePage(): JSX.Element`
  - **Logic:**
    1.  Wrap the entire page content within the `Layout` component.
    2.  **Hero Section:**
        -   Full-width section with a dynamic background image: `url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80)` with a `bg-black bg-opacity-50` overlay.
        -   Headline: "MultiFit Aundh: Your Antidote to Boring Gyms" (using `Hero h1` design token).
        -   Subheadline: "Unleash Your Potential. Join Our Vibrant Community Today!" (using `text-[#F5F5F5]` and `text-xl md:text-2xl`).
        -   Primary CTA button: "Start Your 3-Day Free Trial" (using `Primary CTA` design token), linking to `/` (or scrolling to the trial form section).
    3.  **"Experience the Difference" Section:**
        -   `Section bg: bg-[#F5F5F5]`
        -   Heading: "Experience the MultiFit Aundh Difference" (`text-3xl font-bold text-[#1A1A1A]`)
        -   Body: Engaging copy about the gym's unique offerings, community, and state-of-the-art facilities. (`Body text (light background)`)
    4.  **"Your Free Trial Awaits" Section:**
        -   `Section bg: bg-[#333333]`
        -   Heading: "Your Journey Starts Here: Claim Your 3-Day Free Trial" (`text-3xl font-bold text-[#F5F5F5]`)
        -   Embed the `TrialForm` component (imported from `frontend/src/components/TrialForm.tsx` from the `lead-capture-ui` feature).
    5.  **"Diverse Classes for Every Goal" Section:**
        -   `Section bg: bg-[#F5F5F5]`
        -   Heading: "Diverse Classes for Every Goal" (`text-3xl font-bold text-[#1A1A1A]`)
        -   Body: Placeholder content describing various class types (e.g., HIIT, Yoga, Strength Training, Zumba) with motivating descriptions. (`Body text (light background)`)
        -   Secondary CTA button: "Explore All Classes" (using `Secondary CTA` design token), linking to `/memberships`.
    6.  **"Meet Our Expert Trainers" Section:**
        -   `Section bg: bg-[#333333]`
        -   Heading: "Meet Our Expert Trainers" (`text-3xl font-bold text-[#F5F5F5]`)
        -   Body: Placeholder content highlighting the expertise and dedication of MultiFit Aundh's trainers. (`Body text (dark background)`)
        -   Secondary CTA button: "View All Trainers" (using `Secondary CTA` design token), linking to `/trainers`.
    7.  **Testimonials Section:**
        -   `Section bg: bg-[#F5F5F5]`
        -   Heading: "What Our Members Say" (`text-3xl font-bold text-[#1A1A1A]`)
        -   Embed the `TestimonialsSection` component (imported from `frontend/src/components/TestimonialsSection.tsx` - *Note: This component is not listed in the feature spec, so it should be a placeholder or a simple static section within HomePage.tsx itself, or the instruction should explicitly state it needs to be created as part of this feature. Given the current spec, it's best to treat it as a static section within HomePage.tsx for now.*).
        -   Display a few compelling testimonials from satisfied MultiFit Aundh members, focusing on community, results, and positive experiences. (`Body text (light background)`)


---

## Authentication UI

**Name:** `auth-ui`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/components/ProtectedRoute.tsx` — COMPONENT layer - A route wrapper that uses the useAuth hook to check for an authenticated user. If the user is not logged in, it redirects them to '/login'; otherwise, it renders the child component.
- `frontend/src/context/AuthContext.tsx` — CONTEXT layer - Manages global authentication state (token, user role). It exposes login(email, password) and logout() functions, storing the JWT in localStorage under the key 'token'.
- `frontend/src/hooks/useAuth.ts` — HOOK layer - A simple hook that provides a convenient way for components to access the authentication context's values (e.g., user, isAuthenticated, login, logout) without directly using useContext.
- `frontend/src/services/authService.ts` — SERVICE layer - Contains the login(credentials): Promise<AuthResponse> function, which makes the actual HTTP POST request to /api/v1/auth/login using the shared apiClient.
- `frontend/src/types/auth.ts` — UTIL layer - Exports TypeScript interfaces (LoginCredentials, AuthResponse) that define the data structures for the authentication feature, ensuring type safety between services, hooks, and components.
- `frontend/src/pages/LoginPage.tsx` — PAGE layer - Renders a simple form with email and password fields. It uses react-hook-form for state management and calls the login function from the useAuth hook upon submission. On success, it navigates to /admin/dashboard.

**Feature Instruction:**

## Design Tokens
- Page Background: bg-[#1A1A1A]
- Form Container: bg-[#333333] rounded-xl shadow-lg p-8 md:p-10 max-w-md w-full mx-auto
- Heading: text-[#F5F5F5] text-3xl font-bold text-center mb-6
- Input Label: text-[#F5F5F5] text-sm font-medium mb-2
- Input Field: bg-gray-700 text-[#F5F5F5] border border-gray-600 rounded-md p-3 w-full focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent
- Primary Button: bg-[#DFFF00] text-[#1A1A1A] font-bold py-3 px-6 rounded-md w-full hover:bg-opacity-90 transition-all duration-200
- Error Text: text-red-400 text-sm mt-2

This feature provides a complete authentication UI, including types, a service for API interaction, a React context for global state management, a custom hook for easy context access, a protected route component, and a login page.

### `frontend/src/types/auth.ts`
This file defines the TypeScript interfaces for authentication data structures.

**Interfaces:**
1.  **`LoginCredentials`**
    *   `email: string`
    *   `password: string`
2.  **`AuthResponse`**
    *   `token: string`
    *   `role: string`

### `frontend/src/services/authService.ts`
This service handles API calls related to authentication.

**Dependencies:**
*   Imports `apiClient` from `frontend/src/api/client.ts`.
*   Imports `LoginCredentials` and `AuthResponse` from `frontend/src/types/auth.ts`.

**Public Functions:**
1.  **`login(credentials: LoginCredentials): Promise<AuthResponse>`**
    *   **Logic:**
        1.  Makes an HTTP POST request to `/api/v1/auth/login` using `apiClient`.
        2.  The request body should be the `credentials` object.
        3.  Returns the `AuthResponse` from the successful API call.
    *   **Error Cases:** Throws an error if the API call fails (e.g., invalid credentials, network error).

### `frontend/src/context/AuthContext.tsx`
This file provides a React Context for managing global authentication state.

**Dependencies:**
*   Imports `login` from `frontend/src/services/authService.ts`.
*   Imports `LoginCredentials` and `AuthResponse` from `frontend/src/types/auth.ts`.
*   Imports `createContext`, `useContext`, `useState`, `useEffect` from 'react'.

**Interfaces:**
1.  **`AuthContextType`**
    *   `isAuthenticated: boolean`
    *   `user: { role: string } | null`
    *   `login: (credentials: LoginCredentials) => Promise<void>`
    *   `logout: () => void`

**Public Functions:**
1.  **`AuthProvider({ children: React.ReactNode }): JSX.Element`**
    *   **Logic:**
        1.  Initializes state variables: `token` (string | null, from `localStorage`), `user` ({ role: string } | null), `isAuthenticated` (boolean).
        2.  On component mount, checks `localStorage` for a JWT under the key `'token'`. If found, sets `isAuthenticated` to `true` and `user` to `{ role: 'admin' }` (assuming only admin users log in via this flow for now, or decode role from token if available, but for simplicity, assume admin if token exists).
        3.  **`login(credentials: LoginCredentials): Promise<void>`**
            *   Calls `authService.login(credentials)`.
            *   On success, stores the received `token` in `localStorage` using the key `'token'`.
            *   Sets `isAuthenticated` to `true` and `user` to `{ role: response.role }` (or `{ role: 'admin' }` if `AuthResponse` doesn't include role).
            *   Handles errors by throwing them for the calling component to catch.
        4.  **`logout(): void`**
            *   Removes the `'token'` key from `localStorage`.
            *   Sets `isAuthenticated` to `false` and `user` to `null`.
        5.  Provides `isAuthenticated`, `user`, `login`, and `logout` through the `AuthContext.Provider` to its `children`.

### `frontend/src/hooks/useAuth.ts`
This custom hook provides a convenient way to access the authentication context.

**Dependencies:**
*   Imports `useContext` from 'react'.
*   Imports `AuthContext`, `AuthContextType` from `frontend/src/context/AuthContext.tsx`.

**Public Functions:**
1.  **`useAuth(): AuthContextType`**
    *   **Logic:**
        1.  Uses `useContext(AuthContext)` to retrieve the authentication context value.
        2.  Throws an error if `useAuth` is called outside of an `AuthProvider`.
        3.  Returns the `AuthContextType` object.

### `frontend/src/components/ProtectedRoute.tsx`
This component acts as a route guard, redirecting unauthenticated users.

**Dependencies:**
*   Imports `useAuth` from `frontend/src/hooks/useAuth.ts`.
*   Imports `Navigate` from 'react-router-dom'.

**Public Functions:**
1.  **`ProtectedRoute({ children: JSX.Element }): JSX.Element`**
    *   **Logic:**
        1.  Calls `useAuth()` to get the `isAuthenticated` status.
        2.  If `isAuthenticated` is `false`, it renders a `<Navigate to="/login" replace />` component to redirect the user to the login page.
        3.  If `isAuthenticated` is `true`, it renders the `children` prop, allowing access to the protected route.

### `frontend/src/pages/LoginPage.tsx`
This page renders the admin login form.

**Dependencies:**
*   Imports `useAuth` from `frontend/src/hooks/useAuth.ts`.
*   Imports `useForm` from 'react-hook-form'.
*   Imports `useNavigate` from 'react-router-dom'.
*   Imports `Layout` from `@/components/Layout`.

**Public Functions:**
1.  **`LoginPage(): JSX.Element`**
    *   **Structure and Design:**
        *   The page should be wrapped in `<Layout>`.
        *   The main content area should have a `min-h-screen` and use `flex items-center justify-center` to center the login form vertically and horizontally.
        *   The background should be `bg-[#1A1A1A]` (Page Background token).
        *   **Login Form Section:**
            *   Container: `div` with `bg-[#333333]` (Form Container token), `rounded-xl shadow-lg p-8 md:p-10 max-w-md w-full mx-auto`.
            *   **Heading:** `h1` with text "Welcome to MultiFit Aundh Admin" using `text-[#F5F5F5] text-3xl font-bold text-center mb-6` (Heading token).
            *   **Form Fields:**
                *   **Email Input:**
                    *   Label: "Email" using `text-[#F5F5F5] text-sm font-medium mb-2` (Input Label token).
                    *   Input: `input` of type `email`, `name="email"`, `placeholder="admin@multifit.com"` using `bg-gray-700 text-[#F5F5F5] border border-gray-600 rounded-md p-3 w-full focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent` (Input Field token).
                    *   Validation: Required, valid email format.
                *   **Password Input:**
                    *   Label: "Password" using `text-[#F5F5F5] text-sm font-medium mb-2` (Input Label token).
                    *   Input: `input` of type `password`, `name="password"`, `placeholder="••••••••"` using `bg-gray-700 text-[#F5F5F5] border border-gray-600 rounded-md p-3 w-full focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent` (Input Field token).
                    *   Validation: Required.
            *   **Submit Button:** `button` with text "Log In" using `bg-[#DFFF00] text-[#1A1A1A] font-bold py-3 px-6 rounded-md w-full hover:bg-opacity-90 transition-all duration-200` (Primary Button token).
            *   **Error Message Display:** A `p` tag to display login errors (e.g., "Invalid credentials") using `text-red-400 text-sm mt-2` (Error Text token).
    *   **Logic:**
        1.  Initializes `useForm` for managing form state and validation for `email` and `password` fields.
        2.  Obtains the `login` function from `useAuth()`.
        3.  Obtains the `navigate` function from `useNavigate()`.
        4.  Defines an `onSubmit` handler for the form:
            *   Calls `login(data.email, data.password)` with the form data.
            *   On successful login, navigates the user to `/admin/dashboard` using `navigate('/admin/dashboard')`.
            *   On login failure, sets a state variable to display an error message (e.g., "Invalid email or password.").
        5.  Renders the login form, binding inputs to `react-hook-form`'s `register` and displaying validation errors.

---

## Admin Portal UI

**Name:** `admin-portal-ui`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/components/AdminLayout.tsx` — COMPONENT layer - A wrapper for all admin pages. It provides a consistent UI with a left sidebar containing navigation links (Dashboard, Memberships, Trainers, Leads, Logout) and a main content area for the specific admin page's content.
- `frontend/src/pages/AdminDashboardPage.tsx` — PAGE layer - The landing page for the admin section. It is wrapped in AdminLayout and displays a welcome message and summary statistics (e.g., number of members, new trial leads).
- `frontend/src/pages/AdminLeadsPage.tsx` — PAGE layer - An admin-only page that uses the useTrialLeads hook to fetch and display all captured leads in a data table, sorted by submission date.
- `frontend/src/pages/AdminMembershipsPage.tsx` — PAGE layer - Provides a full CRUD interface for membership plans. It displays all plans in a table and includes modals for creating and editing plans, using react-hook-form for validation.
- `frontend/src/hooks/useAdminMemberships.ts` — HOOK layer - Provides React Query hooks for fetching all membership plans and mutations for create, update, and delete operations, used exclusively by the AdminMembershipsPage.
- `frontend/src/services/adminMembershipService.ts` — SERVICE layer - Contains functions for all admin-level CRUD operations on membership plans, making authenticated requests to the /api/v1/admin/memberships endpoints.
- `frontend/src/pages/AdminTrainersPage.tsx` — PAGE layer - Provides a full CRUD interface for trainer profiles. It displays all trainers in a table and includes modals for creating and editing profiles.
- `frontend/src/hooks/useAdminTrainers.ts` — HOOK layer - Provides React Query hooks for fetching all trainer profiles and mutations for create, update, and delete operations, used by the AdminTrainersPage.
- `frontend/src/services/adminTrainerService.ts` — SERVICE layer - Contains functions for all admin-level CRUD operations on trainers, making authenticated requests to the /api/v1/admin/trainers endpoints.

**Feature Instruction:**

## Design Tokens
- Navbar: bg-[#1A1A1A] text-white
- Sidebar: bg-[#333333] text-[#F5F5F5]
- Sidebar Active Link: bg-[#1A1A1A] text-[#DFFF00]
- Primary CTA: bg-[#DFFF00] hover:bg-opacity-80 text-[#1A1A1A] font-bold rounded-lg px-6 py-3 transition-all duration-200
- Brand text accent: text-[#DFFF00]
- Section bg: bg-[#F5F5F5]
- Card: bg-white rounded-xl shadow-md border border-gray-100 p-6
- Section container: <section className="py-8 px-4"><div className="max-w-7xl mx-auto">
- Body: text-gray-800 leading-relaxed

## Admin Portal UI Feature Instruction
This feature implements the administrative interface for MultiFit Aundh, providing a centralized portal for managing memberships, trainers, and trial leads. It consists of a shared admin layout, a dashboard, and dedicated pages for each management area, leveraging React Query for data fetching and mutations.

### `frontend/src/components/AdminLayout.tsx`
This component provides the overarching layout for all admin pages, featuring a persistent left-hand sidebar for navigation and a main content area. It ensures a consistent administrative user experience.

**Public Function:**
*   `AdminLayout({ children: React.ReactNode }): JSX.Element`
    1.  Renders a `div` with `flex` display to create a sidebar and main content layout.
    2.  The sidebar is a fixed-width `div` on the left, styled with `bg-[#333333]` and `text-[#F5F5F5]`. It contains:
        *   A brand logo/name for "MultiFit Aundh Admin" at the top.
        *   A `nav` element with `NavLink` components for:
            *   "Dashboard" (to `/admin/dashboard`)
            *   "Memberships" (to `/admin/memberships`)
            *   "Trainers" (to `/admin/trainers`)
            *   "Leads" (to `/admin/leads`)
        *   Each `NavLink` should apply `bg-[#1A1A1A] text-[#DFFF00]` when active, otherwise `text-[#F5F5F5]`.
        *   A "Logout" button/link at the bottom of the sidebar. This button calls the `logout()` function obtained from `useAuth()` (imported from `frontend/src/hooks/useAuth.ts` from the `auth-ui` feature). Upon logout, the user should be redirected to the login page (`/login`).
    3.  The main content area is a scrollable `div` that occupies the remaining width, styled with `bg-[#F5F5F5]`. It renders the `children` prop.

### `frontend/src/pages/AdminDashboardPage.tsx`
This page serves as the landing page for the admin section, providing a welcome message and summary statistics.

**Public Function:**
*   `AdminDashboardPage(): JSX.Element`
    1.  Wraps its content within the `AdminLayout` component.
    2.  Displays a prominent heading: "Welcome, MultiFit Aundh Admin!" styled with `text-3xl font-bold text-gray-900`.
    3.  Includes a grid of placeholder summary cards, each styled with `bg-white rounded-xl shadow-md border border-gray-100 p-6`.
        *   Example cards: "Total Members: 150", "New Trial Leads (Last 30 Days): 12", "Active Trainers: 5". These values are static placeholders.
    4.  The overall content area should use the `Section container` design token for padding and max-width.

### `frontend/src/pages/AdminLeadsPage.tsx`
This page displays a table of all submitted trial leads, fetched from the backend.

**Public Function:**
*   `AdminLeadsPage(): JSX.Element`
    1.  Wraps its content within the `AdminLayout` component.
    2.  Imports and utilizes the `useTrialLeads` hook from `frontend/src/hooks/useTrialLeads.ts` (from the `lead-capture-ui` feature) to fetch trial lead data. The `useTrialLeads` hook returns an object containing `data` (an array of `TrialLead` objects), `isLoading`, and `isError`.
    3.  Displays a heading: "Trial Leads" styled with `text-3xl font-bold text-gray-900`.
    4.  Shows a loading indicator if `isLoading` is true.
    5.  Displays an error message if `isError` is true.
    6.  Renders a responsive HTML table to display the `TrialLead` data. The table should have columns for:
        *   `name`
        *   `email`
        *   `phone`
        *   `membershipInterest`
        *   `submittedAt` (formatted for readability, e.g., using `new Date().toLocaleString()`).
    7.  The leads should be displayed sorted by `submittedAt` in descending order (most recent first), as provided by the `useTrialLeads` hook.
    8.  The overall content area should use the `Section container` design token for padding and max-width.

### `frontend/src/pages/AdminMembershipsPage.tsx`
This page provides a full CRUD interface for managing membership plans.

**Public Function:**
*   `AdminMembershipsPage(): JSX.Element`
    1.  Wraps its content within the `AdminLayout` component.
    2.  Imports and utilizes the `useAdminMemberships` hook.
    3.  Displays a heading: "Membership Plans" styled with `text-3xl font-bold text-gray-900`.
    4.  Includes a "Create New Plan" button, styled with the `Primary CTA` design token. Clicking this button opens a modal for creating a new membership plan.
    5.  Shows a loading indicator if `useAdminMemberships().getAllMembershipPlans.isLoading` is true.
    6.  Displays an error message if `useAdminMemberships().getAllMembershipPlans.isError` is true.
    7.  Renders a responsive HTML table to display existing membership plans. Columns include:
        *   `name`
        *   `description`
        *   `price`
        *   `durationMonths`
        *   `active` (displayed as a checkbox or status text)
        *   "Actions" column with "Edit" and "Delete" buttons for each row.
    8.  **Create/Edit Plan Modal:**
        *   A modal component is used for both creating and editing plans.
        *   The form within the modal uses `react-hook-form` for input management and validation.
        *   Fields: `name` (string, required), `description` (string, required), `price` (number, required, min 0), `durationMonths` (number, required, min 1), `active` (boolean, default true).
        *   When creating, the form is empty. When editing, the form is pre-populated with the selected plan's data.
        *   On submission, calls `useAdminMemberships().createMembershipPlan.mutate()` or `useAdminMemberships().updateMembershipPlan.mutate()` respectively.
    9.  **Delete Plan Confirmation Modal:**
        *   A simple confirmation modal appears when the "Delete" button is clicked.
        *   On confirmation, calls `useAdminMemberships().deleteMembershipPlan.mutate()`.
    10. The overall content area should use the `Section container` design token for padding and max-width.

### `frontend/src/hooks/useAdminMemberships.ts`
This React Query hook provides functions for fetching and modifying membership plan data for the admin interface.

**Public Functions:** (These are implicitly provided by the hook's return value)
*   `useAdminMemberships(): { getAllMembershipPlans: UseQueryResult<MembershipPlan[]>, createMembershipPlan: UseMutationResult, updateMembershipPlan: UseMutationResult, deleteMembershipPlan: UseMutationResult }`
    1.  Imports `adminMembershipService` from `frontend/src/services/adminMembershipService.ts` and `MembershipPlan` type from `frontend/src/types/membership.ts`.
    2.  `getAllMembershipPlans`: A `useQuery` hook to fetch all membership plans. The query key is `['adminMemberships']`. It calls `adminMembershipService.getAllMembershipPlans()`.
    3.  `createMembershipPlan`: A `useMutation` hook for creating a new membership plan. It calls `adminMembershipService.createMembershipPlan(plan: Omit<MembershipPlan, 'id'>)`. On success, it invalidates and refetches the `['adminMemberships']` query.
    4.  `updateMembershipPlan`: A `useMutation` hook for updating an existing membership plan. It calls `adminMembershipService.updateMembershipPlan(id: string, plan: Omit<MembershipPlan, 'id'>)`. On success, it invalidates and refetches the `['adminMemberships']` query.
    5.  `deleteMembershipPlan`: A `useMutation` hook for deleting a membership plan. It calls `adminMembershipService.deleteMembershipPlan(id: string)`. On success, it invalidates and refetches the `['adminMemberships']` query.

### `frontend/src/services/adminMembershipService.ts`
This service handles API calls related to admin-level membership plan management.

**Public Functions:** (These are exported functions)
*   `getAllMembershipPlans(): Promise<MembershipPlan[]>`
    1.  Makes an authenticated `GET` request to `/api/v1/admin/memberships` using `apiClient` (imported from `frontend/src/api/client.ts`).
    2.  Returns a `Promise` that resolves to `List<MembershipPlanDto>` (mapped to `MembershipPlan[]`).
*   `createMembershipPlan(plan: Omit<MembershipPlan, 'id'>): Promise<MembershipPlan>`
    1.  Makes an authenticated `POST` request to `/api/v1/admin/memberships` using `apiClient`.
    2.  The request body is the `plan` object.
    3.  Returns a `Promise` that resolves to `MembershipPlanDto` (mapped to `MembershipPlan`).
*   `updateMembershipPlan(id: string, plan: Omit<MembershipPlan, 'id'>): Promise<MembershipPlan>`
    1.  Makes an authenticated `PUT` request to `/api/v1/admin/memberships/{id}` (where `{id}` is the `id` parameter) using `apiClient`.
    2.  The request body is the `plan` object.
    3.  Returns a `Promise` that resolves to `MembershipPlanDto` (mapped to `MembershipPlan`).
*   `deleteMembershipPlan(id: string): Promise<void>`
    1.  Makes an authenticated `DELETE` request to `/api/v1/admin/memberships/{id}` (where `{id}` is the `id` parameter) using `apiClient`.
    2.  Returns a `Promise` that resolves when the deletion is successful.

### `frontend/src/pages/AdminTrainersPage.tsx`
This page provides a full CRUD interface for managing trainer profiles.

**Public Function:**
*   `AdminTrainersPage(): JSX.Element`
    1.  Wraps its content within the `AdminLayout` component.
    2.  Imports and utilizes the `useAdminTrainers` hook.
    3.  Displays a heading: "Trainer Profiles" styled with `text-3xl font-bold text-gray-900`.
    4.  Includes a "Create New Trainer" button, styled with the `Primary CTA` design token. Clicking this button opens a modal for creating a new trainer profile.
    5.  Shows a loading indicator if `useAdminTrainers().getAllTrainers.isLoading` is true.
    6.  Displays an error message if `useAdminTrainers().getAllTrainers.isError` is true.
    7.  Renders a responsive HTML table to display existing trainer profiles. Columns include:
        *   `firstName`
        *   `lastName`
        *   `specialization`
        *   `bio` (possibly truncated for table display)
        *   `imageUrl` (displayed as a small thumbnail image)
        *   "Actions" column with "Edit" and "Delete" buttons for each row.
    8.  **Create/Edit Trainer Modal:**
        *   A modal component is used for both creating and editing trainers.
        *   The form within the modal uses `react-hook-form` for input management and validation.
        *   Fields: `firstName` (string, required), `lastName` (string, required), `specialization` (string, required), `bio` (string, required), `imageUrl` (string, required, must be a valid URL).
        *   When creating, the form is empty. When editing, the form is pre-populated with the selected trainer's data.
        *   On submission, calls `useAdminTrainers().createTrainer.mutate()` or `useAdminTrainers().updateTrainer.mutate()` respectively.
    9.  **Delete Trainer Confirmation Modal:**
        *   A simple confirmation modal appears when the "Delete" button is clicked.
        *   On confirmation, calls `useAdminTrainers().deleteTrainer.mutate()`.
    10. The overall content area should use the `Section container` design token for padding and max-width.

### `frontend/src/hooks/useAdminTrainers.ts`
This React Query hook provides functions for fetching and modifying trainer profile data for the admin interface.

**Public Functions:** (These are implicitly provided by the hook's return value)
*   `useAdminTrainers(): { getAllTrainers: UseQueryResult<Trainer[]>, createTrainer: UseMutationResult, updateTrainer: UseMutationResult, deleteTrainer: UseMutationResult }`
    1.  Imports `adminTrainerService` from `frontend/src/services/adminTrainerService.ts` and `Trainer` type from `frontend/src/types/trainer.ts`.
    2.  `getAllTrainers`: A `useQuery` hook to fetch all trainer profiles. The query key is `['adminTrainers']`. It calls `adminTrainerService.getAllTrainers()`.
    3.  `createTrainer`: A `useMutation` hook for creating a new trainer profile. It calls `adminTrainerService.createTrainer(trainer: Omit<Trainer, 'id'>)`. On success, it invalidates and refetches the `['adminTrainers']` query.
    4.  `updateTrainer`: A `useMutation` hook for updating an existing trainer profile. It calls `adminTrainerService.updateTrainer(id: string, trainer: Omit<Trainer, 'id'>)`. On success, it invalidates and refetches the `['adminTrainers']` query.
    5.  `deleteTrainer`: A `useMutation` hook for deleting a trainer profile. It calls `adminTrainerService.deleteTrainer(id: string)`. On success, it invalidates and refetches the `['adminTrainers']` query.

### `frontend/src/services/adminTrainerService.ts`
This service handles API calls related to admin-level trainer profile management.

**Public Functions:** (These are exported functions)
*   `getAllTrainers(): Promise<Trainer[]>`
    1.  Makes an authenticated `GET` request to `/api/v1/trainers` using `apiClient` (imported from `frontend/src/api/client.ts`).
    2.  Returns a `Promise` that resolves to `List<TrainerDto>` (mapped to `Trainer[]`).
*   `createTrainer(trainer: Omit<Trainer, 'id'>): Promise<Trainer>`
    1.  Makes an authenticated `POST` request to `/api/v1/admin/trainers` using `apiClient`.
    2.  The request body is the `trainer` object.
    3.  Returns a `Promise` that resolves to `TrainerDto` (mapped to `Trainer`).
*   `updateTrainer(id: string, trainer: Omit<Trainer, 'id'>): Promise<Trainer>`
    1.  Makes an authenticated `PUT` request to `/api/v1/admin/trainers/{id}` (where `{id}` is the `id` parameter) using `apiClient`.
    2.  The request body is the `trainer` object.
    3.  Returns a `Promise` that resolves to `TrainerDto` (mapped to `Trainer`).
*   `deleteTrainer(id: string): Promise<void>`
    1.  Makes an authenticated `DELETE` request to `/api/v1/admin/trainers/{id}` (where `{id}` is the `id` parameter) using `apiClient`.
    2.  Returns a `Promise` that resolves when the deletion is successful.

## Inter-file Wiring and Cross-Feature Contracts
*   `AdminLayout.tsx` injects `useAuth` from `frontend/src/hooks/useAuth.ts` (from the `auth-ui` feature) to handle user logout.
*   `AdminLeadsPage.tsx` injects `useTrialLeads` from `frontend/src/hooks/useTrialLeads.ts` (from the `lead-capture-ui` feature). This hook internally calls `trialLeadService.getTrialLeads()` from the `lead-capture-ui` feature, which in turn makes a `GET` request to `/api/v1/admin/trials` (from the `lead-management-backend` feature).
*   `AdminMembershipsPage.tsx` injects `useAdminMemberships` from `frontend/src/hooks/useAdminMemberships.ts`.
*   `useAdminMemberships.ts` injects `adminMembershipService` from `frontend/src/services/adminMembershipService.ts`.
*   `adminMembershipService.ts` makes authenticated API calls using `apiClient` (from `frontend/src/api/client.ts` in the `shared-backend` feature) to the `membership-management-backend` feature's endpoints:
    *   `GET /api/v1/admin/memberships`
    *   `POST /api/v1/admin/memberships`
    *   `PUT /api/v1/admin/memberships/{id}`
    *   `DELETE /api/v1/admin/memberships/{id}`
*   `AdminTrainersPage.tsx` injects `useAdminTrainers` from `frontend/src/hooks/useAdminTrainers.ts`.
*   `useAdminTrainers.ts` injects `adminTrainerService` from `frontend/src/services/adminTrainerService.ts`.
*   `adminTrainerService.ts` makes authenticated API calls using `apiClient` (from `frontend/src/api/client.ts` in the `shared-backend` feature) to the `content-management-backend` feature's endpoints:
    *   `GET /api/v1/trainers`
    *   `POST /api/v1/admin/trainers`
    *   `PUT /api/v1/admin/trainers/{id}`
    *   `DELETE /api/v1/admin/trainers/{id}`
*   The JWT for authentication is stored in `localStorage` under the key `'token'`, as managed by the `auth-ui` feature's `AuthContext` and consumed by `apiClient`.

---

## Lead Capture UI

**Name:** `lead-capture-ui`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/components/TrialForm.tsx` — COMPONENT layer - A reusable form for trial sign-ups with fields for name, email, and phone. It uses react-hook-form and zod for validation and calls the createTrialLead mutation from the useTrialLeads hook.
- `frontend/src/hooks/useTrialLeads.ts` — HOOK layer - Provides React Query hooks for interacting with trial lead data. The useCreateTrialLead() mutation is used by the public form, and useTrialLeads() query is used by the admin panel.
- `frontend/src/services/trialLeadService.ts` — SERVICE layer - Contains functions for making HTTP requests related to trial leads: createTrialLead(lead) for public submission and getTrialLeads() for the admin panel.
- `frontend/src/types/trial.ts` — UTIL layer - Exports TypeScript interfaces (TrialLead, CreateTrialLeadRequest) to ensure type safety across the trial lead feature's frontend files.

**Feature Instruction:**

## Design Tokens
- Navbar: bg-[#1A1A1A] text-[#F5F5F5]
- Primary CTA: bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200
- Brand text accent: text-[#DFFF00]
- Section bg: bg-[#1A1A1A] (dark sections) / bg-[#333333] (slightly lighter dark sections)
- Card: bg-[#333333] rounded-xl shadow-md border border-[#1A1A1A] p-6 text-[#F5F5F5]
- Section container: <section className="py-16 px-4"><div className="max-w-7xl mx-auto">
- Hero h1: text-4xl md:text-6xl font-bold text-[#F5F5F5]
- Body: text-[#F5F5F5] leading-relaxed
- Form input: bg-[#333333] text-[#F5F5F5] border border-[#1A1A1A] rounded-md p-3 focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent

This feature, `lead-capture-ui`, provides the frontend components, hooks, services, and types necessary for capturing '3-Day Free Trial' leads for MultiFit Aundh. It includes a public-facing form for lead submission and the underlying logic to interact with the backend API.

### `frontend/src/types/trial.ts`
This file defines the TypeScript interfaces for trial lead data, ensuring type safety across the feature.

**Public Variables:**
- `interface TrialLead`:
  - `id: string`
  - `name: string`
  - `email: string`
  - `phone: string`
  - `submittedAt: string` (ISO 8601 date string)
- `interface CreateTrialLeadRequest`:
  - `name: string`
  - `email: string`
  - `phone: string`

### `frontend/src/services/trialLeadService.ts`
This service layer file handles direct HTTP requests to the backend API related to trial leads. It imports `client.ts` for the Axios instance and `trial.ts` for type definitions.

**Public Functions:**
- `createTrialLead(lead: CreateTrialLeadRequest): Promise<TrialLead>`
  1. Makes a `POST` request to the `/api/v1/trials` endpoint with the `lead` object as the request body.
  2. Returns a `Promise` that resolves with the created `TrialLead` object from the response data.
- `getTrialLeads(): Promise<TrialLead[]>`
  1. Makes a `GET` request to the `/api/v1/admin/trials` endpoint.
  2. Returns a `Promise` that resolves with an array of `TrialLead` objects from the response data. This function is intended for admin use.

### `frontend/src/hooks/useTrialLeads.ts`
This file provides React Query hooks for managing trial lead data, abstracting the service calls for components. It imports `trialLeadService.ts` and `trial.ts`.

**Public Functions:**
- `useTrialLeads(): object`
  1. Uses `react-query`'s `useQuery` hook.
  2. `queryKey`: `['trialLeads']`
  3. `queryFn`: `trialLeadService.getTrialLeads`
  4. Returns the query object containing `data`, `isLoading`, `isError`, `error`, etc. This hook is for fetching all trial leads, typically used in an admin context.
- `useCreateTrialLead(): object`
  1. Uses `react-query`'s `useMutation` hook.
  2. `mutationFn`: `trialLeadService.createTrialLead`
  3. On successful mutation, it invalidates the `['trialLeads']` query using `queryClient.invalidateQueries(['trialLeads'])` to ensure any admin views are updated.
  4. Returns the mutation object containing `mutate`, `isLoading`, `isSuccess`, `isError`, `error`, etc. This hook is for submitting new trial leads.

### `frontend/src/components/TrialForm.tsx`
This component renders the '3-Day Free Trial' lead capture form. It uses `react-hook-form` for form management and `zod` for validation. It interacts with the `useCreateTrialLead` hook to submit data.

**Public Functions:**
- `TrialForm(): JSX.Element`
  1. Renders a form with fields for `name`, `email`, and `phone`.
  2. **Styling and Content:**
     - The form should be contained within a `div` or `section` that uses the `Card` design token for its background and styling (e.g., `bg-[#333333] rounded-xl shadow-md p-6 text-[#F5F5F5]`).
     - **Heading:** `h2` with text "Claim Your 3-Day Free Trial!" (using `text-2xl font-bold text-[#DFFF00] mb-4`).
     - **Sub-headline:** `p` with text "Experience MultiFit Aundh – the antidote to boring gyms. No commitments, just pure fitness." (using `text-[#F5F5F5] mb-6`).
     - Each input field (`name`, `email`, `phone`) should be a `label` and `input` pair.
     - **Input Field Styling:** Use the `Form input` design token (e.g., `bg-[#333333] text-[#F5F5F5] border border-[#1A1A1A] rounded-md p-3 focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent w-full`).
     - **Submit Button:** Use the `Primary CTA` design token (e.g., `bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200 w-full mt-6`). Button text: "Start Your Free Trial".
  3. **Form Validation:**
     - Define a `zod` schema for `CreateTrialLeadRequest`:
       - `name`: `z.string().min(1, 'Name is required.')`
       - `email`: `z.string().email('Invalid email address.').min(1, 'Email is required.')`
       - `phone`: `z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number.').min(1, 'Phone number is required.')` (E.164 format regex is a good standard).
     - Use `useForm` from `react-hook-form` with `zodResolver` for validation.
  4. **Data Submission:**
     - Call `useCreateTrialLead()` to get the `mutate` function and `isLoading`, `isSuccess`, `isError` states.
     - Implement an `onSubmit` handler that calls `mutate(data)` with the form data.
     - On successful submission (`isSuccess` becomes true), display a success message (e.g., a toast notification: "Thank you for your interest! We'll be in touch shortly to set up your trial.") and reset the form fields.
     - On error (`isError` becomes true), display an error message (e.g., a toast notification: "Failed to submit trial request. Please try again.").
  5. Display validation error messages below each input field if validation fails.

---

## Membership UI

**Name:** `membership-ui`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/pages/MembershipPage.tsx` — PAGE layer - Displays available membership plans fetched via the useMemberships hook. Each plan is shown in a styled card with its name, price, duration, and a 'Join Now' call-to-action.
- `frontend/src/hooks/useMemberships.ts` — HOOK layer - Provides the useMemberships() React Query hook, which calls the membershipService to fetch active plans and manages the request's loading, error, and data states.
- `frontend/src/services/membershipService.ts` — SERVICE layer - Contains the getMembershipPlans() function that makes the HTTP GET request to /api/v1/memberships to fetch public plan data.
- `frontend/src/types/membership.ts` — UTIL layer - Exports the MembershipPlan TypeScript interface, defining the shape of membership data used across the frontend feature.

**Feature Instruction:**

## Design Tokens
- Navbar: bg-[#1A1A1A] text-[#F5F5F5]
- Primary CTA: bg-[#DFFF00] hover:bg-[#DFFF00]/90 text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200
- Brand text accent: text-[#DFFF00]
- Section bg: bg-[#F5F5F5] (odd sections) / bg-gray-50 (even sections)
- Card: bg-white rounded-xl shadow-md border border-gray-100 p-6
- Section container: <section className="py-16 px-4"><div className="max-w-7xl mx-auto">
- Hero h1: text-4xl md:text-6xl font-bold text-white
- Body: text-gray-700 leading-relaxed

## Feature: Membership UI
This feature provides a public-facing page to display available membership plans for MultiFit Aundh, allowing potential members to view details and initiate a signup process. It consists of a type definition, a service for API calls, a React Query hook, and the main page component.

### File: `frontend/src/types/membership.ts`
This file defines the TypeScript interface for a `MembershipPlan`.

**Public Variables:**
- `interface MembershipPlan`:
  - `id: string`: Unique identifier for the membership plan.
  - `name: string`: The name of the membership plan (e.g., "Monthly Pass", "Annual Unlimited").
  - `description: string`: A brief description of the plan.
  - `price: number`: The cost of the membership plan.
  - `durationMonths: number`: The duration of the plan in months.
  - `features: string[]`: A list of key features or benefits included in the plan.
  - `active: boolean`: Indicates if the plan is currently active and available.

### File: `frontend/src/services/membershipService.ts`
This service handles API communication related to membership plans.

**Dependencies:**
- Imports `apiClient` from `frontend/src/api/client.ts`.
- Imports `MembershipPlan` from `frontend/src/types/membership.ts`.

**Public Functions:**
- `getMembershipPlans(): Promise<MembershipPlan[]>`:
  1.  Makes an HTTP GET request to the `/api/v1/memberships` endpoint using `apiClient`.
  2.  The `apiClient` automatically handles authentication headers if a token is present in `localStorage` under the key 'token'.
  3.  Returns a `Promise` that resolves to an array of `MembershipPlan` objects.
  4.  **Error Cases:** If the API call fails, the promise will reject with the `axios` error object.

### File: `frontend/src/hooks/useMemberships.ts`
This React Query hook provides an interface for fetching and managing membership plan data within React components.

**Dependencies:**
- Imports `useQuery` from `'@tanstack/react-query'`.
- Imports `getMembershipPlans` from `../services/membershipService.ts`.
- Imports `MembershipPlan` from `../types/membership.ts`.

**Public Functions:**
- `useMemberships(): { data: MembershipPlan[] | undefined, isLoading: boolean, isError: boolean, error: Error | null }`:
  1.  Uses `useQuery` from `@tanstack/react-query` to fetch membership plans.
  2.  The query key is `['memberships']`.
  3.  The query function calls `membershipService.getMembershipPlans()`.
  4.  Returns an object containing:
      - `data`: An array of `MembershipPlan` objects, or `undefined` if not yet fetched.
      - `isLoading`: A boolean indicating if the data is currently being fetched.
      - `isError`: A boolean indicating if an error occurred during fetching.
      - `error`: The error object if `isError` is true, otherwise `null`.

### File: `frontend/src/pages/MembershipPage.tsx`
This page component renders the available membership plans in a user-friendly layout.

**Dependencies:**
- Imports `Layout` from `@/components/Layout.tsx`.
- Imports `useMemberships` from `../hooks/useMemberships.ts`.

**Public Functions:**
- `MembershipPage(): JSX.Element`:
  1.  Renders the page content, wrapped within the `<Layout>` component from `core-frontend`.
  2.  Utilizes the `useMemberships()` hook to fetch membership plan data.
  3.  Displays a loading indicator (`<p>Loading plans...</p>`) while `isLoading` is true.
  4.  Displays an error message (`<p>Error loading membership plans: {error.message}</p>`) if `isError` is true.
  5.  If data is successfully loaded, it renders the following sections:
      -   **Hero Section:**
          -   Full-width section with a background image: `https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80`.
          -   An overlay `div` with `className="absolute inset-0 bg-black bg-opacity-50"`.
          -   Content centered vertically and horizontally, using `Hero h1` design token for the main headline.
          -   Headline: "Unleash Your Potential at MultiFit Aundh".
          -   Subheadline: "Join our vibrant community and transform your fitness journey. Choose the plan that powers your goals."
          -   A call-to-action button using the `Primary CTA` design token: "Start Your Journey".
      -   **Membership Plans Section:**
          -   Uses the `Section container` design token for layout.
          -   Heading: `<h2>` with text "Choose Your Path to Fitness" (using `Brand text accent` for emphasis).
          -   Subheading: `<p>` with motivational copy like "Find the perfect membership to match your ambition and lifestyle. Each plan is designed to help you thrive."
          -   Displays membership plans in a responsive grid (e.g., `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`).
          -   Each `MembershipPlan` is rendered within a card using the `Card` design token.
          -   Each card displays:
              -   The `name` of the plan as a prominent heading.
              -   The `price` (e.g., "₹{plan.price} / month").
              -   The `durationMonths` (e.g., "{plan.durationMonths} Month Plan").
              -   The `description`.
              -   A list of `features` (e.g., `<ul>` with `<li>` items).
              -   A "Join Now" button at the bottom of each card, using the `Primary CTA` design token.

**Inter-file Wiring:**
- `MembershipPage.tsx` imports and uses the `Layout` component from `core-frontend`.
- `MembershipPage.tsx` imports and calls the `useMemberships` hook.
- `useMemberships.ts` imports and calls `membershipService.getMembershipPlans`.
- `membershipService.ts` imports `apiClient` from `frontend/src/api/client.ts` to make HTTP requests.
- All files (`MembershipPage.tsx`, `useMemberships.ts`, `membershipService.ts`) import and use the `MembershipPlan` interface from `frontend/src/types/membership.ts`.

**Cross-Feature Contracts:**
- `membershipService.ts` makes a GET request to `/api/v1/memberships`, which is provided by the `membership-management-backend` feature's `MembershipPlanController.getActivePlans` endpoint.

---

## Trainer Profiles UI

**Name:** `trainer-profiles-ui`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/pages/TrainersPage.tsx` — PAGE layer - Displays a grid of trainer profiles, fetched using the useTrainers hook. Each profile card shows the trainer's photo, name, and specializations.
- `frontend/src/hooks/useTrainers.ts` — HOOK layer - Provides the useTrainers() React Query hook, which calls the trainerService to fetch all trainer profiles and manages the request's state.
- `frontend/src/services/trainerService.ts` — SERVICE layer - Contains the getTrainers() function that makes the HTTP GET request to /api/v1/trainers to fetch public trainer data.
- `frontend/src/types/trainer.ts` — UTIL layer - Exports the Trainer TypeScript interface, defining the shape of trainer data used across the frontend feature.

**Feature Instruction:**

## Design Tokens
- Navbar: bg-[#1A1A1A] text-[#F5F5F5]
- Primary CTA: bg-[#DFFF00] hover:bg-[#B3CC00] text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200
- Brand text accent: text-[#DFFF00]
- Section bg: bg-[#1A1A1A] (main sections) / bg-[#333333] (card backgrounds, alternating sections)
- Card: bg-[#333333] rounded-xl shadow-lg border border-gray-700 p-6 text-[#F5F5F5]
- Section container: <section className="py-16 px-4 bg-[#1A1A1A] text-[#F5F5F5]"><div className="max-w-7xl mx-auto">
- Hero h1: text-4xl md:text-6xl font-bold text-[#F5F5F5]
- Body: text-[#F5F5F5] leading-relaxed

## Feature: Trainer Profiles UI
This feature provides a public-facing page to display the profiles of all trainers at MultiFit Aundh. It consists of a type definition, a service for API calls, a React Query hook for data management, and the main page component.

### `frontend/src/types/trainer.ts`
This file defines the TypeScript interface for a `Trainer`.

**Interface: `Trainer`**
```

typescript
interface Trainer {
  id: string;
  name: string;
  specializations: string[];
  bio: string;
  imageUrl: string;
}


```

### `frontend/src/services/trainerService.ts`
This file contains functions for making API calls related to trainers. It depends on `frontend/src/api/client.ts` for HTTP requests and `frontend/src/types/trainer.ts` for type definitions.

**Function: `getTrainers()`**
- **Signature**: `getTrainers(): Promise<Trainer[]>`
- **Logic**:
  1.  Makes an HTTP GET request to the `/api/v1/trainers` endpoint using the `client` instance from `frontend/src/api/client.ts`.
  2.  The response body is expected to be an array of `Trainer` objects.
  3.  Returns a `Promise` that resolves with an array of `Trainer` objects.
- **Error Cases**: If the API call fails, the promise will reject with the error from the `client`.

### `frontend/src/hooks/useTrainers.ts`
This file provides a React Query hook for fetching trainer data, managing loading states, and caching. It depends on `frontend/src/services/trainerService.ts` and `frontend/src/types/trainer.ts`.

**Function: `useTrainers()`**
- **Signature**: `useTrainers(): { data: Trainer[] | undefined; isLoading: boolean; isError: boolean; error: Error | null }`
- **Logic**:
  1.  Uses `react-query`'s `useQuery` hook.
  2.  The query key is `['trainers']`.
  3.  The query function calls `trainerService.getTrainers()`.
  4.  Returns an object containing:
      -   `data`: An array of `Trainer` objects, or `undefined` if not yet fetched.
      -   `isLoading`: A boolean indicating if the data is currently being fetched.
      -   `isError`: A boolean indicating if an error occurred during fetching.
      -   `error`: The error object if `isError` is true, otherwise `null`.

### `frontend/src/pages/TrainersPage.tsx`
This file renders the main page displaying all trainer profiles. It depends on `frontend/src/components/Layout.tsx` for the overall page structure and `frontend/src/hooks/useTrainers.ts` to fetch trainer data.

**Function: `TrainersPage()`**
- **Signature**: `TrainersPage(): JSX.Element`
- **Logic**:
  1.  Wraps its content with the `<Layout>` component from `@/components/Layout.tsx`.
  2.  Calls the `useTrainers()` hook to fetch trainer data, destructuring `data` (aliased as `trainers`), `isLoading`, and `isError`.
  3.  **Hero Section**: Renders a full-width hero section with a dynamic background image and overlay.
      -   Background Image: Use `https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80` (Gym/fitness category).
      -   Overlay: `<div className="absolute inset-0 bg-black bg-opacity-50" />`.
      -   Headline (`h1`): "Meet Our Elite Trainers at MultiFit Aundh". Use `Hero h1` design token.
      -   Subheadline (`p`): "Dedicated to empowering your fitness journey with personalized guidance and unwavering support. Get ready to transform!" Use `Body` design token.
      -   Call to Action Button: "Join the MultiFit Family" using `Primary CTA` design token, linking to `/memberships`.
  4.  **Trainers Grid Section**: Renders a section to display the trainer profiles.
      -   Section container: Use `Section container` design token, with `bg-[#1A1A1A]`.
      -   Heading (`h2`): "Our Expert Team" using `text-3xl md:text-4xl font-bold text-[#F5F5F5] mb-12 text-center`.
      -   Conditional Rendering:
          -   If `isLoading` is true, display a loading message (e.g., "Loading trainers...").
          -   If `isError` is true, display an error message (e.g., "Failed to load trainers. Please try again later.").
          -   If `trainers` data is available and not empty, render a responsive grid (e.g., `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`).
  5.  **Trainer Card Rendering**: For each `trainer` in the `trainers` array:
      -   Render a card using the `Card` design token.
      -   Display the `trainer.imageUrl` at the top of the card (e.g., `img` tag with `object-cover w-full h-64 rounded-t-xl`).
      -   Display the `trainer.name` as a heading (e.g., `h3` with `text-2xl font-semibold mt-4 text-[#DFFF00]`).
      -   Display `trainer.specializations` (e.g., `p` with `text-gray-400 text-sm mt-2`). Join specializations with a comma and space.
      -   Display `trainer.bio` (e.g., `p` with `text-[#F5F5F5] mt-4`).

**Inter-file Wiring:**
- `TrainersPage.tsx` imports and uses `useTrainers.ts`.
- `useTrainers.ts` imports and uses `trainerService.ts`.
- `trainerService.ts` imports `frontend/src/api/client.ts` for making HTTP requests.
- `useTrainers.ts` and `trainerService.ts` import `frontend/src/types/trainer.ts` for type definitions.
- `TrainersPage.tsx` imports and uses `frontend/src/components/Layout.tsx`.

**Cross-Feature Contracts:**
- `trainerService.ts` makes a GET request to `/api/v1/trainers`, which is provided by the `content-management-backend` feature and returns `List<TrainerDto>` (which maps to `Trainer[]` in the frontend).

---

