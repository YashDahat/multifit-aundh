# Feature Enrichment — Attempt 4

Generated: 2026-07-04

Each section is one LLM call (~5–8K tokens). The instruction tells the generator how all files in the feature interact and what contracts they must honour.

---

## Authentication (Backend)

**Name:** `authentication-backend`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/multifitaundh/model/User.java` — MODEL layer — defines the core User entity for Spring Security authentication. Contains user credentials and role.
- `backend/src/main/java/com/multifitaundh/model/Role.java` — MODEL layer — defines the Role enum (ADMIN, CUSTOMER) used by the User entity and SecurityConfig for authorization.
- `backend/src/main/java/com/multifitaundh/repository/UserRepository.java` — REPOSITORY layer — provides data access methods for the User entity, including the critical findByEmail(String email) for the authentication flow.
- `backend/src/main/java/com/multifitaundh/service/UserService.java` — SERVICE layer — implements UserDetailsService.loadUserByUsername(String email) to integrate the User model with Spring Security's authentication manager.
- `backend/src/main/java/com/multifitaundh/util/JwtUtil.java` — UTIL layer — provides static methods for JWT operations: generateToken(UserDetails), validateToken(String, UserDetails), and extractEmail(String). Used by AuthController and JwtAuthFilter.
- `backend/src/main/java/com/multifitaundh/security/JwtAuthFilter.java` — CONFIG layer — a OncePerRequestFilter that validates the JWT Bearer token on incoming requests and sets the SecurityContextHolder if the token is valid.
- `backend/src/main/java/com/multifitaundh/config/SecurityConfig.java` — CONFIG layer — defines the main security filter chain, CORS configuration, password encoder, and HTTP authorization rules. Integrates JwtAuthFilter into the chain.
- `backend/src/main/java/com/multifitaundh/controller/AuthController.java` — CONTROLLER layer — exposes the public POST /api/v1/auth/login endpoint for user authentication. Delegates to AuthenticationManager and JwtUtil to generate a token.
- `backend/src/main/java/com/multifitaundh/dto/AuthRequest.java` — DTO layer — defines the request body for the login endpoint, containing email and password fields with validation annotations.
- `backend/src/main/java/com/multifitaundh/dto/AuthResponse.java` — DTO layer — defines the successful response body for the login endpoint, containing the JWT, user role, and expiration time.
- `backend/src/main/java/com/multifitaundh/config/AdminInitializer.java` — CONFIG layer — a CommandLineRunner that ensures an admin user exists on application startup, creating one from environment variables if necessary.

**Feature Instruction:**

This feature implements the backend authentication system for MultiFit Aundh, providing user registration, login, JWT generation, and Spring Security integration for authorization. It defines user roles, manages user data persistence, and secures API endpoints.

## File by File Breakdown

### `Role.java`
This file defines an enumeration for user roles within the MultiFit Aundh system.
- **Type**: Enum
- **Values**:
    - `ADMIN`: Represents an administrator with full system access.
    - `CUSTOMER`: Represents a standard member or customer.

### `User.java`
This file defines the `User` entity, which represents a user account in the MultiFit Aundh system. It is a JPA entity and implements Spring Security's `UserDetails` interface.
- **Class**: `User`
- **Annotations**: `@Entity`, `@Table(name = "users")`, `@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`
- **Fields**:
    - `id`: `UUID` (Primary key, `@Id`, `@GeneratedValue(strategy = GenerationType.UUID)`) - Automatically generated.
    - `email`: `String` (`@Column(unique = true, nullable = false)`) - User's email address, unique and not null.
    - `password`: `String` (`@Column(nullable = false)`) - BCrypt-hashed password, not null.
    - `role`: `Role` (`@Enumerated(EnumType.STRING)`, `@Column(nullable = false)`) - User's role (ADMIN or CUSTOMER), not null.
    - `createdAt`: `Instant` (`@CreationTimestamp`) - Timestamp of user creation.
    - `updatedAt`: `Instant` (`@UpdateTimestamp`) - Timestamp of last update.
- **Methods (implementing `UserDetails`)**:
    - `getAuthorities()`: `Collection<? extends GrantedAuthority>` - Returns a collection containing a `SimpleGrantedAuthority` for the user's `role`.
    - `getUsername()`: `String` - Returns the `email` field.
    - `getPassword()`: `String` - Returns the `password` field.
    - `isAccountNonExpired()`: `boolean` - Returns `true`.
    - `isAccountNonLocked()`: `boolean` - Returns `true`.
    - `isCredentialsNonExpired()`: `boolean` - Returns `true`.
    - `isEnabled()`: `boolean` - Returns `true`.

### `AuthRequest.java`
This file defines the Data Transfer Object (DTO) for user authentication requests.
- **Class**: `AuthRequest`
- **Annotations**: `@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`
- **Fields**:
    - `email`: `String` (`@NotBlank`, `@Email`) - User's email address, must be a valid email format and not blank.
    - `password`: `String` (`@NotBlank`) - User's password, must not be blank.

### `AuthResponse.java`
This file defines the Data Transfer Object (DTO) for successful authentication responses.
- **Class**: `AuthResponse`
- **Annotations**: `@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`
- **Fields**:
    - `token`: `String` - The generated JWT.
    - `role`: `String` - The user's role (e.g., "ADMIN").
    - `expiresAt`: `long` - Token expiration timestamp in epoch milliseconds.

### `UserRepository.java`
This file defines the Spring Data JPA repository for `User` entities.
- **Interface**: `UserRepository` extends `JpaRepository<User, UUID>`
- **Methods**:
    - `findByEmail(String email)`: `Optional<User>` - Finds a user by their unique email address.

### `UserService.java`
This file implements Spring Security's `UserDetailsService` to load user data for authentication.
- **Class**: `UserService`
- **Annotations**: `@Service`
- **Dependencies**: Injects `UserRepository`.
- **Methods**:
    - `loadUserByUsername(String email)`: `UserDetails`
        1.  Calls `userRepository.findByEmail(email)` to find the user.
        2.  If the user is not found, throws a `UsernameNotFoundException` with the message "User not found with email: " + `email`.
        3.  Returns the found `User` entity (which implements `UserDetails`).

### `JwtUtil.java`
This file provides utility methods for generating, validating, and parsing JSON Web Tokens (JWTs).
- **Class**: `JwtUtil`
- **Annotations**: `@Component`
- **Configuration Properties**:
    - `@Value("${jwt.secret}") private String secret;`
    - `@Value("${jwt.expiration}") private long expiration;` (in milliseconds)
- **Methods**:
    - `generateToken(UserDetails userDetails)`: `String`
        1.  Creates a `Map<String, Object>` for claims, adding the user's role (`userDetails.getAuthorities().stream().findFirst().map(GrantedAuthority::getAuthority).orElse("CUSTOMER")`) under the key "role".
        2.  Sets the subject of the JWT to `userDetails.getUsername()` (email).
        3.  Sets the issued at time to `Instant.now()`.
        4.  Sets the expiration time to `Instant.now().plusMillis(expiration)`.
        5.  Signs the token using `Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret))`.
        6.  Builds and compacts the JWT string.
        7.  Returns the generated JWT string.
    - `validateToken(String token, UserDetails userDetails)`: `boolean`
        1.  Extracts the email from the `token` using `extractEmail(token)`.
        2.  Checks if the extracted email matches `userDetails.getUsername()`.
        3.  Checks if the token is not expired using `isTokenExpired(token)`.
        4.  Returns `true` if both conditions are met, `false` otherwise.
    - `extractEmail(String token)`: `String`
        1.  Parses the `token` using the secret key.
        2.  Extracts the subject (email) from the token's claims.
        3.  Returns the extracted email.
    - `isTokenExpired(String token)`: `boolean` (private helper method)
        1.  Extracts the expiration date from the token.
        2.  Returns `true` if the expiration date is before the current date, `false` otherwise.

### `JwtAuthFilter.java`
This file defines a Spring Security filter that intercepts incoming requests, validates JWTs from the `Authorization` header, and sets the security context.
- **Class**: `JwtAuthFilter` extends `OncePerRequestFilter`
- **Annotations**: `@Component`
- **Dependencies**: Injects `JwtUtil` and `UserService`.
- **Methods**:
    - `doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)`: `void`
        1.  Extracts the `Authorization` header from the request.
        2.  If the header is not null and starts with "Bearer ":
            a.  Extracts the JWT token by removing "Bearer ".
            b.  Extracts the email from the token using `jwtUtil.extractEmail(token)`.
            c.  If email is not null and `SecurityContextHolder.getContext().getAuthentication()` is null (meaning no authentication has been set yet):
                i.   Loads `UserDetails` using `userService.loadUserByUsername(email)`.
                ii.  If `jwtUtil.validateToken(token, userDetails)` returns `true`:
                    1.  Creates a `UsernamePasswordAuthenticationToken` with `userDetails`, `null` credentials, and `userDetails.getAuthorities()`.
                    2.  Sets the details of the authentication token using `WebAuthenticationDetailsSource().buildDetails(request)`.
                    3.  Sets the authentication object in `SecurityContextHolder.getContext()`.
        3.  Calls `filterChain.doFilter(request, response)` to continue the filter chain.

### `SecurityConfig.java`
This file provides the central Spring Security configuration for the MultiFit Aundh backend. It defines authorization rules, CORS policy, and integrates the JWT filter chain.
- **Class**: `SecurityConfig`
- **Annotations**: `@Configuration`, `@EnableWebSecurity`, `@EnableMethodSecurity`
- **Dependencies**: Injects `JwtAuthFilter`.
- **Beans**:
    - `passwordEncoder()`: `PasswordEncoder`
        1.  Returns a new `BCryptPasswordEncoder()` instance.
    - `authenticationManager(AuthenticationConfiguration config)`: `AuthenticationManager`
        1.  Returns `config.getAuthenticationManager()`.
    - `securityFilterChain(HttpSecurity http)`: `SecurityFilterChain`
        1.  Disables CSRF: `http.csrf(csrf -> csrf.disable())`.
        2.  Configures session management to be stateless: `http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))`.
        3.  Configures authorization rules using `authorizeHttpRequests()`:
            a.  Requests to `/api/v1/auth/**` permit all.
            b.  Requests to `/api/v1/admin/**` require the `ADMIN` role (`hasRole("ADMIN")`).
            c.  All other requests require authentication (`anyRequest().authenticated()`).
        4.  Adds `jwtAuthFilter` before `UsernamePasswordAuthenticationFilter`.
        5.  Applies CORS configuration using `cors(Customizer.withDefaults())`.
        6.  Builds and returns the `SecurityFilterChain`.
    - `corsConfigurationSource()`: `CorsConfigurationSource`
        1.  Creates a `CorsConfiguration` instance.
        2.  Sets allowed origins to `Arrays.asList("*")`.
        3.  Sets allowed methods to `Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS")`.
        4.  Sets allowed headers to `Arrays.asList("*")`.
        5.  Creates a `UrlBasedCorsConfigurationSource`.
        6.  Registers the `CorsConfiguration` for all paths (`"/**"`).
        7.  Returns the `UrlBasedCorsConfigurationSource`.

### `AuthController.java`
This file handles user authentication requests for MultiFit Aundh.
- **Class**: `AuthController`
- **Annotations**: `@RestController`, `@RequestMapping("/api/v1/auth")`
- **Dependencies**: Injects `AuthenticationManager`, `UserService`, `JwtUtil`.
- **Endpoints**:
    - `POST /api/v1/auth/login`
        - **Method**: `login(@RequestBody @Valid AuthRequest authRequest)`: `ResponseEntity<AuthResponse>`
        - **Logic**:
            1.  Creates a `UsernamePasswordAuthenticationToken` using `authRequest.getEmail()` and `authRequest.getPassword()`.
            2.  Attempts to authenticate the token using `authenticationManager.authenticate()`.
            3.  If authentication is successful:
                a.  Loads `UserDetails` for the authenticated user using `userService.loadUserByUsername(authRequest.getEmail())`.
                b.  Generates a JWT token using `jwtUtil.generateToken(userDetails)`.
                c.  Extracts the user's role from `userDetails.getAuthorities()`.
                d.  Calculates the token expiration timestamp.
                e.  Creates an `AuthResponse` object with the generated token, role, and expiration timestamp.
                f.  Returns `ResponseEntity.ok(authResponse)`.
            4.  If authentication fails (e.g., `BadCredentialsException` is caught):
                a.  Returns `ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials")`.

### `AdminInitializer.java`
This file is a command-line runner that ensures an initial admin user exists in the MultiFit Aundh system on application startup.
- **Class**: `AdminInitializer` implements `CommandLineRunner`
- **Annotations**: `@Component`
- **Dependencies**: Injects `UserRepository` and `PasswordEncoder`.
- **Methods**:
    - `run(String... args)`: `void`
        1.  Retrieves the admin email from environment variable `ADMIN_EMAIL` (e.g., `System.getenv("ADMIN_EMAIL")`). If not found, defaults to "admin@multifitaundh.com".
        2.  Retrieves the admin password from environment variable `ADMIN_PASSWORD` (e.g., `System.getenv("ADMIN_PASSWORD")`). If not found, defaults to "adminpassword".
        3.  Checks if a user with the admin email already exists by calling `userRepository.findByEmail(adminEmail)`.
        4.  If no admin user is found:
            a.  Creates a new `User` instance.
            b.  Sets the `email` to `adminEmail`.
            c.  Sets the `password` to the BCrypt-hashed `adminPassword` using `passwordEncoder.encode(adminPassword)`.
            d.  Sets the `role` to `Role.ADMIN`.
            e.  Saves the new admin user to the database using `userRepository.save(adminUser)`.
            f.  Logs a message indicating the admin user was created.
        5.  If an admin user already exists, logs a message indicating that the admin user already exists.

---

## Shared Kernel (Backend)

**Name:** `shared-kernel-backend`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/multifitaundh/controller/SpaController.java` — CONTROLLER layer — handles requests for client-side routes by forwarding them to /index.html, enabling the React Router to take over.
- `backend/src/main/java/com/multifitaundh/exception/GlobalExceptionHandler.java` — EXCEPTION layer — a @RestControllerAdvice that centralizes exception handling, translating exceptions like ResourceNotFoundException into standardized ErrorResponse DTOs.
- `backend/src/main/java/com/multifitaundh/dto/ErrorResponse.java` — DTO layer — defines the standard JSON structure for all API error responses, used by the GlobalExceptionHandler.
- `backend/src/main/java/com/multifitaundh/exception/ResourceNotFoundException.java` — EXCEPTION layer — a custom RuntimeException thrown by services when an entity cannot be found by its ID. Handled by GlobalExceptionHandler to return a 404 response.
- `backend/src/main/java/com/multifitaundh/config/DataSeeder.java` — CONFIG layer — a CommandLineRunner that seeds the database with realistic sample data (membership plans, trainers, etc.) for MultiFit Aundh on first launch.

**Feature Instruction:**

This feature provides core backend utilities for the MultiFit Aundh application, including client-side routing support, centralized exception handling, and initial database seeding.

### `ErrorResponse.java`
This DTO defines the standard structure for API error responses. It is an immutable record or class with the following fields:
- `LocalDateTime timestamp`: The exact time the error occurred.
- `int status`: The HTTP status code (e.g., 404, 500).
- `String error`: The HTTP status message (e.g., "Not Found", "Internal Server Error").
- `String message`: A detailed, human-readable error message.
- `String path`: The request URI that caused the error.

### `ResourceNotFoundException.java`
This is a custom `RuntimeException` used to indicate that a requested resource could not be found. It extends `java.lang.RuntimeException`.
- Constructor: `ResourceNotFoundException(String message)`
- Constructor: `ResourceNotFoundException(String message, Throwable cause)`

### `GlobalExceptionHandler.java`
This class acts as a centralized exception handler for all REST controllers in the application. It is annotated with `@RestControllerAdvice`.
- It injects `HttpServletRequest` to retrieve the request URI.
- **Method: `handleResourceNotFoundException(ResourceNotFoundException ex, HttpServletRequest request)`**
  - Signature: `ResponseEntity<ErrorResponse> handleResourceNotFoundException(ResourceNotFoundException ex, HttpServletRequest request)`
  - Logic:
    1. Create an `ErrorResponse` instance with:
       - `timestamp`: Current `LocalDateTime`.
       - `status`: `HttpStatus.NOT_FOUND.value()` (404).
       - `error`: `HttpStatus.NOT_FOUND.getReasonPhrase()` ("Not Found").
       - `message`: `ex.getMessage()`.
       - `path`: `request.getRequestURI()`.
    2. Return a `ResponseEntity` containing the `ErrorResponse` and `HttpStatus.NOT_FOUND`.
- **Method: `handleGenericException(Exception ex, HttpServletRequest request)`**
  - Signature: `ResponseEntity<ErrorResponse> handleGenericException(Exception ex, HttpServletRequest request)`
  - Logic:
    1. Create an `ErrorResponse` instance with:
       - `timestamp`: Current `LocalDateTime`.
       - `status`: `HttpStatus.INTERNAL_SERVER_ERROR.value()` (500).
       - `error`: `HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase()` ("Internal Server Error").
       - `message`: `ex.getMessage()` (or a generic message like "An unexpected error occurred.").
       - `path`: `request.getRequestURI()`.
    2. Return a `ResponseEntity` containing the `ErrorResponse` and `HttpStatus.INTERNAL_SERVER_ERROR`.

### `SpaController.java`
This controller is responsible for forwarding all non-API and non-static asset requests to the `index.html` file, enabling client-side routing for the React Single Page Application.
- It is annotated with `@Controller`.
- **Method: `forwardSpaRoutes()`**
  - Signature: `String forwardSpaRoutes()`
  - Logic:
    1. This method is mapped to handle all GET requests that do not contain a file extension (e.g., `/`, `/memberships`, `/schedule`, but not `/api/v1/users` or `/image.png`). The `@GetMapping` annotation should use a pattern like `/**/{path:[^\.]*}` or `/{path:.*}` to catch these routes while excluding paths that contain a dot (indicating a file extension).
    2. It returns the string `"forward:/index.html"` to instruct Spring to forward the request to the `index.html` file, allowing the frontend's React Router to handle the specific route.

### `DataSeeder.java`
This class is a `CommandLineRunner` that populates the database with initial sample data for MultiFit Aundh on application startup if the database is empty. This ensures a functional application for development and demonstration purposes.
- It is annotated with `@Component`.
- It implements `org.springframework.boot.CommandLineRunner`.
- It injects the following repositories:
  - `MembershipPlanRepository` (from `membership-management-backend`)
  - `TrainerRepository` (from `content-management-backend`)
  - `GymClassRepository` (from `class-scheduling-backend`)
  - `TestimonialRepository` (from `content-management-backend`)
- **Method: `run(String... args)`**
  - Signature: `void run(String... args) throws Exception`
  - Logic:
    1. Check if the database is empty by calling `membershipPlanRepository.count()`. If the count is greater than 0, return immediately to prevent re-seeding.
    2. If the database is empty, proceed to seed data:
       a. **Membership Plans:** Create and save at least three `MembershipPlan` entities using `membershipPlanRepository.save()`.
          - Example 1: "Monthly Power Pass", description: "Access to all gym facilities and group classes for one month.", price: 2999.00, durationMonths: 1.
          - Example 2: "Annual Elite Membership", description: "Unlock unlimited access, personal training sessions, and exclusive workshops for a year.", price: 29999.00, durationMonths: 12.
          - Example 3: "Personal Training Package", description: "10 personalized 1-on-1 training sessions with our expert coaches.", price: 7500.00, durationMonths: 3.
       b. **Trainers:** Create and save at least three `Trainer` entities using `trainerRepository.save()`.
          - Example 1: "Coach Rahul Sharma", specialization: "Strength & Conditioning", bio: "Rahul is passionate about helping members achieve peak performance.", imageUrl: "https://images.unsplash.com/photo-1571019625454-f4437295052e?w=1920&q=80"
          - Example 2: "Trainer Priya Singh", specialization: "Yoga & Flexibility", bio: "Priya brings calm and strength to every session, enhancing mind-body connection.", imageUrl: "https://images.unsplash.com/photo-1544367664-92e16d414e0b?w=1920&q=80"
          - Example 3: "Instructor Amit Kumar", specialization: "HIIT & Cardio", bio: "Amit's high-energy classes push limits and deliver results.", imageUrl: "https://images.unsplash.com/photo-1590487903102-143d04730626?w=1920&q=80"
       c. **Gym Classes:** Create and save at least three `GymClass` entities using `gymClassRepository.save()`.
          - Example 1: "High-Intensity Interval Training (HIIT)", description: "Burn maximum calories in minimum time.", durationMinutes: 45.
          - Example 2: "Power Yoga", description: "Strengthen your core and improve flexibility.", durationMinutes: 60.
          - Example 3: "Zumba Dance Fitness", description: "Dance your way to fitness with energetic routines.", durationMinutes: 50.
       d. **Testimonials:** Create and save at least three `Testimonial` entities using `testimonialRepository.save()`.
          - Example 1: "MultiFit Aundh has truly transformed my fitness journey! The trainers are incredibly supportive and the community is amazing. Highly recommend!" - Anjali M.
          - Example 2: "I've never felt more energized and motivated. The variety of classes and state-of-the-art equipment make every workout exciting." - Rohan S.
          - Example 3: "Joining MultiFit Aundh was the best decision for my health. The personalized attention and positive environment are unmatched." - Sneha P.
    3. Log a message indicating that the database has been seeded.

---

## Membership Management (Backend)

**Name:** `membership-management-backend`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/multifitaundh/model/MembershipPlan.java` — MODEL layer — defines the MembershipPlan entity, representing a purchasable gym membership with a name, price, and duration.
- `backend/src/main/java/com/multifitaundh/repository/MembershipPlanRepository.java` — REPOSITORY layer — provides standard CRUD data access methods for the MembershipPlan entity.
- `backend/src/main/java/com/multifitaundh/model/Subscription.java` — MODEL layer — defines the Subscription entity, linking a User to a MembershipPlan with a specific start date, end date, and status.
- `backend/src/main/java/com/multifitaundh/model/SubscriptionStatus.java` — MODEL layer — defines the SubscriptionStatus enum (ACTIVE, EXPIRED, CANCELLED) used by the Subscription entity.
- `backend/src/main/java/com/multifitaundh/repository/SubscriptionRepository.java` — REPOSITORY layer — provides data access methods for the Subscription entity, including findByUserId(UUID userId) to retrieve a member's history.
- `backend/src/main/java/com/multifitaundh/service/MembershipService.java` — SERVICE layer — implements business logic for memberships, including getAllPlans() for public display and createSubscription(CreateSubscriptionRequest, UserDetails) for purchases.
- `backend/src/main/java/com/multifitaundh/controller/MembershipController.java` — CONTROLLER layer — exposes the public GET /api/v1/memberships/plans endpoint for the frontend to display available memberships.
- `backend/src/main/java/com/multifitaundh/controller/AdminMembershipController.java` — CONTROLLER layer — provides secure, ADMIN-only CRUD endpoints under /api/v1/admin/memberships for managing membership plans and viewing all subscriptions.
- `backend/src/main/java/com/multifitaundh/dto/MembershipPlanDto.java` — DTO layer — represents the MembershipPlan for API communication, including validation annotations for create/update operations.
- `backend/src/main/java/com/multifitaundh/dto/SubscriptionDto.java` — DTO layer — represents a Subscription for API responses, providing a flattened view of the subscription and related user/plan data.
- `backend/src/main/java/com/multifitaundh/dto/CreateSubscriptionRequest.java` — DTO layer — defines the request body for creating a new subscription, containing the ID of the chosen membership plan.

**Feature Instruction:**

This feature, Membership Management (Backend), provides the core backend logic and API endpoints for managing gym membership plans and user subscriptions. It consists of model entities, DTOs for API communication, repositories for data access, a service layer for business logic, and controllers for exposing RESTful APIs.

## File Specifications

### `backend/src/main/java/com/multifitaundh/model/MembershipPlan.java`
This file defines the `MembershipPlan` entity, representing a purchasable gym membership plan.
- **Fields:**
    - `private UUID id;` (Primary key, auto-generated)
    - `private String name;` (Name of the plan, e.g., '3 Month Unlimited'. Not null.)
    - `private String description;` (Description of the plan benefits.)
    - `private BigDecimal price;` (Price of the plan. Not null, positive.)
    - `private Integer durationInDays;` (Duration of the membership in days. Not null, positive.)
- **Annotations:** Standard JPA annotations for an entity, including `@Entity`, `@Id`, `@GeneratedValue`, `@Column` with `nullable = false` and `unique = true` where appropriate for `name`.

### `backend/src/main/java/com/multifitaundh/repository/MembershipPlanRepository.java`
This file defines the `MembershipPlanRepository` interface for data access to `MembershipPlan` entities.
- **Interface:** `public interface MembershipPlanRepository extends org.springframework.data.jpa.repository.JpaRepository<com.multifitaundh.model.MembershipPlan, UUID>`
- **Methods:** Inherits standard CRUD methods from `JpaRepository`.

### `backend/src/main/java/com/multifitaundh/model/Subscription.java`
This file defines the `Subscription` entity, representing an active or past membership subscription for a user.
- **Fields:**
    - `private UUID id;` (Primary key, auto-generated)
    - `private com.multifitaundh.model.User user;` (The user who owns this subscription. Foreign key to `User` from `authentication-backend`.)
    - `private com.multifitaundh.model.MembershipPlan membershipPlan;` (The plan associated with this subscription. Foreign key.)
    - `private java.time.LocalDate startDate;` (The date the subscription starts. Not null.)
    - `private java.time.LocalDate endDate;` (The date the subscription ends. Not null.)
    - `private com.multifitaundh.model.SubscriptionStatus status;` (Current status of the subscription.)
- **Annotations:** Standard JPA annotations for an entity, including `@Entity`, `@Id`, `@GeneratedValue`, `@ManyToOne` for `user` and `membershipPlan`, and `@Enumerated(EnumType.STRING)` for `status`.

### `backend/src/main/java/com/multifitaundh/model/SubscriptionStatus.java`
This file defines the `SubscriptionStatus` enum.
- **Enum:** `public enum SubscriptionStatus { ACTIVE, EXPIRED, CANCELLED }`

### `backend/src/main/java/com/multifitaundh/repository/SubscriptionRepository.java`
This file defines the `SubscriptionRepository` interface for data access to `Subscription` entities.
- **Interface:** `public interface SubscriptionRepository extends org.springframework.data.jpa.repository.JpaRepository<com.multifitaundh.model.Subscription, UUID>`
- **Methods:**
    - Inherits standard CRUD methods from `JpaRepository`.
    - `List<com.multifitaundh.model.Subscription> findByUserId(UUID userId);` (Finds all subscriptions for a given user.)

### `backend/src/main/java/com/multifitaundh/dto/MembershipPlanDto.java`
This file defines the `MembershipPlanDto` for API communication.
- **Fields:**
    - `private UUID id;`
    - `private String name;` (`@jakarta.validation.constraints.NotBlank`)
    - `private String description;`
    - `private java.math.BigDecimal price;` (`@jakarta.validation.constraints.NotNull`, `@jakarta.validation.constraints.Positive`)
    - `private Integer durationInDays;` (`@jakarta.validation.constraints.NotNull`, `@jakarta.validation.constraints.Positive`)
- **Annotations:** Standard Lombok annotations (`@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`) and validation annotations as specified.

### `backend/src/main/java/com/multifitaundh/dto/SubscriptionDto.java`
This file defines the `SubscriptionDto` for API responses.
- **Fields:**
    - `private UUID id;`
    - `private UUID userId;`
    - `private String userEmail;`
    - `private String planName;`
    - `private java.time.LocalDate startDate;`
    - `private java.time.LocalDate endDate;`
    - `private String status;` (String representation of `SubscriptionStatus`)
- **Annotations:** Standard Lombok annotations (`@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`).

### `backend/src/main/java/com/multifitaundh/dto/CreateSubscriptionRequest.java`
This file defines the `CreateSubscriptionRequest` DTO for creating new subscriptions.
- **Fields:**
    - `private UUID planId;` (`@jakarta.validation.constraints.NotNull`)
- **Annotations:** Standard Lombok annotations (`@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`) and validation annotations as specified.

### `backend/src/main/java/com/multifitaundh/service/MembershipService.java`
This file implements the business logic for memberships and subscriptions.
- **Dependencies:**
    - Injects `com.multifitaundh.repository.MembershipPlanRepository`.
    - Injects `com.multifitaundh.repository.SubscriptionRepository`.
    - Injects `com.multifitaundh.repository.UserRepository` (from `authentication-backend`).
- **Public Methods:**
    - `public java.util.List<com.multifitaundh.dto.MembershipPlanDto> getAllPlans()`
        1.  Retrieves all `MembershipPlan` entities from `membershipPlanRepository.findAll()`.
        2.  Maps each `MembershipPlan` to a `MembershipPlanDto`.
        3.  Returns the list of `MembershipPlanDto`.
    - `public com.multifitaundh.dto.SubscriptionDto createSubscription(com.multifitaundh.dto.CreateSubscriptionRequest request, org.springframework.security.core.userdetails.UserDetails currentUser)`
        1.  Retrieves the `MembershipPlan` by `request.getPlanId()` using `membershipPlanRepository.findById()`.
        2.  If the plan is not found, throws `com.multifitaundh.exception.ResourceNotFoundException` with a message like "Membership plan not found with ID: [planId]".
        3.  Retrieves the `User` by `currentUser.getUsername()` (which is the user's email) using `userRepository.findByEmail()`.
        4.  If the user is not found, throws `com.multifitaundh.exception.ResourceNotFoundException` with a message like "User not found with email: [email]".
        5.  Sets `startDate` to `java.time.LocalDate.now()`.
        6.  Calculates `endDate` as `startDate.plusDays(membershipPlan.getDurationInDays())`.
        7.  Creates a new `Subscription` entity, associating the retrieved `User` and `MembershipPlan`, setting `startDate`, `endDate`, and `status` to `com.multifitaundh.model.SubscriptionStatus.ACTIVE`.
        8.  Saves the new `Subscription` using `subscriptionRepository.save()`.
        9.  Maps the saved `Subscription` to a `SubscriptionDto`, populating `userId` (`subscription.getUser().getId()`), `userEmail` (`subscription.getUser().getEmail()`), `planName` (`subscription.getMembershipPlan().getName()`), `startDate`, `endDate`, and `status` (`subscription.getStatus().name()`).
        10. Returns the `SubscriptionDto`.
        - **Error Cases:** `com.multifitaundh.exception.ResourceNotFoundException` (HTTP 404) if `MembershipPlan` or `User` is not found.
    - `public com.multifitaundh.dto.MembershipPlanDto createMembershipPlan(com.multifitaundh.dto.MembershipPlanDto dto)` (Admin method)
        1.  Creates a new `com.multifitaundh.model.MembershipPlan` entity from the provided `dto`. The `id` should be generated (e.g., `UUID.randomUUID()`).
        2.  Saves the new `MembershipPlan` using `membershipPlanRepository.save()`.
        3.  Maps the saved `MembershipPlan` back to a `MembershipPlanDto`.
        4.  Returns the `MembershipPlanDto`.
    - `public com.multifitaundh.dto.MembershipPlanDto updateMembershipPlan(UUID id, com.multifitaundh.dto.MembershipPlanDto dto)` (Admin method)
        1.  Retrieves the `MembershipPlan` by `id` using `membershipPlanRepository.findById()`.
        2.  If the plan is not found, throws `com.multifitaundh.exception.ResourceNotFoundException` with a message like "Membership plan not found with ID: [id]".
        3.  Updates the `name`, `description`, `price`, and `durationInDays` of the retrieved `MembershipPlan` entity with values from the `dto`.
        4.  Saves the updated `MembershipPlan` using `membershipPlanRepository.save()`.
        5.  Maps the updated `MembershipPlan` back to a `MembershipPlanDto`.
        6.  Returns the `MembershipPlanDto`.
        - **Error Cases:** `com.multifitaundh.exception.ResourceNotFoundException` (HTTP 404) if `MembershipPlan` is not found.
    - `public void deleteMembershipPlan(UUID id)` (Admin method)
        1.  Checks if a `MembershipPlan` exists by `id` using `membershipPlanRepository.existsById()`.
        2.  If the plan does not exist, throws `com.multifitaundh.exception.ResourceNotFoundException` with a message like "Membership plan not found with ID: [id]".
        3.  Deletes the `MembershipPlan` using `membershipPlanRepository.deleteById()`.
        - **Error Cases:** `com.multifitaundh.exception.ResourceNotFoundException` (HTTP 404) if `MembershipPlan` is not found.
    - `public java.util.List<com.multifitaundh.dto.SubscriptionDto> getAllSubscriptions()` (Admin method)
        1.  Retrieves all `Subscription` entities from `subscriptionRepository.findAll()`.
        2.  Maps each `Subscription` to a `SubscriptionDto`, populating `userId`, `userEmail`, `planName`, `startDate`, `endDate`, and `status`.
        3.  Returns the list of `SubscriptionDto`.

### `backend/src/main/java/com/multifitaundh/controller/MembershipController.java`
This file exposes public REST API endpoints for membership plans.
- **Dependencies:** Injects `com.multifitaundh.service.MembershipService`.
- **Endpoints:**
    - `GET /api/v1/memberships/plans`
        - **Method:** `public org.springframework.http.ResponseEntity<java.util.List<com.multifitaundh.dto.MembershipPlanDto>> getMembershipPlans()`
        - **Logic:** Calls `membershipService.getAllPlans()`.
        - **Returns:** `ResponseEntity` containing a list of `MembershipPlanDto` with HTTP status 200 OK.

### `backend/src/main/java/com/multifitaundh/controller/AdminMembershipController.java`
This file exposes admin-only REST API endpoints for managing membership plans and subscriptions.
- **Dependencies:** Injects `com.multifitaundh.service.MembershipService`.
- **Endpoints:**
    - `GET /api/v1/admin/memberships/plans`
        - **Method:** `public org.springframework.http.ResponseEntity<java.util.List<com.multifitaundh.dto.MembershipPlanDto>> getMembershipPlans()`
        - **Logic:** Calls `membershipService.getAllPlans()`.
        - **Returns:** `ResponseEntity` containing a list of `MembershipPlanDto` with HTTP status 200 OK.
    - `POST /api/v1/admin/memberships/plans`
        - **Method:** `public org.springframework.http.ResponseEntity<com.multifitaundh.dto.MembershipPlanDto> createMembershipPlan(@jakarta.validation.Valid @org.springframework.web.bind.annotation.RequestBody com.multifitaundh.dto.MembershipPlanDto membershipPlanDto)`
        - **Logic:** Calls `membershipService.createMembershipPlan(membershipPlanDto)`.
        - **Returns:** `ResponseEntity` containing the created `MembershipPlanDto` with HTTP status 201 Created.
    - `PUT /api/v1/admin/memberships/plans/{id}`
        - **Method:** `public org.springframework.http.ResponseEntity<com.multifitaundh.dto.MembershipPlanDto> updateMembershipPlan(@org.springframework.web.bind.annotation.PathVariable UUID id, @jakarta.validation.Valid @org.springframework.web.bind.annotation.RequestBody com.multifitaundh.dto.MembershipPlanDto membershipPlanDto)`
        - **Logic:** Calls `membershipService.updateMembershipPlan(id, membershipPlanDto)`.
        - **Returns:** `ResponseEntity` containing the updated `MembershipPlanDto` with HTTP status 200 OK.
        - **Error Cases:** Returns HTTP 404 Not Found if `ResourceNotFoundException` is thrown by the service.
    - `DELETE /api/v1/admin/memberships/plans/{id}`
        - **Method:** `public org.springframework.http.ResponseEntity<java.lang.Void> deleteMembershipPlan(@org.springframework.web.bind.annotation.PathVariable UUID id)`
        - **Logic:** Calls `membershipService.deleteMembershipPlan(id)`.
        - **Returns:** `ResponseEntity` with HTTP status 204 No Content.
        - **Error Cases:** Returns HTTP 404 Not Found if `ResourceNotFoundException` is thrown by the service.
    - `GET /api/v1/admin/subscriptions`
        - **Method:** `public org.springframework.http.ResponseEntity<java.util.List<com.multifitaundh.dto.SubscriptionDto>> getAllSubscriptions()`
        - **Logic:** Calls `membershipService.getAllSubscriptions()`.
        - **Returns:** `ResponseEntity` containing a list of `SubscriptionDto` with HTTP status 200 OK.

## Inter-file Wiring and Cross-Feature Contracts
- `MembershipController` and `AdminMembershipController` inject `MembershipService`.
- `MembershipService` injects `MembershipPlanRepository`, `SubscriptionRepository`, and `UserRepository` (from `authentication-backend`).
- `MembershipService.createSubscription` calls `membershipPlanRepository.findById()` to retrieve a `MembershipPlan` and `userRepository.findByEmail()` (from `authentication-backend`) to retrieve the `User` associated with the current `UserDetails`.
- `MembershipService` methods for admin operations (create, update, delete plan, get all subscriptions) interact with `MembershipPlanRepository` and `SubscriptionRepository`.
- `Subscription` model has `@ManyToOne` relationships with `User` (from `authentication-backend`) and `MembershipPlan`.
- Custom exception `com.multifitaundh.exception.ResourceNotFoundException` is assumed to exist in a shared exception package and will be handled by a global exception handler to return HTTP 404.

---

## Class Scheduling (Backend)

**Name:** `class-scheduling-backend`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/multifitaundh/model/GymClass.java` — MODEL layer — defines the GymClass entity, representing a type of fitness class offered, like 'Yoga' or 'CrossFit'.
- `backend/src/main/java/com/multifitaundh/repository/GymClassRepository.java` — REPOSITORY layer — provides standard CRUD data access methods for the GymClass entity.
- `backend/src/main/java/com/multifitaundh/model/Schedule.java` — MODEL layer — defines the Schedule entity, representing a single, bookable instance of a GymClass at a specific time with a specific Trainer and capacity.
- `backend/src/main/java/com/multifitaundh/repository/ScheduleRepository.java` — REPOSITORY layer — provides data access for Schedule entities, including findByStartTimeAfter(LocalDateTime) to fetch upcoming classes.
- `backend/src/main/java/com/multifitaundh/model/Booking.java` — MODEL layer — defines the Booking entity, which links a User to a scheduled class (Schedule) and tracks the booking status.
- `backend/src/main/java/com/multifitaundh/model/BookingStatus.java` — MODEL layer — defines the BookingStatus enum (CONFIRMED, CANCELLED_BY_USER, CANCELLED_BY_ADMIN) used by the Booking entity.
- `backend/src/main/java/com/multifitaundh/repository/BookingRepository.java` — REPOSITORY layer — provides data access for Bookings, including countByScheduleId(UUID) for capacity checks and findByUserId(UUID) for member history.
- `backend/src/main/java/com/multifitaundh/service/ClassScheduleService.java` — SERVICE layer — implements business logic for class scheduling, including getUpcomingSchedule() and createBooking(CreateBookingRequest, UserDetails), which validates class capacity.
- `backend/src/main/java/com/multifitaundh/controller/ClassScheduleController.java` — CONTROLLER layer — exposes public GET /api/v1/schedule and authenticated POST /api/v1/bookings endpoints for viewing and booking classes.
- `backend/src/main/java/com/multifitaundh/controller/AdminClassScheduleController.java` — CONTROLLER layer — provides secure, ADMIN-only CRUD endpoints under /api/v1/admin/ for managing GymClass types and Schedule instances.
- `backend/src/main/java/com/multifitaundh/dto/GymClassDto.java` — DTO layer — represents a GymClass for API communication, including validation annotations.
- `backend/src/main/java/com/multifitaundh/dto/ScheduleDto.java` — DTO layer — represents a scheduled class for API communication, including related entity names and calculated availability.
- `backend/src/main/java/com/multifitaundh/dto/BookingDto.java` — DTO layer — represents a user's booking for API responses, providing a summary of the booked class.
- `backend/src/main/java/com/multifitaundh/dto/CreateBookingRequest.java` — DTO layer — defines the request body for creating a new class booking, containing the ID of the scheduled class.

**Feature Instruction:**

The `class-scheduling-backend` feature provides a comprehensive set of functionalities for managing gym classes, schedules, and user bookings. It includes data models for `GymClass`, `Schedule`, and `Booking`, their respective Spring Data JPA repositories, DTOs for API communication, a service layer for business logic, and two REST controllers: one for public access to schedules and bookings, and another for administrative CRUD operations.

## Data Models

### `GymClass.java`
Represents a type of fitness class offered at MultiFit Aundh.
-   **Fields:**
    -   `id`: `UUID` (Primary key, auto-generated)
    -   `name`: `String` (Name of the class, e.g., "Zumba", "CrossFit". Not null.)
    -   `description`: `String` (Detailed description of the class.)
-   **Annotations:** `@Entity`, `@Table(name = "gym_classes")`, `@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`.

### `Schedule.java`
Represents a specific scheduled instance of a `GymClass` with a `Trainer` at a given time and capacity.
-   **Fields:**
    -   `id`: `UUID` (Primary key, auto-generated)
    -   `gymClass`: `GymClass` (The class being scheduled. `@ManyToOne` relationship, `@JoinColumn(nullable = false)`.)
    -   `trainer`: `Trainer` (The trainer conducting the class. `@ManyToOne` relationship, `@JoinColumn(nullable = false)`. The `Trainer` entity is assumed to exist in a shared model package, with at least `UUID id` and `String name` fields.)
    -   `startTime`: `LocalDateTime` (Start date and time of the class. Not null.)
    -   `endTime`: `LocalDateTime` (End date and time of the class. Not null.)
    -   `capacity`: `Integer` (Maximum number of participants. Not null.)
-   **Annotations:** `@Entity`, `@Table(name = "schedules")`, `@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`.

### `Booking.java`
Represents a user's booking for a specific scheduled class.
-   **Fields:**
    -   `id`: `UUID` (Primary key, auto-generated)
    -   `user`: `User` (The user who made the booking. `@ManyToOne` relationship, `@JoinColumn(nullable = false)`. The `User` entity is assumed to exist in a shared model package, with at least `UUID id` and `String email` fields.)
    -   `schedule`: `Schedule` (The scheduled class being booked. `@ManyToOne` relationship, `@JoinColumn(nullable = false)`.)
    -   `bookingTime`: `LocalDateTime` (Timestamp of when the booking was made. Not null.)
    -   `status`: `BookingStatus` (Status of the booking. `@Enumerated(EnumType.STRING)`, `@Column(nullable = false)`.)
-   **Annotations:** `@Entity`, `@Table(name = "bookings")`, `@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`.

### `BookingStatus.java`
An enum defining the possible statuses for a class booking.
-   **Enum Values:**
    -   `CONFIRMED`: The booking is confirmed.
    -   `CANCELLED_BY_USER`: The user cancelled the booking.
    -   `CANCELLED_BY_ADMIN`: An admin cancelled the booking.

## Repositories

### `GymClassRepository.java`
Spring Data JPA repository for `GymClass` entities.
-   **Extends:** `JpaRepository<GymClass, UUID>`
-   **Standard Methods:** Provides standard CRUD operations (e.g., `save`, `findById`, `findAll`, `deleteById`).

### `ScheduleRepository.java`
Spring Data JPA repository for `Schedule` entities.
-   **Extends:** `JpaRepository<Schedule, UUID>`
-   **Standard Methods:** Provides standard CRUD operations.
-   **Custom Methods:**
    -   `findByStartTimeAfter(LocalDateTime dateTime): List<Schedule>`: Finds all scheduled classes occurring after a given date and time, ordered by `startTime` ascending.

### `BookingRepository.java`
Spring Data JPA repository for `Booking` entities.
-   **Extends:** `JpaRepository<Booking, UUID>`
-   **Standard Methods:** Provides standard CRUD operations.
-   **Custom Methods:**
    -   `countByScheduleId(UUID scheduleId): long`: Counts the number of confirmed bookings for a specific scheduled class.
    -   `findByUserId(UUID userId): List<Booking>`: Finds all bookings made by a specific user.
    -   `findByUserIdAndScheduleIdAndStatus(UUID userId, UUID scheduleId, BookingStatus status): Optional<Booking>`: Finds a booking by user, schedule, and status.

## DTOs (Data Transfer Objects)

### `GymClassDto.java`
DTO for `GymClass` entity, used for API communication.
-   **Fields:**
    -   `id`: `UUID`
    -   `name`: `String` (`@NotBlank`)
    -   `description`: `String`
-   **Annotations:** `@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`.

### `ScheduleDto.java`
DTO for `Schedule` entity, including related entity names and calculated availability.
-   **Fields:**
    -   `id`: `UUID`
    -   `gymClassId`: `UUID` (`@NotNull`)
    -   `className`: `String`
    -   `trainerId`: `UUID` (`@NotNull`)
    -   `trainerName`: `String`
    -   `startTime`: `LocalDateTime` (`@NotNull`)
    -   `endTime`: `LocalDateTime` (`@NotNull`)
    -   `capacity`: `Integer` (`@NotNull`, `@Positive`)
    -   `spotsAvailable`: `Integer` (Calculated number of available spots for booking.)
-   **Annotations:** `@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`.

### `BookingDto.java`
DTO for `Booking` entity, used for API responses.
-   **Fields:**
    -   `id`: `UUID`
    -   `scheduleId`: `UUID`
    -   `className`: `String`
    -   `classStartTime`: `LocalDateTime`
    -   `status`: `String` (String representation of `BookingStatus` enum.)
-   **Annotations:** `@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`.

### `CreateBookingRequest.java`
DTO for creating a new class booking.
-   **Fields:**
    -   `scheduleId`: `UUID` (`@NotNull`)
-   **Annotations:** `@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`.

## Service Layer

### `ClassScheduleService.java`
Handles business logic for class schedules and bookings. It is annotated with `@Service` and uses constructor injection for its dependencies.
-   **Dependencies:**
    -   `GymClassRepository`
    -   `ScheduleRepository`
    -   `BookingRepository`
    -   `UserRepository` (from `authentication-backend` feature, for fetching `User` entities)
    -   `TrainerRepository` (assumed to be available in `content-management-backend` or `shared-kernel-backend` for fetching `Trainer` entities)

-   **Public Methods:**

    #### `getUpcomingSchedule(): List<ScheduleDto>`
    1.  Get the current `LocalDateTime`.
    2.  Call `scheduleRepository.findByStartTimeAfter(currentTime)` to retrieve all schedules starting in the future, ordered by `startTime`.
    3.  For each `Schedule` entity:
        a.  Call `bookingRepository.countByScheduleId(schedule.getId())` to get the number of confirmed bookings.
        b.  Calculate `spotsAvailable = schedule.getCapacity() - confirmedBookingsCount`.
        c.  Map the `Schedule` entity to a `ScheduleDto`, populating `id`, `gymClassId`, `className` (from `schedule.getGymClass().getName()`), `trainerId`, `trainerName` (from `schedule.getTrainer().getName()`), `startTime`, `endTime`, `capacity`, and `spotsAvailable`.
    4.  Return the `List<ScheduleDto>`.

    #### `createBooking(CreateBookingRequest request, UserDetails currentUser): BookingDto`
    1.  Retrieve the `Schedule` entity by `request.getScheduleId()` using `scheduleRepository.findById()`. If not found, throw `ResourceNotFoundException`.
    2.  Retrieve the `User` entity by `currentUser.getUsername()` (which is the user's email) using `userRepository.findByEmail()`. If not found, throw `ResourceNotFoundException`.
    3.  Count the current confirmed bookings for the `Schedule` using `bookingRepository.countByScheduleId(schedule.getId())`.
    4.  If `currentBookingsCount >= schedule.getCapacity()`, throw `IllegalStateException` with a message indicating the class is full.
    5.  Check if the `User` already has a `CONFIRMED` booking for this `Schedule` using `bookingRepository.findByUserIdAndScheduleIdAndStatus(user.getId(), schedule.getId(), BookingStatus.CONFIRMED)`. If a booking is found, throw `IllegalStateException` with a message indicating the user is already booked for this class.
    6.  Create a new `Booking` entity:
        a.  Set `id` to `UUID.randomUUID()`.
        b.  Set `user` to the retrieved `User` entity.
        c.  Set `schedule` to the retrieved `Schedule` entity.
        d.  Set `bookingTime` to `LocalDateTime.now()`.
        e.  Set `status` to `BookingStatus.CONFIRMED`.
    7.  Save the new `Booking` entity using `bookingRepository.save()`.
    8.  Map the saved `Booking` entity to a `BookingDto`, populating `id`, `scheduleId`, `className` (from `booking.getSchedule().getGymClass().getName()`), `classStartTime` (from `booking.getSchedule().getStartTime()`), and `status` (from `booking.getStatus().name()`).
    9.  Return the `BookingDto`.

    #### `getAllGymClasses(): List<GymClassDto>`
    1.  Call `gymClassRepository.findAll()`.
    2.  Map each `GymClass` entity to a `GymClassDto`.
    3.  Return the `List<GymClassDto>`.

    #### `createGymClass(GymClassDto dto): GymClassDto`
    1.  Create a new `GymClass` entity from the `dto` (set `id` to `UUID.randomUUID()`).
    2.  Save the `GymClass` entity using `gymClassRepository.save()`.
    3.  Map the saved `GymClass` entity back to a `GymClassDto`.
    4.  Return the `GymClassDto`.

    #### `updateGymClass(UUID id, GymClassDto dto): GymClassDto`
    1.  Retrieve the `GymClass` entity by `id` using `gymClassRepository.findById()`. If not found, throw `ResourceNotFoundException`.
    2.  Update the `name` and `description` fields of the retrieved `GymClass` entity from the `dto`.
    3.  Save the updated `GymClass` entity using `gymClassRepository.save()`.
    4.  Map the saved `GymClass` entity back to a `GymClassDto`.
    5.  Return the `GymClassDto`.

    #### `deleteGymClass(UUID id)`
    1.  Call `gymClassRepository.deleteById(id)`.

    #### `getAllSchedules(): List<ScheduleDto>`
    1.  Call `scheduleRepository.findAll()`.
    2.  For each `Schedule` entity:
        a.  Call `bookingRepository.countByScheduleId(schedule.getId())` to get the number of confirmed bookings.
        b.  Calculate `spotsAvailable = schedule.getCapacity() - confirmedBookingsCount`.
        c.  Map the `Schedule` entity to a `ScheduleDto`, populating all fields including `className`, `trainerName`, and `spotsAvailable`.
    3.  Return the `List<ScheduleDto>`.

    #### `createSchedule(ScheduleDto dto): ScheduleDto`
    1.  Retrieve the `GymClass` entity by `dto.getGymClassId()` using `gymClassRepository.findById()`. If not found, throw `ResourceNotFoundException`.
    2.  Retrieve the `Trainer` entity by `dto.getTrainerId()` using `trainerRepository.findById()`. If not found, throw `ResourceNotFoundException`.
    3.  Create a new `Schedule` entity from the `dto` (set `id` to `UUID.randomUUID()`, set `gymClass` and `trainer` entities).
    4.  Save the `Schedule` entity using `scheduleRepository.save()`.
    5.  Map the saved `Schedule` entity back to a `ScheduleDto`, calculating `spotsAvailable` as `schedule.getCapacity()` (since it's new, no bookings yet).
    6.  Return the `ScheduleDto`.

    #### `updateSchedule(UUID id, ScheduleDto dto): ScheduleDto`
    1.  Retrieve the `Schedule` entity by `id` using `scheduleRepository.findById()`. If not found, throw `ResourceNotFoundException`.
    2.  Retrieve the `GymClass` entity by `dto.getGymClassId()` using `gymClassRepository.findById()`. If not found, throw `ResourceNotFoundException`.
    3.  Retrieve the `Trainer` entity by `dto.getTrainerId()` using `trainerRepository.findById()`. If not found, throw `ResourceNotFoundException`.
    4.  Update the `gymClass`, `trainer`, `startTime`, `endTime`, and `capacity` fields of the retrieved `Schedule` entity from the `dto`.
    5.  Save the updated `Schedule` entity using `scheduleRepository.save()`.
    6.  Map the saved `Schedule` entity back to a `ScheduleDto`, calculating `spotsAvailable` based on current bookings.
    7.  Return the `ScheduleDto`.

    #### `deleteSchedule(UUID id)`
    1.  Call `scheduleRepository.deleteById(id)`.

## Controller Layer

### `ClassScheduleController.java`
Public-facing REST controller for class schedules and bookings. It is annotated with `@RestController` and `@RequestMapping("/api/v1")` and uses constructor injection for `ClassScheduleService`.
-   **Endpoints:**

    #### `GET /schedule`
    -   **Description:** Gets the upcoming class schedule.
    -   **Method:** `public ResponseEntity<List<ScheduleDto>> getUpcomingSchedule()`
    -   **Logic:** Calls `classScheduleService.getUpcomingSchedule()`.
    -   **Response:** `200 OK` with `List<ScheduleDto>`.

    #### `POST /bookings`
    -   **Description:** Creates a new class booking for the authenticated user.
    -   **Method:** `public ResponseEntity<BookingDto> createBooking(@RequestBody @Valid CreateBookingRequest request, @AuthenticationPrincipal UserDetails currentUser)`
    -   **Logic:**
        1.  Calls `classScheduleService.createBooking(request, currentUser)`.
        2.  Catches `ResourceNotFoundException` and returns `404 Not Found`.
        3.  Catches `IllegalStateException` and returns `400 Bad Request`.
    -   **Request Body:** `CreateBookingRequest`
    -   **Response:** `201 Created` with `BookingDto`.
    -   **Security:** Requires authentication (`@PreAuthorize("isAuthenticated()")`).

### `AdminClassScheduleController.java`
Admin-only REST controller for managing classes, schedules, and bookings. It is annotated with `@RestController` and `@RequestMapping("/api/v1/admin")` and uses constructor injection for `ClassScheduleService`.
-   **Security:** All endpoints in this controller require the `ADMIN` role (`@PreAuthorize("hasRole('ADMIN')")`).
-   **Endpoints:**

    #### `GET /classes`
    -   **Description:** Admin gets all gym class types.
    -   **Method:** `public ResponseEntity<List<GymClassDto>> getAllGymClasses()`
    -   **Logic:** Calls `classScheduleService.getAllGymClasses()`.
    -   **Response:** `200 OK` with `List<GymClassDto>`.

    #### `POST /classes`
    -   **Description:** Admin creates a new gym class type.
    -   **Method:** `public ResponseEntity<GymClassDto> createGymClass(@RequestBody @Valid GymClassDto dto)`
    -   **Logic:** Calls `classScheduleService.createGymClass(dto)`.
    -   **Request Body:** `GymClassDto`
    -   **Response:** `201 Created` with `GymClassDto`.

    #### `PUT /classes/{id}`
    -   **Description:** Admin updates a gym class type.
    -   **Method:** `public ResponseEntity<GymClassDto> updateGymClass(@PathVariable UUID id, @RequestBody @Valid GymClassDto dto)`
    -   **Logic:**
        1.  Calls `classScheduleService.updateGymClass(id, dto)`.
        2.  Catches `ResourceNotFoundException` and returns `404 Not Found`.
    -   **Request Body:** `GymClassDto`
    -   **Response:** `200 OK` with `GymClassDto`.

    #### `DELETE /classes/{id}`
    -   **Description:** Admin deletes a gym class type.
    -   **Method:** `public ResponseEntity<Void> deleteGymClass(@PathVariable UUID id)`
    -   **Logic:**
        1.  Calls `classScheduleService.deleteGymClass(id)`.
        2.  Catches `ResourceNotFoundException` and returns `404 Not Found`.
    -   **Response:** `204 No Content`.

    #### `GET /schedule`
    -   **Description:** Admin gets the full class schedule.
    -   **Method:** `public ResponseEntity<List<ScheduleDto>> getAllSchedules()`
    -   **Logic:** Calls `classScheduleService.getAllSchedules()`.
    -   **Response:** `200 OK` with `List<ScheduleDto>`.

    #### `POST /schedule`
    -   **Description:** Admin creates a new scheduled class.
    -   **Method:** `public ResponseEntity<ScheduleDto> createSchedule(@RequestBody @Valid ScheduleDto dto)`
    -   **Logic:**
        1.  Calls `classScheduleService.createSchedule(dto)`.
        2.  Catches `ResourceNotFoundException` and returns `404 Not Found`.
    -   **Request Body:** `ScheduleDto`
    -   **Response:** `201 Created` with `ScheduleDto`.

    #### `PUT /schedule/{id}`
    -   **Description:** Admin updates a scheduled class.
    -   **Method:** `public ResponseEntity<ScheduleDto> updateSchedule(@PathVariable UUID id, @RequestBody @Valid ScheduleDto dto)`
    -   **Logic:**
        1.  Calls `classScheduleService.updateSchedule(id, dto)`.
        2.  Catches `ResourceNotFoundException` and returns `404 Not Found`.
    -   **Request Body:** `ScheduleDto`
    -   **Response:** `200 OK` with `ScheduleDto`.

    #### `DELETE /schedule/{id}`
    -   **Description:** Admin deletes a scheduled class.
    -   **Method:** `public ResponseEntity<Void> deleteSchedule(@PathVariable UUID id)`
    -   **Logic:**
        1.  Calls `classScheduleService.deleteSchedule(id)`.
        2.  Catches `ResourceNotFoundException` and returns `404 Not Found`.
    -   **Response:** `204 No Content`.

## Cross-Feature Interactions
-   **Authentication-Backend:** This feature depends on the `User` model and `UserRepository` from the `authentication-backend` for user-related operations, specifically `userRepository.findByEmail(String email)` to retrieve `User` entities based on the authenticated user's email.
-   **Content-Management-Backend:** This feature depends on the `Trainer` model and `TrainerRepository` (assumed to be available) from the `content-management-backend` for trainer-related operations, specifically `trainerRepository.findById(UUID id)` to retrieve `Trainer` entities when creating or updating schedules.

## Exception Handling
-   `ResourceNotFoundException`: A custom exception (assumed to be defined in the project's exception package) should be thrown by the service layer when an entity (e.g., `GymClass`, `Schedule`, `User`, `Trainer`) is not found. Controllers should catch this and return an `HTTP 404 Not Found` status.
-   `IllegalStateException`: Should be thrown by the service layer for business rule violations, such as attempting to book a full class or booking a class the user is already confirmed for. Controllers should catch this and return an `HTTP 400 Bad Request` status.

---

## Content Management (Backend)

**Name:** `content-management-backend`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/multifitaundh/model/Trainer.java` — MODEL layer — defines the Trainer entity, containing information about a gym trainer for public profile pages.
- `backend/src/main/java/com/multifitaundh/repository/TrainerRepository.java` — REPOSITORY layer — provides standard CRUD data access methods for the Trainer entity.
- `backend/src/main/java/com/multifitaundh/model/Testimonial.java` — MODEL layer — defines the Testimonial entity for storing customer reviews to be displayed on the website.
- `backend/src/main/java/com/multifitaundh/repository/TestimonialRepository.java` — REPOSITORY layer — provides standard CRUD data access methods for the Testimonial entity.
- `backend/src/main/java/com/multifitaundh/model/TrialLead.java` — MODEL layer — defines the TrialLead entity to store submissions from the free trial lead capture form.
- `backend/src/main/java/com/multifitaundh/repository/TrialLeadRepository.java` — REPOSITORY layer — provides standard CRUD data access methods for the TrialLead entity.
- `backend/src/main/java/com/multifitaundh/service/ContentService.java` — SERVICE layer — implements business logic for public content, including getAllTrainers(), getAllTestimonials(), and createTrialLead(CreateTrialLeadRequest).
- `backend/src/main/java/com/multifitaundh/controller/ContentController.java` — CONTROLLER layer — exposes public GET endpoints for trainers and testimonials, and a public POST endpoint for the trial lead form.
- `backend/src/main/java/com/multifitaundh/controller/AdminContentController.java` — CONTROLLER layer — provides secure, ADMIN-only CRUD endpoints for managing Trainers and Testimonials, and a GET endpoint for viewing TrialLeads.
- `backend/src/main/java/com/multifitaundh/dto/TrainerDto.java` — DTO layer — represents a Trainer for API communication, including validation annotations.
- `backend/src/main/java/com/multifitaundh/dto/TestimonialDto.java` — DTO layer — represents a Testimonial for API communication, including validation annotations.
- `backend/src/main/java/com/multifitaundh/dto/TrialLeadDto.java` — DTO layer — represents a TrialLead for API responses, used in the admin panel.
- `backend/src/main/java/com/multifitaundh/dto/CreateTrialLeadRequest.java` — DTO layer — defines the request body for the trial lead form submission, with validation.

**Feature Instruction:**

This feature, `content-management-backend`, provides backend services and API endpoints for managing public-facing content such as trainer profiles, customer testimonials, and capturing trial leads. It includes both public and admin-only endpoints.

## File: `backend/src/main/java/com/multifitaundh/model/Trainer.java`
This file defines the `Trainer` entity, representing a gym trainer.
- Annotations: `@Entity`, `@Table(name = "trainers")`
- Fields:
    - `private UUID id;`: Primary key. Annotated with `@Id`, `@GeneratedValue(strategy = GenerationType.AUTO)`. 
    - `private String name;`: Trainer's full name. Annotated with `@Column(nullable = false)`. 
    - `private String specialization;`: Trainer's area of expertise.
    - `private String bio;`: A short biography.
    - `private String imageUrl;`: URL to the trainer's profile picture.
- Standard JPA annotations for getters, setters, no-arg constructor, and all-args constructor.

## File: `backend/src/main/java/com/multifitaundh/repository/TrainerRepository.java`
This file defines the `TrainerRepository` interface for data access operations on `Trainer` entities.
- Extends `org.springframework.data.jpa.repository.JpaRepository<Trainer, UUID>`.
- No custom methods are required; standard CRUD operations are inherited.

## File: `backend/src/main/java/com/multifitaundh/model/Testimonial.java`
This file defines the `Testimonial` entity, representing a customer testimonial.
- Annotations: `@Entity`, `@Table(name = "testimonials")`
- Fields:
    - `private UUID id;`: Primary key. Annotated with `@Id`, `@GeneratedValue(strategy = GenerationType.AUTO)`. 
    - `private String authorName;`: Name of the person giving the testimonial. Annotated with `@Column(nullable = false)`. 
    - `private String quote;`: The testimonial text. Annotated with `@Column(nullable = false)`. 
    - `private Integer rating;`: Rating out of 5. Can be null.
- Standard JPA annotations for getters, setters, no-arg constructor, and all-args constructor.

## File: `backend/src/main/java/com/multifitaundh/repository/TestimonialRepository.java`
This file defines the `TestimonialRepository` interface for data access operations on `Testimonial` entities.
- Extends `org.springframework.data.jpa.repository.JpaRepository<Testimonial, UUID>`.
- No custom methods are required; standard CRUD operations are inherited.

## File: `backend/src/main/java/com/multifitaundh/model/TrialLead.java`
This file defines the `TrialLead` entity, representing a lead captured from the '3-Day Free Trial' form.
- Annotations: `@Entity`, `@Table(name = "trial_leads")`
- Fields:
    - `private UUID id;`: Primary key. Annotated with `@Id`, `@GeneratedValue(strategy = GenerationType.AUTO)`. 
    - `private String name;`: Lead's name. Annotated with `@Column(nullable = false)`. 
    - `private String email;`: Lead's email address. Annotated with `@Column(nullable = false)`. 
    - `private String phone;`: Lead's phone number. Annotated with `@Column(nullable = false)`. 
    - `private LocalDateTime submittedAt;`: Timestamp of form submission. Annotated with `@Column(nullable = false)`. 
- Standard JPA annotations for getters, setters, no-arg constructor, and all-args constructor.

## File: `backend/src/main/java/com/multifitaundh/repository/TrialLeadRepository.java`
This file defines the `TrialLeadRepository` interface for data access operations on `TrialLead` entities.
- Extends `org.springframework.data.jpa.repository.JpaRepository<TrialLead, UUID>`.
- No custom methods are required; standard CRUD operations are inherited.

## File: `backend/src/main/java/com/multifitaundh/dto/TrainerDto.java`
This file defines the `TrainerDto` Data Transfer Object for `Trainer` entities.
- Fields:
    - `private UUID id;`: Trainer ID.
    - `private String name;`: Trainer's name. Annotated with `@NotBlank(message = "Trainer name cannot be blank")`.
    - `private String specialization;`: Trainer's specialization.
    - `private String bio;`: Trainer's biography.
    - `private String imageUrl;`: URL to profile picture. Annotated with `@URL(message = "Image URL must be a valid URL")`.
- Standard DTO annotations for getters, setters, no-arg constructor, and all-args constructor.

## File: `backend/src/main/java/com/multifitaundh/dto/TestimonialDto.java`
This file defines the `TestimonialDto` Data Transfer Object for `Testimonial` entities.
- Fields:
    - `private UUID id;`: Testimonial ID.
    - `private String authorName;`: Author's name. Annotated with `@NotBlank(message = "Author name cannot be blank")`.
    - `private String quote;`: Testimonial text. Annotated with `@NotBlank(message = "Testimonial quote cannot be blank")`.
    - `private Integer rating;`: Rating from 1 to 5. Annotated with `@Min(value = 1, message = "Rating must be at least 1")`, `@Max(value = 5, message = "Rating cannot be more than 5")`.
- Standard DTO annotations for getters, setters, no-arg constructor, and all-args constructor.

## File: `backend/src/main/java/com/multifitaundh/dto/TrialLeadDto.java`
This file defines the `TrialLeadDto` Data Transfer Object for `TrialLead` entities, used for responses.
- Fields:
    - `private UUID id;`: Lead ID.
    - `private String name;`: Lead's name.
    - `private String email;`: Lead's email.
    - `private String phone;`: Lead's phone.
    - `private LocalDateTime submittedAt;`: Submission timestamp.
- Standard DTO annotations for getters, setters, no-arg constructor, and all-args constructor.

## File: `backend/src/main/java/com/multifitaundh/dto/CreateTrialLeadRequest.java`
This file defines the `CreateTrialLeadRequest` Data Transfer Object for submitting new trial leads.
- Fields:
    - `private String name;`: Lead's name. Annotated with `@NotBlank(message = "Name cannot be blank")`.
    - `private String email;`: Lead's email. Annotated with `@NotBlank(message = "Email cannot be blank")`, `@Email(message = "Invalid email format")`.
    - `private String phone;`: Lead's phone. Annotated with `@NotBlank(message = "Phone number cannot be blank")`.
- Standard DTO annotations for getters, setters, no-arg constructor, and all-args constructor.

## File: `backend/src/main/java/com/multifitaundh/service/ContentService.java`
This file implements the business logic for content management.
- Annotations: `@Service`
- Dependencies: Injects `TrainerRepository`, `TestimonialRepository`, `TrialLeadRepository` via constructor injection.
- Public Methods:
    - `public List<TrainerDto> getAllTrainers()`
        1. Retrieve all `Trainer` entities from `trainerRepository.findAll()`.
        2. Map each `Trainer` entity to a `TrainerDto`.
        3. Return the list of `TrainerDto`s.
    - `public TrainerDto getTrainerById(UUID id)`
        1. Find `Trainer` entity by `id` using `trainerRepository.findById(id)`.
        2. If not found, throw `IllegalArgumentException("Trainer not found with ID: " + id)`.
        3. Map the found `Trainer` entity to a `TrainerDto`.
        4. Return the `TrainerDto`.
    - `public TrainerDto createTrainer(TrainerDto trainerDto)`
        1. Create a new `Trainer` entity.
        2. Set `id` to `UUID.randomUUID()`.
        3. Copy `name`, `specialization`, `bio`, `imageUrl` from `trainerDto` to the `Trainer` entity.
        4. Save the `Trainer` entity using `trainerRepository.save(trainer)`.
        5. Map the saved `Trainer` entity to a `TrainerDto`.
        6. Return the `TrainerDto`.
    - `public TrainerDto updateTrainer(UUID id, TrainerDto trainerDto)`
        1. Find `Trainer` entity by `id` using `trainerRepository.findById(id)`.
        2. If not found, throw `IllegalArgumentException("Trainer not found with ID: " + id)`.
        3. Update the `name`, `specialization`, `bio`, `imageUrl` fields of the found `Trainer` entity with values from `trainerDto`.
        4. Save the updated `Trainer` entity using `trainerRepository.save(trainer)`.
        5. Map the saved `Trainer` entity to a `TrainerDto`.
        6. Return the `TrainerDto`.
    - `public void deleteTrainer(UUID id)`
        1. Check if `Trainer` entity exists by `id` using `trainerRepository.existsById(id)`.
        2. If not found, throw `IllegalArgumentException("Trainer not found with ID: " + id)`.
        3. Delete the `Trainer` entity using `trainerRepository.deleteById(id)`.
    - `public List<TestimonialDto> getAllTestimonials()`
        1. Retrieve all `Testimonial` entities from `testimonialRepository.findAll()`.
        2. Map each `Testimonial` entity to a `TestimonialDto`.
        3. Return the list of `TestimonialDto`s.
    - `public TestimonialDto getTestimonialById(UUID id)`
        1. Find `Testimonial` entity by `id` using `testimonialRepository.findById(id)`.
        2. If not found, throw `IllegalArgumentException("Testimonial not found with ID: " + id)`.
        3. Map the found `Testimonial` entity to a `TestimonialDto`.
        4. Return the `TestimonialDto`.
    - `public TestimonialDto createTestimonial(TestimonialDto testimonialDto)`
        1. Create a new `Testimonial` entity.
        2. Set `id` to `UUID.randomUUID()`.
        3. Copy `authorName`, `quote`, `rating` from `testimonialDto` to the `Testimonial` entity.
        4. Save the `Testimonial` entity using `testimonialRepository.save(testimonial)`.
        5. Map the saved `Testimonial` entity to a `TestimonialDto`.
        6. Return the `TestimonialDto`.
    - `public TestimonialDto updateTestimonial(UUID id, TestimonialDto testimonialDto)`
        1. Find `Testimonial` entity by `id` using `testimonialRepository.findById(id)`.
        2. If not found, throw `IllegalArgumentException("Testimonial not found with ID: " + id)`.
        3. Update the `authorName`, `quote`, `rating` fields of the found `Testimonial` entity with values from `testimonialDto`.
        4. Save the updated `Testimonial` entity using `testimonialRepository.save(testimonial)`.
        5. Map the saved `Testimonial` entity to a `TestimonialDto`.
        6. Return the `TestimonialDto`.
    - `public void deleteTestimonial(UUID id)`
        1. Check if `Testimonial` entity exists by `id` using `testimonialRepository.existsById(id)`.
        2. If not found, throw `IllegalArgumentException("Testimonial not found with ID: " + id)`.
        3. Delete the `Testimonial` entity using `testimonialRepository.deleteById(id)`.
    - `public TrialLeadDto createTrialLead(CreateTrialLeadRequest request)`
        1. Create a new `TrialLead` entity.
        2. Set `id` to `UUID.randomUUID()`.
        3. Copy `name`, `email`, `phone` from `request` to the `TrialLead` entity.
        4. Set `submittedAt` to `LocalDateTime.now()`.
        5. Save the `TrialLead` entity using `trialLeadRepository.save(trialLead)`.
        6. Map the saved `TrialLead` entity to a `TrialLeadDto`.
        7. Return the `TrialLeadDto`.
    - `public List<TrialLeadDto> getAllTrialLeads()`
        1. Retrieve all `TrialLead` entities from `trialLeadRepository.findAll()`.
        2. Map each `TrialLead` entity to a `TrialLeadDto`.
        3. Return the list of `TrialLeadDto`s.

## File: `backend/src/main/java/com/multifitaundh/controller/ContentController.java`
This file defines public-facing REST endpoints for site content.
- Annotations: `@RestController`, `@RequestMapping("/api/v1")`
- Dependencies: Injects `ContentService` via constructor injection.
- Endpoints:
    - `GET /trainers`
        - Method: `public ResponseEntity<List<TrainerDto>> getAllTrainers()`
        - Logic: Calls `contentService.getAllTrainers()` and returns the result with `HttpStatus.OK`.
    - `GET /testimonials`
        - Method: `public ResponseEntity<List<TestimonialDto>> getAllTestimonials()`
        - Logic: Calls `contentService.getAllTestimonials()` and returns the result with `HttpStatus.OK`.
    - `POST /leads/trial`
        - Method: `public ResponseEntity<TrialLeadDto> createTrialLead(@Valid @RequestBody CreateTrialLeadRequest request)`
        - Logic: Calls `contentService.createTrialLead(request)` and returns the result with `HttpStatus.CREATED`.

## File: `backend/src/main/java/com/multifitaundh/controller/AdminContentController.java`
This file defines admin-only REST endpoints for managing site content.
- Annotations: `@RestController`, `@RequestMapping("/api/v1/admin")`
- Dependencies: Injects `ContentService` via constructor injection.
- Security: All methods should be protected with `@PreAuthorize("hasRole('ADMIN')")`.
- Endpoints:
    - `GET /trainers`
        - Method: `public ResponseEntity<List<TrainerDto>> getAllTrainers()`
        - Logic: Calls `contentService.getAllTrainers()` and returns the result with `HttpStatus.OK`.
    - `POST /trainers`
        - Method: `public ResponseEntity<TrainerDto> createTrainer(@Valid @RequestBody TrainerDto trainerDto)`
        - Logic: Calls `contentService.createTrainer(trainerDto)` and returns the result with `HttpStatus.CREATED`.
    - `PUT /trainers/{id}`
        - Method: `public ResponseEntity<TrainerDto> updateTrainer(@PathVariable UUID id, @Valid @RequestBody TrainerDto trainerDto)`
        - Logic:
            1. Calls `contentService.updateTrainer(id, trainerDto)`.
            2. Returns the result with `HttpStatus.OK`.
            3. Error cases: Catches `IllegalArgumentException` and returns `ResponseEntity.status(HttpStatus.NOT_FOUND).build()`.
    - `DELETE /trainers/{id}`
        - Method: `public ResponseEntity<Void> deleteTrainer(@PathVariable UUID id)`
        - Logic:
            1. Calls `contentService.deleteTrainer(id)`.
            2. Returns `ResponseEntity.noContent().build()`.
            3. Error cases: Catches `IllegalArgumentException` and returns `ResponseEntity.status(HttpStatus.NOT_FOUND).build()`.
    - `GET /testimonials`
        - Method: `public ResponseEntity<List<TestimonialDto>> getAllTestimonials()`
        - Logic: Calls `contentService.getAllTestimonials()` and returns the result with `HttpStatus.OK`.
    - `POST /testimonials`
        - Method: `public ResponseEntity<TestimonialDto> createTestimonial(@Valid @RequestBody TestimonialDto testimonialDto)`
        - Logic: Calls `contentService.createTestimonial(testimonialDto)` and returns the result with `HttpStatus.CREATED`.
    - `PUT /testimonials/{id}`
        - Method: `public ResponseEntity<TestimonialDto> updateTestimonial(@PathVariable UUID id, @Valid @RequestBody TestimonialDto testimonialDto)`
        - Logic:
            1. Calls `contentService.updateTestimonial(id, testimonialDto)`.
            2. Returns the result with `HttpStatus.OK`.
            3. Error cases: Catches `IllegalArgumentException` and returns `ResponseEntity.status(HttpStatus.NOT_FOUND).build()`.
    - `DELETE /testimonials/{id}`
        - Method: `public ResponseEntity<Void> deleteTestimonial(@PathVariable UUID id)`
        - Logic:
            1. Calls `contentService.deleteTestimonial(id)`.
            2. Returns `ResponseEntity.noContent().build()`.
            3. Error cases: Catches `IllegalArgumentException` and returns `ResponseEntity.status(HttpStatus.NOT_FOUND).build()`.
    - `GET /leads/trial`
        - Method: `public ResponseEntity<List<TrialLeadDto>> getAllTrialLeads()`
        - Logic: Calls `contentService.getAllTrialLeads()` and returns the result with `HttpStatus.OK`.

---

## Public Site (Frontend)

**Name:** `public-site-frontend`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/api/client.ts` — SERVICE layer — creates and exports a singleton Axios instance. Includes a request interceptor to automatically add the 'Authorization: Bearer' header using the token from localStorage.
- `frontend/src/App.tsx` — PAGE layer — serves as the application's main entry point, wrapping all routes with necessary providers (QueryClientProvider, AuthProvider) and defining the application's route structure using react-router-dom.
- `frontend/src/components/Layout.tsx` — COMPONENT layer — provides the main visual structure for all public pages, rendering the Header, the page's children, and the Footer in a flex column layout.
- `frontend/src/components/Header.tsx` — COMPONENT layer — renders the sticky top navigation bar. Uses a dark background (bg-[#1A1A1A]) with the brand name, navigation links (Memberships, Schedule, Trainers), and a primary CTA button with the accent color (bg-[#DFFF00]). Includes a mobile hamburger menu.
- `frontend/src/components/Footer.tsx` — COMPONENT layer — renders the site footer with a dark theme (bg-[#1A1A1A], text-[#F5F5F5]). Includes three columns: business address and phone, opening hours, and an embedded Google Maps iframe pointing to the Aundh, Pune location.
- `frontend/src/pages/HomePage.tsx` — PAGE layer — constructs the main landing page. Features a full-bleed hero with a dynamic video background and a prominent 'Get a 3-Day Free Trial' call-to-action, a grid of class offerings, a trainer showcase section, and a testimonials carousel to build social proof.
- `frontend/src/pages/ContactPage.tsx` — PAGE layer — displays contact details for MultiFit Aundh, including address, phone number, email, and a large embedded Google Map. Also includes a simple contact form for general inquiries.

**Feature Instruction:**

## Design Tokens
- Navbar: bg-[#1A1A1A] text-[#F5F5F5]
- Primary CTA: bg-[#DFFF00] hover:bg-opacity-80 text-black font-semibold rounded-full px-8 py-3 transition-all duration-200
- Secondary CTA: bg-transparent border border-[#DFFF00] text-[#DFFF00] hover:bg-[#DFFF00] hover:text-black font-semibold rounded-full px-8 py-3 transition-all duration-200
- Brand text accent: text-[#DFFF00]
- Section bg: bg-white (odd sections) / bg-gray-50 (even sections)
- Dark Section bg: bg-[#1A1A1A] text-[#F5F5F5]
- Card: bg-white rounded-xl shadow-md border border-gray-100 p-6
- Section container: <section className="py-16 px-4"><div className="max-w-7xl mx-auto">
- Hero h1: text-4xl md:text-6xl font-bold text-white
- Hero subheadline: text-xl md:text-2xl text-white mt-4
- Body: text-gray-700 leading-relaxed
- Footer: bg-[#1A1A1A] text-[#F5F5F5]

This feature provides the public-facing frontend for MultiFit Aundh, including the main application setup, shared layout components, and core public pages. It integrates with various backend features for data display and lead capture.

### `frontend/src/api/client.ts`
This file configures and exports a singleton Axios instance named `apiClient`. This instance is used for all API communication within the frontend application.
- **`apiClient` (AxiosInstance)**: A pre-configured Axios instance.
  - **Configuration**: Sets `baseURL` to `/api/v1`.
  - **Request Interceptor**: Adds an interceptor that runs before each request.
    1. Retrieves the JWT token from `localStorage` using the key `'token'`.
    2. If a token exists, it sets the `Authorization` header to `Bearer <token>`.
    3. Returns the `config` object.

### `frontend/src/App.tsx`
This is the root component of the React application, responsible for setting up global providers and routing.
- **`App()`: JSX.Element**
  1. Wraps the entire application with `QueryClientProvider` from `react-query` to enable global state management for data fetching.
  2. Wraps the application with `AuthProvider` from `frontend/src/context/AuthContext.tsx` to provide authentication context.
  3. Sets up routing using `react-router-dom`'s `BrowserRouter` and `Routes`.
  4. Defines the following routes:
     - `/`: Renders `HomePage`.
     - `/memberships`: Renders `MembershipPage`.
     - `/schedule`: Renders `SchedulePage`.
     - `/trainers`: Renders `TrainersPage`.
     - `/contact`: Renders `ContactPage`.
     - `/login`: Renders `LoginPage`.
     - `/admin/*`: Renders `AdminDashboardPage` wrapped in `ProtectedRoute` from `frontend/src/components/ProtectedRoute.tsx`.

### `frontend/src/components/Layout.tsx`
This component provides the main visual structure for all public-facing pages.
- **`Layout({ children: React.ReactNode }): JSX.Element`**
  1. Renders the `Header` component from `frontend/src/components/Header.tsx` at the top.
  2. Renders the `children` prop, which represents the main content of the page, within a `<main>` tag.
  3. Renders the `Footer` component from `frontend/src/components/Footer.tsx` at the bottom.
  4. Uses a flex column layout to ensure header, content, and footer are stacked vertically and the content area expands to fill available space.

### `frontend/src/components/Header.tsx`
This component renders the responsive navigation header for the website.
- **`Header(): JSX.Element`**
  1. **Structure**: A sticky header with `bg-[#1A1A1A]` and `text-[#F5F5F5]`.
  2. **Brand Name**: Displays "MultiFit Aundh" on the left, styled with `text-[#DFFF00]` for the "MultiFit" part, reflecting the `accent_energy`.
  3. **Navigation Links**: Includes navigation links for:
     - `Memberships` (to `/memberships`)
     - `Schedule` (to `/schedule`)
     - `Trainers` (to `/trainers`)
     - `Contact` (to `/contact`)
  4. **Primary CTA Button**: A button styled as a `Primary CTA` (bg-[#DFFF00] text-black) with the text "Join Now" linking to `/memberships`.
  5. **Mobile Menu**: Implements a hamburger menu icon for mobile views that toggles a responsive navigation drawer/modal.

### `frontend/src/components/Footer.tsx`
This component renders the site's footer with contact information, hours, and a map.
- **`Footer(): JSX.Element`**
  1. **Styling**: Uses `bg-[#1A1A1A]` and `text-[#F5F5F5]` for a dark theme.
  2. **Layout**: Arranges content into three columns within a `Section container` (`max-w-7xl mx-auto`).
  3. **Column 1 (Contact Info)**:
     - Heading: "Contact Us"
     - Address: "Multifit Aundh , D.P. Road Medipoint Hospital Road, opp. to Indian Bank, Aundh, Pune, Maharashtra 411067"
     - Phone: "075070 08009"
  4. **Column 2 (Opening Hours)**:
     - Heading: "Opening Hours"
     - Placeholder text: "Mon - Fri: 6 AM - 10 PM", "Sat - Sun: 8 AM - 8 PM"
  5. **Column 3 (Location Map)**:
     - Heading: "Find Us"
     - Embeds a Google Maps iframe pointing to the coordinates `18.562876` for MultiFit Aundh, Pune. The iframe should be responsive and display the gym's location.

### `frontend/src/pages/HomePage.tsx`
This page constructs the main landing page for MultiFit Aundh, designed for high-energy engagement.
- **`HomePage(): JSX.Element`**
  1. Wraps its content with the `Layout` component.
  2. **Hero Section**: 
     - Full-bleed section with a dynamic video background (or a high-quality image if video is not feasible, using `https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80` as a fallback image).
     - Includes an `absolute inset-0 bg-black bg-opacity-50` overlay.
     - **Headline (Hero h1)**: "Unleash Your Potential at MultiFit Aundh"
     - **Subheadline (Hero subheadline)**: "Experience the antidote to boring gyms. Join our vibrant community and transform your fitness journey."
     - **Call-to-Action**: A prominent `Primary CTA` button with text "Get a 3-Day Free Trial" linking to a section on the page or opening the `TrialLeadForm` component.
     - Integrates `TrialLeadForm` from `frontend/src/components/TrialLeadForm.tsx` for lead capture, potentially within a modal or directly below the hero.
  3. **Class Offerings Section**: 
     - Uses a `Section container`.
     - Heading: "Our Dynamic Classes"
     - Displays a grid of placeholder class offerings (e.g., "HIIT", "Yoga", "Strength Training", "Zumba") with energetic descriptions and images.
  4. **Trainer Showcase Section**: 
     - Uses a `Section container`.
     - Heading: "Meet Our Expert Trainers"
     - Displays a selection of trainers, potentially fetched from the `content-management-backend` via `trainer-profiles-frontend`'s `useTrainers` hook. Each trainer card should include their name, specialty, and an image.
  5. **Testimonials Section**: 
     - Uses a `Section container`.
     - Integrates the `TestimonialsSection` component from `frontend/src/components/TestimonialsSection.tsx` to display a carousel or grid of member testimonials, providing social proof. This component will fetch testimonials using `marketing-content-frontend`'s `useTestimonials` hook.

### `frontend/src/pages/ContactPage.tsx`
This page displays contact information, a map, and a contact form for MultiFit Aundh.
- **`ContactPage(): JSX.Element`**
  1. Wraps its content with the `Layout` component.
  2. **Hero Section**: 
     - A smaller hero section with a background image (e.g., `https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80`) and `absolute inset-0 bg-black bg-opacity-50` overlay.
     - **Headline (Hero h1)**: "Get in Touch with MultiFit Aundh"
     - **Subheadline (Hero subheadline)**: "We're here to answer your questions and help you start your fitness journey."
  3. **Contact Details Section**: 
     - Uses a `Section container`.
     - Heading: "Our Location & Details"
     - Displays:
       - **Address**: "Multifit Aundh , D.P. Road Medipoint Hospital Road, opp. to Indian Bank, Aundh, Pune, Maharashtra 411067"
       - **Phone**: "075070 08009"
       - **Email**: "info@multifitaundh.com" (placeholder, as not provided in business context)
  4. **Embedded Map Section**: 
     - Uses a `Section container`.
     - Heading: "Find Us on the Map"
     - Embeds a large, responsive Google Maps iframe pointing to the coordinates `18.562876` for MultiFit Aundh, Pune.
  5. **Contact Form Section**: 
     - Uses a `Section container`.
     - Heading: "Send Us a Message"
     - Implements a simple contact form with fields for `Name`, `Email`, `Subject`, and `Message`.
     - Includes a submit button styled as a `Primary CTA`.

---

## Authentication (Frontend)

**Name:** `authentication-frontend`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/context/AuthContext.tsx` — CONTEXT layer — provides global authentication state (user, token, role) and methods (login, logout) to the entire app. Manages the JWT in localStorage.
- `frontend/src/services/authService.ts` — SERVICE layer — makes HTTP requests for authentication. Exports an async login(credentials) function that calls the POST /api/v1/auth/login endpoint.
- `frontend/src/hooks/useAuth.ts` — HOOK layer — a convenience hook that simply returns the value of `useContext(AuthContext)`, providing a clean way for components to access authentication state.
- `frontend/src/pages/LoginPage.tsx` — PAGE layer — provides a simple form for administrators to log in. Uses react-hook-form and zod for validation and calls the login function from the useAuth hook on submit.
- `frontend/src/components/ProtectedRoute.tsx` — COMPONENT layer — a route wrapper that checks for authentication using the useAuth hook. If the user is not authenticated, it redirects to the /login page; otherwise, it renders its children.
- `frontend/src/types/auth.ts` — UTIL layer — exports TypeScript interfaces (LoginCredentials, AuthResponse, User) for the authentication feature, ensuring type safety across services, hooks, and components.

**Feature Instruction:**

## Design Tokens
- Navbar: bg-[#1A1A1A] text-[#F5F5F5]
- Primary CTA: bg-[#DFFF00] hover:bg-opacity-80 text-[#1A1A1A] font-bold rounded-full px-8 py-3 transition-all duration-200 uppercase tracking-wide
- Secondary CTA: bg-[#333333] hover:bg-[#1A1A1A] text-[#F5F5F5] font-semibold rounded-full px-6 py-2 transition-all duration-200
- Brand text accent: text-[#DFFF00]
- Section bg: bg-[#1A1A1A] (dark sections) / bg-[#333333] (mid sections)
- Card: bg-[#333333] rounded-xl shadow-lg border border-[#1A1A1A] p-6 text-[#F5F5F5]
- Section container: <section className="py-16 px-4"><div className="max-w-7xl mx-auto">
- Hero h1: text-4xl md:text-6xl font-extrabold text-[#DFFF00] uppercase leading-tight
- Body: text-[#F5F5F5] leading-relaxed
- Form input: bg-[#333333] text-[#F5F5F5] border border-[#1A1A1A] rounded-md p-3 focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent
- Error text: text-red-500 text-sm

This feature provides client-side authentication functionality for the MultiFit Aundh admin portal, including login, session management, and route protection. It consists of utility types, an authentication service, a React context for global state, a custom hook, a login page, and a protected route component.

### `frontend/src/types/auth.ts`
This file defines the TypeScript interfaces used across the authentication feature.

**Interfaces:**
-   `LoginCredentials`:
    -   `email: string`
    -   `password: string`
-   `AuthResponse`:
    -   `token: string`
    -   `user: User`
-   `User`:
    -   `id: string`
    -   `email: string`
    -   `role: 'ADMIN' | 'MEMBER'`

### `frontend/src/services/authService.ts`
This service handles API calls related to authentication.

**Dependencies:**
-   Imports `apiClient` from `frontend/src/api/client.ts` for making HTTP requests.
-   Imports `LoginCredentials` and `AuthResponse` from `frontend/src/types/auth.ts`.

**Public Functions:**
-   `login(credentials: LoginCredentials): Promise<AuthResponse>`
    1.  Sends a `POST` request to `/api/v1/auth/login` with `credentials` as the request body.
    2.  Returns the `AuthResponse` from the backend.
    3.  Throws an error if the API call fails.

### `frontend/src/context/AuthContext.tsx`
This file provides a React Context for managing global authentication state.

**Dependencies:**
-   Imports `React`, `createContext`, `useContext`, `useState`, `useEffect` from 'react'.
-   Imports `useNavigate` from 'react-router-dom'.
-   Imports `login` from `frontend/src/services/authService.ts`.
-   Imports `LoginCredentials`, `AuthResponse`, `User` from `frontend/src/types/auth.ts`.

**Interfaces:**
-   `AuthContextType`:
    -   `user: User | null`
    -   `token: string | null`
    -   `isAuthenticated: boolean`
    -   `isLoading: boolean`
    -   `error: string | null`
    -   `login: (credentials: LoginCredentials) => Promise<void>`
    -   `logout: () => void`

**Public Variables:**
-   `AuthProvider: React.FC<{ children: React.ReactNode }>`
    1.  Manages state for `user`, `token`, `isAuthenticated`, `isLoading`, and `error` using `useState`.
    2.  On initial render (`useEffect` with empty dependency array):
        a.  Sets `isLoading` to `true`.
        b.  Checks `localStorage` for a stored JWT using the key `'token'`.
        c.  If a token is found, attempts to decode it (or a placeholder user object) to set `user` and `isAuthenticated` to `true`.
        d.  Sets `token` to the retrieved value.
        e.  Sets `isLoading` to `false`.
    3.  `login(credentials: LoginCredentials)` function:
        a.  Sets `isLoading` to `true` and `error` to `null`.
        b.  Calls `authService.login(credentials)`.
        c.  On success:
            i.  Stores the received `AuthResponse.token` in `localStorage` using the key `'token'`.
            ii. Sets `token` state to `AuthResponse.token`.
            iii. Sets `user` state to `AuthResponse.user`.
            iv. Sets `isAuthenticated` to `true`.
            v.  Navigates to `/admin/dashboard`.
        d.  On failure:
            i.  Sets `error` state to an appropriate error message (e.g., "Login failed. Please check your credentials.").
        e.  Sets `isLoading` to `false`.
    4.  `logout()` function:
        a.  Removes the token from `localStorage` using the key `'token'`.
        b.  Resets `user`, `token`, `isAuthenticated`, and `error` states to their initial `null`/`false` values.
        c.  Navigates to `/login`.
    5.  Provides the `AuthContextType` values (`user`, `token`, `isAuthenticated`, `isLoading`, `error`, `login`, `logout`) to its children.

-   `useAuth: () => AuthContextType`
    1.  A convenience hook that calls `useContext(AuthContext)`.
    2.  Throws an error if `useAuth` is called outside of an `AuthProvider`.

### `frontend/src/hooks/useAuth.ts`
This file provides a simple custom hook to consume the `AuthContext`.

**Dependencies:**
-   Imports `AuthContext` from `frontend/src/context/AuthContext.tsx`.
-   Imports `useContext` from 'react'.

**Public Functions:**
-   `useAuth(): AuthContextType`
    1.  Calls `useContext(AuthContext)`.
    2.  Returns the context value.

### `frontend/src/pages/LoginPage.tsx`
This page provides a form for administrators to log in to the MultiFit Aundh admin portal.

**Dependencies:**
-   Imports `useForm` from 'react-hook-form'.
-   Imports `zod` and `zodResolver` for form validation.
-   Imports `useAuth` from `frontend/src/hooks/useAuth.ts`.
-   Imports `useEffect` from 'react'.
-   Imports `useNavigate` from 'react-router-dom'.
-   Imports `LoginCredentials` from `frontend/src/types/auth.ts`.
-   Imports `Layout` from `@/components/Layout`.

**Public Functions:**
-   `LoginPage(): JSX.Element`
    1.  Wraps its content in `<Layout>`.
    2.  Uses `useAuth()` to get `isAuthenticated`, `isLoading`, `error`, and the `login` function.
    3.  Uses `useNavigate()` for redirection.
    4.  `useEffect` hook:
        a.  If `isAuthenticated` is `true` and `isLoading` is `false`, redirects to `/admin/dashboard`.
    5.  Defines a Zod schema for `LoginCredentials` with `email` (string, required, email format) and `password` (string, required, min length 6).
    6.  Initializes `useForm` with `zodResolver` for validation and default values.
    7.  Renders a login form with two input fields: `email` and `password`.
        a.  Each input field uses the `Form input` design token for styling.
        b.  Displays validation errors below each input using the `Error text` design token.
    8.  The form's `onSubmit` handler calls the `login` function from `useAuth` with the form data.
    9.  Displays a loading spinner or disables the submit button if `isLoading` is `true`.
    10. Displays any `error` message from `useAuth` using the `Error text` design token.
    11. The page title is "Admin Login - MultiFit Aundh" using `text-3xl font-bold text-[#F5F5F5]`.
    12. The submit button uses the `Primary CTA` design token with text "Log In to MultiFit Aundh Admin".

### `frontend/src/components/ProtectedRoute.tsx`
This component wraps routes to protect them from unauthenticated access.

**Dependencies:**
-   Imports `useAuth` from `frontend/src/hooks/useAuth.ts`.
-   Imports `Navigate` from 'react-router-dom'.

**Public Functions:**
-   `ProtectedRoute({ children: JSX.Element }): JSX.Element`
    1.  Uses `useAuth()` to get `isAuthenticated` and `isLoading`.
    2.  If `isLoading` is `true`, renders a loading indicator (e.g., a simple `<div>Loading...</div>` or a spinner component).
    3.  If `isLoading` is `false` and `isAuthenticated` is `false`, redirects to `/login` using `<Navigate to="/login" replace />`.
    4.  If `isAuthenticated` is `true`, renders `children`.

---

## Admin Portal (Frontend)

**Name:** `admin-portal-frontend`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/components/AdminLayout.tsx` — COMPONENT layer — provides the main structure for the admin area. Renders a fixed sidebar on the left with NavLink items for Dashboard, Memberships, Schedule, Trainers, etc., and a main content area for the page's children.
- `frontend/src/pages/AdminDashboardPage.tsx` — PAGE layer — serves as the landing page for the admin section. Displays summary statistics or quick links to key management areas, wrapped in the AdminLayout.
- `frontend/src/pages/admin/AdminMembershipsPage.tsx` — PAGE layer — provides a CRUD interface for Membership Plans. Displays plans in a data table with buttons for Add, Edit, and Delete, which open a modal form managed by react-hook-form.
- `frontend/src/pages/admin/AdminSchedulePage.tsx` — PAGE layer — provides a CRUD interface for scheduled classes (Schedule instances). Displays upcoming classes in a data table with Add, Edit, and Delete functionality.
- `frontend/src/pages/admin/AdminTrainersPage.tsx` — PAGE layer — provides a CRUD interface for Trainer profiles. Displays trainers in a data table with Add, Edit, and Delete functionality.
- `frontend/src/pages/admin/AdminTestimonialsPage.tsx` — PAGE layer — provides a CRUD interface for Testimonials. Displays testimonials in a data table with Add, Edit, and Delete functionality.
- `frontend/src/pages/admin/AdminLeadsPage.tsx` — PAGE layer — provides a read-only view of all submissions from the '3-Day Free Trial' form, displayed in a data table.

**Feature Instruction:**

## Design Tokens
- Admin Navbar: bg-[#1A1A1A] text-[#F5F5F5]
- Admin Sidebar Active Link: bg-[#333333] text-[#DFFF00]
- Admin Sidebar Inactive Link: text-[#F5F5F5] hover:bg-[#333333]
- Primary CTA (Admin): bg-[#DFFF00] hover:bg-opacity-80 text-[#1A1A1A] font-semibold rounded-md px-4 py-2 transition-all duration-200
- Brand text accent: text-[#DFFF00]
- Section bg: bg-gray-50
- Card: bg-white rounded-xl shadow-sm border border-gray-100 p-6
- Admin Page Container: <div className="p-8">
- Admin Heading 1: text-3xl font-bold text-[#1A1A1A]
- Admin Body: text-gray-700 leading-relaxed

## AdminLayout.tsx
**Role**: Provides the main structural layout for all admin pages. It includes a fixed sidebar for navigation and a main content area where child components (the admin pages) are rendered.

**Public Functions**:
- `AdminLayout({ children: React.ReactNode }): JSX.Element`
  1.  Renders a full-height container (`min-h-screen flex`).
  2.  Renders a fixed-width sidebar (`w-64 bg-[#1A1A1A] text-[#F5F5F5] flex flex-col`) on the left.
  3.  Inside the sidebar:
      a.  A brand section at the top with the text "MultiFit Aundh Admin" (`p-4 text-2xl font-bold text-[#DFFF00]`).
      b.  A navigation list (`mt-10 space-y-2`) using `NavLink` from `react-router-dom`.
      c.  Each `NavLink` item should have the following structure and styling:
          -   `to` attribute: `/admin`, `/admin/memberships`, `/admin/schedule`, `/admin/trainers`, `/admin/testimonials`, `/admin/leads`.
          -   `className` for styling: `flex items-center px-4 py-2 rounded-md text-[#F5F5F5] hover:bg-[#333333] transition-colors duration-200`.
          -   `activeClassName` for active link: `bg-[#333333] text-[#DFFF00]`.
          -   Text content: "Dashboard", "Memberships", "Schedule", "Trainers", "Testimonials", "Leads".
  4.  Renders a main content area (`flex-1 bg-gray-50`).
  5.  Inside the main content area:
      a.  A header bar (`bg-white shadow-sm p-4 flex justify-between items-center`).
      b.  A greeting: "Welcome, Admin!" (`text-xl font-semibold text-[#1A1A1A]`).
      c.  A placeholder for user actions (e.g., logout button, user profile link).
      d.  The `children` prop is rendered within a `div` (`p-8`) below the header, serving as the content area for individual admin pages.

## AdminDashboardPage.tsx
**Role**: Serves as the landing page for the admin section, providing a high-level overview or quick links.

**Public Functions**:
- `AdminDashboardPage(): JSX.Element`
  1.  Wraps its content with `AdminLayout`.
  2.  Renders a main heading: "Admin Dashboard" (`text-3xl font-bold text-[#1A1A1A] mb-6`).
  3.  Displays a grid of placeholder cards (`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`) for summary statistics or quick actions. Each card should use the `Card` design token.
      a.  Example Card 1: "Total Members" with a placeholder number.
      b.  Example Card 2: "Upcoming Classes" with a placeholder count.
      c.  Example Card 3: "New Leads This Week" with a placeholder number.
  4.  Includes a motivational sub-heading: "Empowering Your Fitness Community at MultiFit Aundh!" (`text-lg text-gray-600 mt-4`).

## AdminMembershipsPage.tsx
**Role**: Provides a CRUD interface for managing membership plans.

**Public Functions**:
- `AdminMembershipsPage(): JSX.Element`
  1.  Wraps its content with `AdminLayout`.
  2.  Imports `useAdminMembershipPlans`, `useCreateMembershipPlan`, `useUpdateMembershipPlan`, `useDeleteMembershipPlan` from `frontend/src/hooks/useMemberships.ts`.
  3.  Renders a main heading: "Manage Membership Plans" (`text-3xl font-bold text-[#1A1A1A] mb-6`).
  4.  Displays a button "Add New Plan" (`bg-[#DFFF00] hover:bg-opacity-80 text-[#1A1A1A] font-semibold rounded-md px-4 py-2 transition-all duration-200 mb-6`) that, when clicked, opens a modal form for creating a new membership plan.
  5.  Fetches membership plans using `useAdminMembershipPlans()`.
  6.  Displays the fetched membership plans in a data table. Each row should include plan name, duration, price, and description.
  7.  Each row in the data table should have "Edit" and "Delete" buttons.
      a.  "Edit" button: Opens a modal form pre-filled with the plan's data for updating. Calls `useUpdateMembershipPlan` on submission.
      b.  "Delete" button: Triggers a confirmation dialog and, if confirmed, calls `useDeleteMembershipPlan` to remove the plan.
  8.  **Interactions with `frontend/src/hooks/useMemberships.ts` (from `membership-management-frontend` feature)**:
      -   Expects `useAdminMembershipPlans()` to return `UseQueryResult<MembershipPlanDto[]>` by calling `GET /api/v1/admin/memberships/plans`.
      -   Expects `useCreateMembershipPlan()` to return `UseMutationResult<MembershipPlanDto, Error, CreateMembershipPlanRequest>` which calls `POST /api/v1/admin/memberships/plans`.
      -   Expects `useUpdateMembershipPlan()` to return `UseMutationResult<MembershipPlanDto, Error, UpdateMembershipPlanRequest>` which calls `PUT /api/v1/admin/memberships/plans/{id}`.
      -   Expects `useDeleteMembershipPlan()` to return `UseMutationResult<void, Error, string>` which calls `DELETE /api/v1/admin/memberships/plans/{id}`.

## AdminSchedulePage.tsx
**Role**: Provides a CRUD interface for managing scheduled classes.

**Public Functions**:
- `AdminSchedulePage(): JSX.Element`
  1.  Wraps its content with `AdminLayout`.
  2.  Imports `useAdminSchedule`, `useCreateScheduleEntry`, `useUpdateScheduleEntry`, `useDeleteScheduleEntry` from `frontend/src/hooks/useSchedule.ts`.
  3.  Renders a main heading: "Manage Class Schedule" (`text-3xl font-bold text-[#1A1A1A] mb-6`).
  4.  Displays a button "Add New Class" (using Primary CTA styling) that opens a modal form for creating a new scheduled class.
  5.  Fetches scheduled classes using `useAdminSchedule()`.
  6.  Displays the fetched classes in a data table. Each row should include class name, trainer, start time, end time, and capacity.
  7.  Each row in the data table should have "Edit" and "Delete" buttons.
      a.  "Edit" button: Opens a modal form pre-filled with the class data for updating. Calls `useUpdateScheduleEntry` on submission.
      b.  "Delete" button: Triggers a confirmation dialog and, if confirmed, calls `useDeleteScheduleEntry` to remove the class.
  8.  **Interactions with `frontend/src/hooks/useSchedule.ts` (from `class-scheduling-frontend` feature)**:
      -   Expects `useAdminSchedule()` to return `UseQueryResult<ScheduleDto[]>` by calling `GET /api/v1/admin/schedule`.
      -   Expects `useCreateScheduleEntry()` to return `UseMutationResult<ScheduleDto, Error, CreateScheduleRequest>` which calls `POST /api/v1/admin/schedule`.
      -   Expects `useUpdateScheduleEntry()` to return `UseMutationResult<ScheduleDto, Error, UpdateScheduleRequest>` which calls `PUT /api/v1/admin/schedule/{id}`.
      -   Expects `useDeleteScheduleEntry()` to return `UseMutationResult<void, Error, string>` which calls `DELETE /api/v1/admin/schedule/{id}`.

## AdminTrainersPage.tsx
**Role**: Provides a CRUD interface for managing trainer profiles.

**Public Functions**:
- `AdminTrainersPage(): JSX.Element`
  1.  Wraps its content with `AdminLayout`.
  2.  Imports `useAdminTrainers`, `useCreateTrainer`, `useUpdateTrainer`, `useDeleteTrainer` from `frontend/src/hooks/useTrainers.ts`.
  3.  Renders a main heading: "Manage Trainers" (`text-3xl font-bold text-[#1A1A1A] mb-6`).
  4.  Displays a button "Add New Trainer" (using Primary CTA styling) that opens a modal form for creating a new trainer profile.
  5.  Fetches trainer profiles using `useAdminTrainers()`.
  6.  Displays the fetched trainers in a data table. Each row should include trainer name, specialization, and a brief description.
  7.  Each row in the data table should have "Edit" and "Delete" buttons.
      a.  "Edit" button: Opens a modal form pre-filled with the trainer's data for updating. Calls `useUpdateTrainer` on submission.
      b.  "Delete" button: Triggers a confirmation dialog and, if confirmed, calls `useDeleteTrainer` to remove the trainer.
  8.  **Interactions with `frontend/src/hooks/useTrainers.ts` (from `trainer-profiles-frontend` feature)**:
      -   Expects `useAdminTrainers()` to return `UseQueryResult<TrainerDto[]>` by calling `GET /api/v1/admin/trainers`.
      -   Expects `useCreateTrainer()` to return `UseMutationResult<TrainerDto, Error, CreateTrainerRequest>` which calls `POST /api/v1/admin/trainers`.
      -   Expects `useUpdateTrainer()` to return `UseMutationResult<TrainerDto, Error, UpdateTrainerRequest>` which calls `PUT /api/v1/admin/trainers/{id}`.
      -   Expects `useDeleteTrainer()` to return `UseMutationResult<void, Error, string>` which calls `DELETE /api/v1/admin/trainers/{id}`.

## AdminTestimonialsPage.tsx
**Role**: Provides a CRUD interface for managing testimonials.

**Public Functions**:
- `AdminTestimonialsPage(): JSX.Element`
  1.  Wraps its content with `AdminLayout`.
  2.  Imports `useAdminTestimonials`, `useCreateTestimonial`, `useUpdateTestimonial`, `useDeleteTestimonial` from `frontend/src/hooks/useTestimonials.ts`.
  3.  Renders a main heading: "Manage Testimonials" (`text-3xl font-bold text-[#1A1A1A] mb-6`).
  4.  Displays a button "Add New Testimonial" (using Primary CTA styling) that opens a modal form for creating a new testimonial.
  5.  Fetches testimonials using `useAdminTestimonials()`.
  6.  Displays the fetched testimonials in a data table. Each row should include author name, quote content, and a status (e.g., approved/pending).
  7.  Each row in the data table should have "Edit" and "Delete" buttons.
      a.  "Edit" button: Opens a modal form pre-filled with the testimonial's data for updating. Calls `useUpdateTestimonial` on submission.
      b.  "Delete" button: Triggers a confirmation dialog and, if confirmed, calls `useDeleteTestimonial` to remove the testimonial.
  8.  **Interactions with `frontend/src/hooks/useTestimonials.ts` (from `marketing-content-frontend` feature)**:
      -   Expects `useAdminTestimonials()` to return `UseQueryResult<TestimonialDto[]>` by calling `GET /api/v1/admin/testimonials`.
      -   Expects `useCreateTestimonial()` to return `UseMutationResult<TestimonialDto, Error, CreateTestimonialRequest>` which calls `POST /api/v1/admin/testimonials`.
      -   Expects `useUpdateTestimonial()` to return `UseMutationResult<TestimonialDto, Error, UpdateTestimonialRequest>` which calls `PUT /api/v1/admin/testimonials/{id}`.
      -   Expects `useDeleteTestimonial()` to return `UseMutationResult<void, Error, string>` which calls `DELETE /api/v1/admin/testimonials/{id}`.

## AdminLeadsPage.tsx
**Role**: Provides a read-only view of all captured trial leads.

**Public Functions**:
- `AdminLeadsPage(): JSX.Element`
  1.  Wraps its content with `AdminLayout`.
  2.  Imports `useAdminLeads` from `frontend/src/hooks/useLeads.ts`.
  3.  Renders a main heading: "Trial Leads" (`text-3xl font-bold text-[#1A1A1A] mb-6`).
  4.  Fetches trial leads using `useAdminLeads()`.
  5.  Displays the fetched leads in a data table. Each row should include lead name, email, phone number, and submission date.
  6.  **Interactions with `frontend/src/hooks/useLeads.ts` (from `marketing-content-frontend` feature)**:
      -   Expects `useAdminLeads()` to return `UseQueryResult<TrialLeadDto[]>` by calling `GET /api/v1/admin/leads/trial`.


---

## Membership Management (Frontend)

**Name:** `membership-management-frontend`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/types/membership.ts` — UTIL layer — exports TypeScript interfaces (MembershipPlan, Subscription) for the membership feature.
- `frontend/src/services/membershipService.ts` — SERVICE layer — exports async functions for membership API calls, including getMembershipPlans() which calls GET /api/v1/memberships/plans.
- `frontend/src/hooks/useMemberships.ts` — HOOK layer — provides the useMembershipPlans() hook, which uses @tanstack/react-query to fetch, cache, and manage the state for the list of membership plans.
- `frontend/src/pages/MembershipPage.tsx` — PAGE layer — displays available membership plans in a grid of cards. Uses the useMembershipPlans hook to fetch data and handles loading and error states.

**Feature Instruction:**

## Design Tokens
- Navbar: bg-[#1A1A1A] text-[#F5F5F5]
- Primary CTA: bg-[#DFFF00] hover:bg-[#cce000] text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200
- Secondary CTA: bg-[#333333] hover:bg-[#1A1A1A] text-[#F5F5F5] font-semibold rounded-full px-8 py-3 transition-all duration-200
- Brand text accent: text-[#DFFF00]
- Hero Section bg: bg-[#1A1A1A] text-[#F5F5F5]
- Content Section bg: bg-[#333333] text-[#F5F5F5]
- Card: bg-[#1A1A1A] rounded-xl shadow-lg border border-[#333333] p-6 text-[#F5F5F5]
- Section container: <section className="py-16 px-4"><div className="max-w-7xl mx-auto">
- Hero h1: text-4xl md:text-6xl font-bold text-[#DFFF00]
- Hero p: text-lg md:text-xl text-[#F5F5F5] mt-4 max-w-3xl mx-auto
- Section h2: text-3xl md:text-4xl font-bold text-[#DFFF00] mb-8 text-center
- Body: text-[#F5F5F5] leading-relaxed

## membership.ts
This file defines the TypeScript interfaces for the membership domain, ensuring type safety across the frontend application. It exports two interfaces:

1.  **`MembershipPlan`**: Represents a single membership plan available for purchase. This interface should precisely mirror the `MembershipPlanDto` from the `membership-management-backend` feature.
    ```

typescript
    interface MembershipPlan {
      id: string;
      name: string;
      description: string;
      price: number;
      durationMonths: number;
      features: string[];
    }
    

```

2.  **`Subscription`**: Represents a user's active or past subscription to a membership plan. This interface should precisely mirror the `SubscriptionDto` from the `membership-management-backend` feature.
    ```

typescript
    interface Subscription {
      id: string;
      userId: string;
      planId: string;
      planName: string;
      startDate: string; // ISO 8601 date string
      endDate: string; // ISO 8601 date string
      status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
    }
    

```

## membershipService.ts
This file provides functions for interacting with the membership-management-backend API. It imports `client` from `frontend/src/api/client.ts` for making HTTP requests and `MembershipPlan` from `frontend/src/types/membership.ts` for type definitions.

It exports the following asynchronous function:

1.  **`getMembershipPlans()`**: Fetches all available membership plans from the backend.
    *   **Signature**: `getMembershipPlans(): Promise<MembershipPlan[]>`
    *   **Logic**:
        1.  Makes a `GET` request to the `/api/v1/memberships/plans` endpoint using the imported `client`.
        2.  Awaits the response.
        3.  Returns the `data` field from the response, which is expected to be an array of `MembershipPlan` objects.
    *   **Error Cases**: If the API call fails (e.g., network error, server error), the promise should reject with the error.

## useMemberships.ts
This file provides React Query hooks for fetching and managing membership-related data, leveraging `membershipService.ts` for API calls and `@tanstack/react-query` for caching and state management. It imports `getMembershipPlans` from `frontend/src/services/membershipService.ts` and `MembershipPlan` from `frontend/src/types/membership.ts`.

It exports the following hook:

1.  **`useMembershipPlans()`**: A React Query hook to fetch and cache the list of membership plans.
    *   **Signature**: `useMembershipPlans(): UseQueryResult<MembershipPlan[]>`
    *   **Logic**:
        1.  Uses `useQuery` from `@tanstack/react-query`.
        2.  The query key should be `['membershipPlans']`.
        3.  The query function should call `membershipService.getMembershipPlans()`.
        4.  Returns the `UseQueryResult` object, providing `data`, `isLoading`, `isError`, and `error` properties.

## MembershipPage.tsx
This file defines the `MembershipPage` React component, which displays the available membership plans to users. It integrates with `Layout` from `@/components/Layout.tsx` for consistent page structure and uses the `useMembershipPlans` hook from `frontend/src/hooks/useMemberships.ts` to fetch data.

1.  **`MembershipPage` Component**:
    *   **Signature**: `MembershipPage(): JSX.Element`
    *   **Structure and Content**:
        *   The entire page content must be wrapped within the `<Layout>` component.
        *   **Hero Section**: (bg-[#1A1A1A] text-[#F5F5F5])
            *   A full-width hero section with a dynamic background image. Use `https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80` as the image URL. Add an overlay `<div className="absolute inset-0 bg-black bg-opacity-50" />` for text readability.
            *   **Headline (h1)**: "Unleash Your Potential at MultiFit Aundh!" (text-4xl md:text-6xl font-bold text-[#DFFF00])
            *   **Subheadline (p)**: "Choose a membership that fuels your fitness journey. No boring routines, just pure energy and results." (text-lg md:text-xl text-[#F5F5F5] mt-4 max-w-3xl mx-auto)
            *   **Call to Action (CTA)**: A button "Join Now" (Primary CTA style) that navigates to a signup page (e.g., `/signup`).
        *   **Membership Plans Section**: (bg-[#333333] text-[#F5F5F5])
            *   **Heading (h2)**: "Our Membership Plans" (text-3xl md:text-4xl font-bold text-[#DFFF00] mb-8 text-center)
            *   This section will display the membership plans fetched using `useMembershipPlans`.
            *   **Loading State**: If `isLoading` is true, display a prominent loading spinner or message like "Loading membership plans..." centered on the page.
            *   **Error State**: If `isError` is true, display an error message like "Failed to load membership plans. Please try again later." (e.g., `error.message`) centered on the page.
            *   **Data Display**: If `data` is available, render the membership plans in a responsive grid (e.g., `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`). Each plan should be displayed within a `Card` component (bg-[#1A1A1A] rounded-xl shadow-lg border border-[#333333] p-6 text-[#F5F5F5]).
                *   **Each Membership Plan Card** should include:
                    *   **Plan Name (h3)**: `plan.name` (e.g., `text-2xl font-bold text-[#DFFF00] mb-2`)
                    *   **Price**: `Rs. {plan.price} / {plan.durationMonths} Months` (e.g., `text-xl font-semibold text-[#F5F5F5] mb-4`)
                    *   **Description**: `plan.description` (e.g., `text-base text-[#F5F5F5] mb-4`)
                    *   **Features**: A list of `plan.features` (e.g., `<ul>` with `<li>` items, each with a checkmark icon and `text-[#F5F5F5]`)
                    *   **Call to Action**: A button "Select Plan" (Primary CTA style) at the bottom of the card. This button should ideally lead to a checkout or subscription initiation flow (not implemented in this feature, but the button should be present).

    *   **Interactions**:
        *   The component calls the `useMembershipPlans()` hook to fetch the list of available membership plans.
        *   It conditionally renders loading, error, or data states based on the hook's return values (`isLoading`, `isError`, `data`).
        *   Clicking the "Join Now" button in the hero section or "Select Plan" buttons on individual cards should navigate the user to the appropriate next step (e.g., `/signup` or a subscription checkout page).


---

## Class Scheduling (Frontend)

**Name:** `class-scheduling-frontend`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/types/schedule.ts` — UTIL layer — exports TypeScript interfaces (Schedule, Booking) for the class scheduling feature.
- `frontend/src/services/scheduleService.ts` — SERVICE layer — exports async functions for schedule API calls, including getSchedule() and createBooking(scheduleId).
- `frontend/src/hooks/useSchedule.ts` — HOOK layer — provides the useSchedule() query hook and the useCreateBooking() mutation hook, managing state for fetching the schedule and submitting new bookings.
- `frontend/src/pages/SchedulePage.tsx` — PAGE layer — displays the upcoming class schedule in a calendar or list view. Uses the useSchedule hook to fetch data and the useCreateBooking mutation hook to allow users to book a class.

**Feature Instruction:**

## Design Tokens
- Navbar: bg-[#1A1A1A] text-white
- Primary CTA: bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200
- Brand text accent: text-[#DFFF00]
- Section bg (dark): bg-[#1A1A1A]
- Section bg (medium): bg-[#333333]
- Card: bg-[#333333] rounded-xl shadow-lg border border-gray-700 p-6
- Section container: <section className="py-16 px-4"><div className="max-w-7xl mx-auto">
- Hero h1: text-4xl md:text-6xl font-bold text-[#DFFF00]
- Hero subheadline: text-xl md:text-2xl text-[#F5F5F5]
- Body text: text-[#F5F5F5] leading-relaxed
- Heading 1 (sections): text-3xl md:text-4xl font-bold text-[#DFFF00]
- Heading 2 (sub-sections): text-2xl md:text-3xl font-bold text-[#F5F5F5]

This feature provides the frontend functionality for viewing the class schedule and booking classes at MultiFit Aundh. It consists of TypeScript types, a service for API interaction, React Query hooks for data management, and a page component to display the schedule.

### `frontend/src/types/schedule.ts`
This file defines the TypeScript interfaces for the class scheduling domain, mirroring the DTOs from the backend.

- **Interface: `Schedule`**
  - Represents a scheduled class.
  - Fields:
    - `id: string`
    - `className: string`
    - `trainerName: string`
    - `startTime: string` (ISO 8601 formatted date-time string)
    - `endTime: string` (ISO 8601 formatted date-time string)
    - `capacity: number`
    - `currentBookings: number`

- **Interface: `Booking`**
  - Represents a user's booking for a class.
  - Fields:
    - `id: string`
    - `scheduleId: string`
    - `userId: string`
    - `bookingTime: string` (ISO 8601 formatted date-time string)

### `frontend/src/services/scheduleService.ts`
This service handles API calls related to fetching the class schedule and creating bookings.

- **Imports:**
  - `apiClient` from `frontend/src/api/client.ts`
  - `Schedule`, `Booking` from `frontend/src/types/schedule.ts`

- **Public Function: `getSchedule()`**
  - **Signature:** `getSchedule(): Promise<Schedule[]>`
  - **Logic:**
    1. Makes a GET request to the `/api/v1/schedule` endpoint using `apiClient`.
    2. Returns the array of `Schedule` objects received from the API.
  - **Error Cases:** Throws an error if the API call fails.

- **Public Function: `createBooking(scheduleId: string)`**
  - **Signature:** `createBooking(scheduleId: string): Promise<Booking>`
  - **Logic:**
    1. Makes a POST request to the `/api/v1/bookings` endpoint using `apiClient`.
    2. The request body should be `{ scheduleId: scheduleId }`.
    3. Returns the `Booking` object received from the API.
  - **Error Cases:** Throws an error if the API call fails (e.g., class full, invalid ID).

### `frontend/src/hooks/useSchedule.ts`
This file provides React Query hooks for fetching and managing the class schedule and booking mutations.

- **Imports:**
  - `useQuery`, `useMutation`, `useQueryClient` from `'@tanstack/react-query'`
  - `getSchedule`, `createBooking` from `frontend/src/services/scheduleService.ts`
  - `Schedule`, `Booking` from `frontend/src/types/schedule.ts`

- **Public Function: `useSchedule()`**
  - **Signature:** `useSchedule(): UseQueryResult<Schedule[]>`
  - **Logic:**
    1. Uses `useQuery` with the query key `['schedule']`.
    2. The query function calls `scheduleService.getSchedule()`.
    3. Returns the `UseQueryResult` object containing schedule data, loading state, and error state.

- **Public Function: `useCreateBooking()`**
  - **Signature:** `useCreateBooking(): UseMutationResult<Booking, Error, string>`
  - **Logic:**
    1. Uses `useMutation`.
    2. The mutation function calls `scheduleService.createBooking(scheduleId)`.
    3. On successful mutation, it invalidates the `['schedule']` query using `queryClient.invalidateQueries({ queryKey: ['schedule'] })` to refetch the updated schedule.
    4. Returns the `UseMutationResult` object for handling the booking mutation, including loading, success, and error states.

### `frontend/src/pages/SchedulePage.tsx`
This page component displays the upcoming class schedule and allows users to book classes.

- **Imports:**
  - `React` from `'react'`
  - `Layout` from `'@/components/Layout'`
  - `useSchedule`, `useCreateBooking` from `'../hooks/useSchedule'`
  - `format` from `'date-fns'` (for date formatting)

- **Public Function: `SchedulePage()`**
  - **Signature:** `SchedulePage(): JSX.Element`
  - **Logic:**
    1. Renders the page content wrapped within the `<Layout>` component.
    2. Initializes `useSchedule()` to fetch the class schedule and `useCreateBooking()` for booking actions.
    3. Displays a loading indicator (`Loading schedule...`) when `useSchedule` is loading.
    4. Displays an error message (`Error loading schedule: {error.message}`) if `useSchedule` encounters an error.
    5. **Page Structure and Content:**
      - **Hero Section:**
        - Rendered within a `<section>` with `className="relative h-[50vh] flex items-center justify-center text-center bg-cover bg-center"`.
        - Background image: `url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80)`.
        - An overlay `div` with `className="absolute inset-0 bg-black bg-opacity-50"`.
        - Content `div` with `className="relative z-10 p-4"`.
        - `h1` with `className="text-4xl md:text-6xl font-bold text-[#DFFF00] mb-4"` and text "Unleash Your Potential at MultiFit Aundh".
        - `p` with `className="text-xl md:text-2xl text-[#F5F5F5] mb-8"` and text "Explore our dynamic class schedule and book your next challenge.".
        - A "Book a Class Now" button (`<button className="bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200">`) that scrolls the user to the schedule display section.

      - **Schedule Overview Section:**
        - Rendered within a `<section className="py-16 px-4 bg-[#1A1A1A]">`.
        - Inner `div` with `className="max-w-7xl mx-auto"`.
        - `h2` with `className="text-3xl md:text-4xl font-bold text-[#DFFF00] mb-8 text-center"` and text "Our High-Energy Class Schedule".
        - `p` with `className="text-lg text-[#F5F5F5] mb-12 text-center max-w-3xl mx-auto"` and text "Find your perfect workout and join our vibrant community.".
        - If `schedule` data is available:
          - Display the schedule, grouped by day or as a list.
          - Each class entry should be rendered as a card (`<div className="bg-[#333333] rounded-xl shadow-lg border border-gray-700 p-6 flex flex-col justify-between">`).
          - Each card displays:
            - Class Name (`<h3 className="text-2xl font-bold text-[#DFFF00] mb-2">`)
            - Trainer Name (`<p className="text-[#F5F5F5] text-lg mb-1">Trainer: {schedule.trainerName}</p>`)
            - Time (`<p className="text-[#F5F5F5] text-lg mb-1">Time: {format(new Date(schedule.startTime), 'p')} - {format(new Date(schedule.endTime), 'p')}</p>`)
            - Available Slots (`<p className="text-[#F5F5F5] text-lg mb-4">Slots: {schedule.currentBookings}/{schedule.capacity}</p>`)
            - A "Book Now" button (`<button className="bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200 w-full" onClick={() => mutate(schedule.id)} disabled={isBooking || schedule.currentBookings >= schedule.capacity}>`)
              - The button should be disabled if `isBooking` is true or if the class is full.
              - On click, it calls `mutate(schedule.id)` from `useCreateBooking`.
              - Display "Booking..." when `isBooking` is true.
              - Display "Booked!" briefly on success (optional, or use a toast).
        - Handle `useCreateBooking` states:
          - Display a success message (e.g., a toast notification) on `onSuccess`.
          - Display an error message (e.g., a toast notification) on `onError`.

    6. Ensure all text content aligns with the 'Motivational, high-energy, and community-focused' tone.

---

## Trainer Profiles (Frontend)

**Name:** `trainer-profiles-frontend`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/types/trainer.ts` — UTIL layer — exports the TypeScript interface for Trainer, ensuring type safety for trainer-related data.
- `frontend/src/services/trainerService.ts` — SERVICE layer — exports an async getTrainers() function that calls the GET /api/v1/trainers endpoint.
- `frontend/src/hooks/useTrainers.ts` — HOOK layer — provides the useTrainers() hook, which uses @tanstack/react-query to fetch, cache, and manage the state for the list of trainers.
- `frontend/src/pages/TrainersPage.tsx` — PAGE layer — displays all trainer profiles in a grid of cards. Each card shows the trainer's photo, name, and specialization. Uses the useTrainers hook to fetch data.

**Feature Instruction:**

## Design Tokens
- Navbar: bg-[#1A1A1A] text-[#F5F5F5]
- Primary CTA: bg-[#DFFF00] hover:bg-[#DFFF00] text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200
- Brand text accent: text-[#DFFF00]
- Section bg: bg-[#F5F5F5] (odd sections) / bg-gray-50 (even sections)
- Card: bg-white rounded-xl shadow-md border border-gray-100 p-6
- Section container: <section className="py-16 px-4"><div className="max-w-7xl mx-auto">
- Hero h1: text-4xl md:text-6xl font-bold text-[#F5F5F5]
- Body: text-[#333333] leading-relaxed

## trainer.ts
This file defines the TypeScript interface `Trainer` which represents a trainer profile, mirroring the `TrainerDto` from the backend. It ensures type safety across the frontend for trainer-related data.

```

typescript
export interface Trainer {
  id: string;
  name: string;
  specialization: string;
  imageUrl: string;
}


```

## trainerService.ts
This file provides a service for making API calls related to trainer profiles. It exports an asynchronous function to fetch all trainers.

### Public Functions

#### `getTrainers(): Promise<Trainer[]>`
1.  Makes a `GET` request to the `/api/v1/trainers` endpoint using the `apiClient` from `frontend/src/api/client.ts`.
2.  The `apiClient` is an Axios instance configured to include the JWT token from `localStorage.getItem('token')` in its headers.
3.  If the request is successful, it returns a `Promise` that resolves to an array of `Trainer` objects.
4.  If the request fails, it throws an error.

### Dependencies
-   Imports `apiClient` from `frontend/src/api/client.ts`.
-   Imports `Trainer` from `frontend/src/types/trainer.ts`.

## useTrainers.ts
This file provides a React Query hook for fetching and managing the state of trainer profiles. It leverages `@tanstack/react-query` for efficient data fetching, caching, and synchronization.

### Public Functions

#### `useTrainers(): UseQueryResult<Trainer[]>`
1.  This hook uses `react-query`'s `useQuery` to fetch trainer data.
2.  The `queryKey` for this hook should be `['trainers']`.
3.  The `queryFn` calls `trainerService.getTrainers()`.
4.  It returns a `UseQueryResult` object containing the fetched `Trainer[]` data, loading state, and error state.

### Dependencies
-   Imports `getTrainers` from `frontend/src/services/trainerService.ts`.
-   Imports `Trainer` from `frontend/src/types/trainer.ts`.
-   Imports `useQuery` and `UseQueryResult` from `@tanstack/react-query`.

## TrainersPage.tsx
This file defines the `TrainersPage` component, which is responsible for displaying a list of all gym trainers. It uses the `useTrainers` hook to fetch data and presents it in a visually appealing grid of cards, adhering to the specified design tokens and visual direction.

### Public Functions

#### `TrainersPage(): JSX.Element`
1.  Renders the main page for trainer profiles.
2.  Wraps its content within the `<Layout>` component imported from `frontend/src/components/Layout.tsx`.
3.  Utilizes the `useTrainers()` hook to fetch the list of trainers. It handles loading and error states gracefully.
4.  **Page Structure and Content:**
    *   **Hero Section:**
        *   A full-width section with a background image: `https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80` with an overlay `bg-black bg-opacity-50`.
        *   Contains a `h1` element with the text "Meet Our Elite Trainers at MultiFit Aundh" styled with `text-4xl md:text-6xl font-bold text-[#F5F5F5]`.
        *   A `p` element below the `h1` with the text "Dedicated to empowering your fitness journey with expertise and passion." styled with `text-xl text-[#F5F5F5] mt-4`.
    *   **Trainers Grid Section:**
        *   A section container `py-16 px-4` with `max-w-7xl mx-auto`.
        *   A `h2` element with the text "Our Expert Team" styled with `text-3xl md:text-4xl font-bold text-[#1A1A1A] text-center mb-12`.
        *   Displays a loading spinner or message if `useTrainers` is loading.
        *   Displays an error message if `useTrainers` encounters an error.
        *   If data is successfully fetched, it renders a grid of trainer cards. The grid should be responsive, showing 1 column on small screens, 2 on medium, and 3 or 4 on large screens.
        *   **Trainer Card Structure:** Each card should be styled with `bg-white rounded-xl shadow-md border border-gray-100 p-6 text-center`.
            *   An `img` element for `trainer.imageUrl` with `className="w-32 h-32 rounded-full mx-auto object-cover mb-4 border-4 border-[#DFFF00]"`.
            *   A `h3` element for `trainer.name` with `className="text-xl font-semibold text-[#1A1A1A] mb-2"`.
            *   A `p` element for `trainer.specialization` with `className="text-[#333333] text-sm"`.

### Dependencies
-   Imports `Layout` from `frontend/src/components/Layout.tsx`.
-   Imports `useTrainers` from `frontend/src/hooks/useTrainers.ts`.
-   Imports `Trainer` from `frontend/src/types/trainer.ts`.

---

## Marketing Content (Frontend)

**Name:** `marketing-content-frontend`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/types/marketing.ts` — UTIL layer — exports TypeScript interfaces (Testimonial, TrialLead, CreateTrialLead) for marketing content.
- `frontend/src/services/marketingService.ts` — SERVICE layer — exports async functions getTestimonials() and submitTrialLead(leadData) to interact with the marketing content endpoints.
- `frontend/src/hooks/useMarketingContent.ts` — HOOK layer — provides the useTestimonials() query hook and the useSubmitTrialLead() mutation hook for managing marketing content state.
- `frontend/src/components/TestimonialsSection.tsx` — COMPONENT layer — displays a rotating carousel of customer testimonials. Uses the useTestimonials hook to fetch data and renders it in a visually appealing format that highlights the high Google rating.
- `frontend/src/components/TrialLeadForm.tsx` — COMPONENT layer — provides the form for the 'Get a 3-Day Free Trial' call-to-action. Uses react-hook-form and zod for validation and calls the useSubmitTrialLead mutation on submit.

**Feature Instruction:**

## Design Tokens
- Navbar: bg-[#1A1A1A] text-[#F5F5F5]
- Primary CTA: bg-[#DFFF00] hover:bg-opacity-80 text-[#1A1A1A] font-bold rounded-full px-8 py-3 transition-all duration-200
- Secondary CTA: bg-[#333333] hover:bg-[#1A1A1A] text-[#F5F5F5] font-semibold rounded-full px-6 py-2 transition-all duration-200
- Brand text accent: text-[#DFFF00]
- Section bg: bg-[#1A1A1A] text-[#F5F5F5]
- Card: bg-[#333333] rounded-xl shadow-lg border border-[#1A1A1A] p-6 text-[#F5F5F5]
- Section container: <section className="py-16 px-4"><div className="max-w-7xl mx-auto">
- Hero h1: text-4xl md:text-6xl font-extrabold text-[#DFFF00]
- Body: text-[#F5F5F5] leading-relaxed
- Input field: bg-[#333333] text-[#F5F5F5] border border-[#1A1A1A] rounded-md p-3 focus:ring-[#DFFF00] focus:border-[#DFFF00] focus:outline-none
- Error text: text-red-500

## marketing.ts
This file defines the TypeScript interfaces for marketing-related data structures.

### Interfaces
1.  **Testimonial**
    *   Represents a customer testimonial.
    *   Fields:
        *   `id`: `string`
        *   `author`: `string`
        *   `quote`: `string`
        *   `rating`: `number` (e.g., 5 for 5-star rating)
        *   `imageUrl`: `string` (optional, URL to author's image)

2.  **TrialLead**
    *   Represents a submitted trial lead.
    *   Fields:
        *   `id`: `string`
        *   `name`: `string`
        *   `email`: `string`
        *   `phone`: `string`
        *   `submissionDate`: `string` (ISO 8601 format)

3.  **CreateTrialLead**
    *   Represents the data required to create a new trial lead.
    *   Fields:
        *   `name`: `string`
        *   `email`: `string`
        *   `phone`: `string`

## marketingService.ts
This file provides asynchronous functions to interact with the marketing content backend API.

### Dependencies
*   `apiClient` from `frontend/src/api/client.ts`
*   `Testimonial`, `TrialLead`, `CreateTrialLead` from `frontend/src/types/marketing.ts`

### Public Functions
1.  **getTestimonials(): Promise<Testimonial[]>**
    *   **Logic:**
        1.  Makes a GET request to `/api/v1/testimonials` using `apiClient.get()`.
        2.  Returns the array of `Testimonial` objects from the response data.
    *   **Error Cases:** Throws any error encountered during the API call.

2.  **submitTrialLead(leadData: CreateTrialLead): Promise<TrialLead>**
    *   **Logic:**
        1.  Makes a POST request to `/api/v1/leads/trial` using `apiClient.post()`.
        2.  The request body is `leadData`.
        3.  Returns the `TrialLead` object from the response data.
    *   **Error Cases:** Throws any error encountered during the API call (e.g., validation errors from backend).

## useMarketingContent.ts
This file provides React Query hooks for managing marketing content state, abstracting API calls and caching.

### Dependencies
*   `useQuery`, `useMutation`, `UseQueryResult`, `UseMutationResult` from `@tanstack/react-query`
*   `getTestimonials`, `submitTrialLead` from `frontend/src/services/marketingService.ts`
*   `Testimonial`, `TrialLead`, `CreateTrialLead` from `frontend/src/types/marketing.ts`

### Public Functions
1.  **useTestimonials(): UseQueryResult<Testimonial[]>**
    *   **Logic:**
        1.  Uses `useQuery` to fetch testimonials.
        2.  `queryKey`: `['testimonials']`
        3.  `queryFn`: Calls `marketingService.getTestimonials()`.
        4.  Returns the `UseQueryResult` object containing data, loading state, and error.

2.  **useSubmitTrialLead(): UseMutationResult<TrialLead, Error, CreateTrialLead>**
    *   **Logic:**
        1.  Uses `useMutation` to handle trial lead submission.
        2.  `mutationFn`: Calls `marketingService.submitTrialLead(leadData)`.
        3.  Returns the `UseMutationResult` object containing the mutate function, loading state, and error.

## TestimonialsSection.tsx
This component displays a dynamic section of customer testimonials, highlighting the gym's positive feedback.

### Dependencies
*   `React`
*   `useTestimonials` from `frontend/src/hooks/useMarketingContent.ts`
*   `Swiper`, `SwiperSlide` from `swiper/react`
*   `Navigation`, `Pagination`, `Autoplay` from `swiper/modules`
*   `'swiper/css'`, `'swiper/css/navigation'`, `'swiper/css/pagination'`
*   `FaStar` from `react-icons/fa`

### Public Functions
1.  **TestimonialsSection(): JSX.Element**
    *   **Logic:**
        1.  Fetches testimonials using `useTestimonials()`.
        2.  Displays a loading spinner if `isLoading` is true.
        3.  Displays an error message if `isError` is true.
        4.  Renders a section with a bold, high-energy heading: "Hear It From Our Tribe: Real MultiFit Aundh Success Stories!" using `text-4xl md:text-5xl font-extrabold text-[#DFFF00]`.
        5.  Below the heading, include a sub-headline: "Join the community that's transforming lives and redefining fitness." using `text-lg text-[#F5F5F5] mb-8`.
        6.  If testimonials are loaded, renders a `Swiper` component configured for:
            *   `spaceBetween`: 30
            *   `slidesPerView`: 1 (on mobile), 2 (on tablet), 3 (on desktop)
            *   `autoplay`: `{ delay: 5000, disableOnInteraction: false }`
            *   `navigation`: true
            *   `pagination`: `{ clickable: true }`
            *   `modules`: `[Navigation, Pagination, Autoplay]`
            *   `loop`: true
        7.  Each `SwiperSlide` contains a `Testimonial` card (`bg-[#333333] rounded-xl shadow-lg p-6 text-[#F5F5F5]`).
        8.  Inside each card:
            *   Display the `quote` in a prominent, italicized font (`text-xl italic mb-4`).
            *   Display the `author`'s name (`font-bold text-[#DFFF00]`).
            *   Render `FaStar` icons based on the `rating` (e.g., 5 yellow stars for a 5-star rating, using `text-[#DFFF00]`).
            *   If `imageUrl` is present, display a circular author image.
        9.  Include a prominent call to action below the testimonials: "Ready to Write Your Own Success Story?" with a Primary CTA button "Join MultiFit Aundh Today!" linking to `/memberships`.
        10. The entire section should use `Section bg: bg-[#1A1A1A]` and `Section container` design tokens.

## TrialLeadForm.tsx
This component provides a form for users to sign up for a '3-Day Free Trial', capturing lead information.

### Dependencies
*   `React`, `useState`
*   `useForm` from `react-hook-form`
*   `zod`, `zodResolver` from `@hookform/resolvers/zod`
*   `useSubmitTrialLead` from `frontend/src/hooks/useMarketingContent.ts`
*   `CreateTrialLead` from `frontend/src/types/marketing.ts`
*   `FaCheckCircle`, `FaExclamationCircle` from `react-icons/fa`

### Public Functions
1.  **TrialLeadForm(): JSX.Element**
    *   **Logic:**
        1.  Defines a Zod schema for `CreateTrialLead` with validation rules:
            *   `name`: required, min 2 characters.
            *   `email`: required, valid email format.
            *   `phone`: required, valid phone number format (e.g., regex for 10-digit numbers, allowing optional country code).
        2.  Initializes `react-hook-form` with `zodResolver` for the schema.
        3.  Uses `useSubmitTrialLead()` for form submission.
        4.  Manages form submission state (`isSuccess`, `isError`) using `useState` or derived from `useSubmitTrialLead`.
        5.  Renders a form within a `Card` design token (`bg-[#333333] rounded-xl shadow-lg p-6 text-[#F5F5F5]`).
        6.  Includes a motivational heading: "Ignite Your Journey: Claim Your 3-Day Free Trial!" using `text-3xl font-bold text-[#DFFF00] mb-4`.
        7.  Provides a sub-headline: "Experience the MultiFit Aundh difference – no commitment, just pure fitness." using `text-lg text-[#F5F5F5] mb-6`.
        8.  For each field (`name`, `email`, `phone`):
            *   Renders a `label` and an `input` element.
            *   Applies `Input field` design tokens (`bg-[#333333] text-[#F5F5F5] border border-[#1A1A1A] rounded-md p-3 focus:ring-[#DFFF00] focus:border-[#DFFF00] focus:outline-none`).
            *   Displays validation errors below the input using `Error text` design token (`text-red-500`).
        9.  Renders a submit button using `Primary CTA` design token (`bg-[#DFFF00] hover:bg-opacity-80 text-[#1A1A1A] font-bold rounded-full px-8 py-3 transition-all duration-200`). The button text should be "Start My Free Trial!" and be disabled while `isPending` (from `useSubmitTrialLead`).
        10. Displays a success message with `FaCheckCircle` if `isSuccess` is true: "Awesome! Your trial request is in. Get ready to experience the best of MultiFit Aundh!" using `text-green-500`.
        11. Displays an error message with `FaExclamationCircle` if `isError` is true: "Oops! Something went wrong. Please try again or contact us directly." using `text-red-500`.

---

## Infrastructure

**Name:** `infrastructure`  
**Type:** INFRA  
**Change required:** true

**Feature Instruction:**

_Not enriched (INFRA or skipped)._

---

