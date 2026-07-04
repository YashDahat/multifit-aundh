# Feature Enrichment — Attempt 4

Generated: 2026-07-04

Each section is one LLM call (~5–8K tokens). The instruction tells the generator how all files in the feature interact and what contracts they must honour.

---

## Authentication Core (Backend)

**Name:** `authentication-core`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/multifitaundh/model/User.java` — MODEL layer - Defines the User entity for JPA persistence, including fields for authentication and authorization (email, password, role).
- `backend/src/main/java/com/multifitaundh/model/Role.java` — MODEL layer - A simple Java enum defining the authority levels in the application, primarily 'ADMIN'.
- `backend/src/main/java/com/multifitaundh/repository/UserRepository.java` — REPOSITORY layer - Provides data access methods for the User entity, including the critical findByEmail(String email) for the authentication process.
- `backend/src/main/java/com/multifitaundh/service/UserService.java` — SERVICE layer - Implements UserDetailsService for Spring Security integration. Its loadUserByUsername(String email) method is the entry point for authenticating users against the database.
- `backend/src/main/java/com/multifitaundh/util/JwtUtil.java` — UTIL layer - A stateless utility for all JWT operations. Provides generateToken(UserDetails), validateToken(String, UserDetails), and extractEmail(String) methods to the security filter and auth controller.
- `backend/src/main/java/com/multifitaundh/config/AdminInitializer.java` — CONFIG layer - A CommandLineRunner that ensures at least one ADMIN user exists on startup, preventing the system from being locked out. Reads admin credentials from environment variables.

**Feature Instruction:**

This feature, `authentication-core`, provides the foundational backend components for user authentication and authorization within the MultiFit Aundh application. It defines the `User` entity, user roles, a repository for user data access, a service for Spring Security integration, a utility for JWT handling, and an initializer to ensure a default admin user exists on startup.

### `Role.java`
This file defines a simple Java enum `Role` to represent the different authority levels within the application.

*   **Enum Definition**: `public enum Role`
*   **Enum Members**: `ADMIN` (representing an administrator with full access to management features).

### `User.java`
This file defines the `User` JPA entity, which represents an application user, primarily for administrative access. It also implements Spring Security's `UserDetails` interface.

*   **Class Definition**: `public class User implements UserDetails`
*   **JPA Annotations**: `@Entity`, `@Table(name = "users")`
*   **Fields**:
    *   `id`: `UUID` (Primary key, generated automatically). Annotated with `@Id` and `@GeneratedValue(strategy = GenerationType.UUID)`.
    *   `email`: `String` (User's email address, used for login. Must be unique and not null). Annotated with `@Column(unique = true, nullable = false)`.
    *   `password`: `String` (BCrypt-hashed password. Not null). Annotated with `@Column(nullable = false)`.
    *   `role`: `Role` (User's role, determining permissions. Not null). Annotated with `@Enumerated(EnumType.STRING)` and `@Column(nullable = false)`.
*   **Constructors**: A no-argument constructor and a constructor taking `email`, `password`, and `role`.
*   **Getters and Setters**: Standard getters and setters for all fields.
*   **`UserDetails` Implementation**:
    *   `getAuthorities()`: Returns a `Collection<? extends GrantedAuthority>` containing a `SimpleGrantedAuthority` for the user's `role` (e.g., `ROLE_ADMIN`).
    *   `getPassword()`: Returns the `password` field.
    *   `getUsername()`: Returns the `email` field.
    *   `isAccountNonExpired()`: Returns `true`.
    *   `isAccountNonLocked()`: Returns `true`.
    *   `isCredentialsNonExpired()`: Returns `true`.
    *   `isEnabled()`: Returns `true`.

### `UserRepository.java`
This file defines the Spring Data JPA repository for `User` entities, providing data access methods.

*   **Interface Definition**: `public interface UserRepository extends JpaRepository<User, UUID>`
*   **Annotation**: `@Repository`
*   **Methods**:
    *   `findByEmail(String email)`: `Optional<User>`
        *   **Logic**: Finds a user by their unique email address. This is a custom finder method required by Spring Data JPA.

### `UserService.java`
This file implements Spring Security's `UserDetailsService` to load user-specific data during the authentication process.

*   **Class Definition**: `public class UserService implements UserDetailsService`
*   **Annotation**: `@Service`
*   **Dependencies**: Injects `UserRepository`.
*   **Methods**:
    *   `loadUserByUsername(String email)`: `UserDetails`
        1.  Calls `userRepository.findByEmail(email)` to retrieve the user.
        2.  If the `Optional<User>` is empty, throws a `UsernameNotFoundException` with a message like "User not found with email: " + `email`.
        3.  If the user is found, returns the `User` object (which implements `UserDetails`).

### `JwtUtil.java`
This file is a utility class for handling JWT creation, validation, and claims extraction. It uses a Base64-encoded secret key and an expiration time configured in `application.properties`.

*   **Class Definition**: `public class JwtUtil`
*   **Annotation**: `@Component`
*   **Dependencies**: Uses `@Value("${jwt.secret}")` to inject the JWT secret key and `@Value("${jwt.expiration}")` to inject the token expiration time (in milliseconds).
*   **Methods**:
    *   `generateToken(UserDetails userDetails)`: `String`
        1.  **Logic**: Creates a JWT token.
            *   Sets the subject to `userDetails.getUsername()`.
            *   Sets the issued at time to `new Date(System.currentTimeMillis())`.
            *   Sets the expiration time to `new Date(System.currentTimeMillis() + expirationTime)`.
            *   Signs the token using `Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret))`.
            *   Builds and compacts the JWT.
    *   `validateToken(String token, UserDetails userDetails)`: `boolean`
        1.  **Logic**: Validates a JWT against a user's details.
            *   Extracts the email from the `token` using `extractEmail(token)`.
            *   Compares the extracted email with `userDetails.getUsername()`.
            *   Checks if the token is expired using `isTokenExpired(token)`.
            *   Returns `true` if the email matches and the token is not expired; otherwise, returns `false`.
    *   `extractEmail(String token)`: `String`
        1.  **Logic**: Extracts the email (subject) from a JWT.
            *   Parses the token using the signing key.
            *   Retrieves the subject claim.
            *   Returns the subject as a `String`.
*   **Helper Methods (private)**:
    *   `extractAllClaims(String token)`: `Claims` (Parses the token and returns all claims).
    *   `extractClaim(String token, Function<Claims, T> claimsResolver)`: `T` (Extracts a specific claim).
    *   `isTokenExpired(String token)`: `boolean` (Checks if the token's expiration date is before the current date).
    *   `getSigningKey()`: `Key` (Decodes the Base64 secret key into a `Key`).

### `AdminInitializer.java`
This file is a `CommandLineRunner` that ensures a default admin user is created on application startup if one does not already exist. It reads admin credentials from `application.properties`.

*   **Class Definition**: `public class AdminInitializer implements CommandLineRunner`
*   **Annotation**: `@Component`
*   **Dependencies**: Injects `UserRepository` and `BCryptPasswordEncoder` (the latter is provided by the `authentication-api` feature's `SecurityConfig`).
*   **Properties**: Uses `@Value("${admin.email}")` and `@Value("${admin.password}")` to inject the default admin email and raw password from `application.properties`.
*   **Methods**:
    *   `run(String... args)`: `void`
        1.  **Logic**: Executes on application startup.
            *   Calls `userRepository.findByEmail(adminEmail)` to check for an existing admin user.
            *   If the `Optional<User>` is empty (no admin user found):
                *   Creates a new `User` object.
                *   Sets the `email` using the injected `adminEmail`.
                *   Sets the `password` by encoding the injected `adminPassword` using `bCryptPasswordEncoder.encode(adminPassword)`.
                *   Sets the `role` to `Role.ADMIN`.
                *   Saves the new `User` object using `userRepository.save(adminUser)`.
                *   Logs a message indicating the successful creation of the default admin user.
            *   If an admin user already exists, logs a message indicating that the admin user already exists and no new user was created.

### Inter-file Wiring and Cross-Feature Contracts
*   `UserService` injects `UserRepository` and calls `userRepository.findByEmail()`.
*   `AdminInitializer` injects `UserRepository` and `BCryptPasswordEncoder`. It calls `userRepository.findByEmail()` and `userRepository.save()`.
*   `User` implements `UserDetails`, which is a core Spring Security interface. `UserService.loadUserByUsername()` returns this `User` object.
*   `JwtUtil`'s `generateToken()` and `validateToken()` methods operate on `UserDetails` objects, which are provided by `UserService` during the authentication flow (handled by the `authentication-api` feature).
*   `AdminInitializer` depends on `BCryptPasswordEncoder`, which is expected to be defined as a `@Bean` in the `authentication-api` feature's `SecurityConfig`.

---

## Authentication API (Backend)

**Name:** `authentication-api`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/multifitaundh/config/SecurityConfig.java` — CONFIG layer - Central hub for security configuration. Defines CORS policy, CSRF disablement, stateless session management, and the crucial HTTP authorization rules, placing the JwtAuthFilter in the filter chain.
- `backend/src/main/java/com/multifitaundh/security/JwtAuthFilter.java` — CONFIG layer - A OncePerRequestFilter that extracts the Bearer token, validates it using JwtUtil, and sets the authentication in the SecurityContextHolder if valid.
- `backend/src/main/java/com/multifitaundh/controller/AuthController.java` — CONTROLLER layer - Exposes the public POST /api/v1/auth/login endpoint. It uses Spring's AuthenticationManager to validate credentials and JwtUtil to generate a token for the frontend.
- `backend/src/main/java/com/multifitaundh/dto/AuthRequest.java` — DTO layer - A record representing the JSON body for a login request, with @NotBlank and @Email validation annotations.
- `backend/src/main/java/com/multifitaundh/dto/AuthResponse.java` — DTO layer - A record representing the JSON response after a successful login, containing the JWT and user role.

**Feature Instruction:**

This feature, `authentication-api`, provides the backend logic for user authentication, specifically for administrative users. It includes DTOs for authentication requests and responses, a REST controller for login, a JWT filter for securing API endpoints, and Spring Security configuration.

## File: `backend/src/main/java/com/multifitaundh/dto/AuthRequest.java`
This file defines the Data Transfer Object (DTO) for authentication requests.

**Class Name:** `AuthRequest`
**Type:** Java Record
**Description:** A record representing the JSON body for a login request.

**Fields:**
*   `String email`: User's email. Must be a valid email format and not blank. Annotated with `@NotBlank` and `@Email`.
*   `String password`: User's password. Must not be blank. Annotated with `@NotBlank`.

## File: `backend/src/main/java/com/multifitaundh/dto/AuthResponse.java`
This file defines the Data Transfer Object (DTO) for authentication responses.

**Class Name:** `AuthResponse`
**Type:** Java Record
**Description:** A record representing the JSON response after a successful login.

**Fields:**
*   `String token`: The generated JWT.
*   `String role`: The role of the authenticated user (e.g., "ADMIN").

## File: `backend/src/main/java/com/multifitaundh/controller/AuthController.java`
This file handles the authentication endpoint for admin login.

**Class Name:** `AuthController`
**Type:** `@RestController`
**Path:** `/api/v1/auth`

**Dependencies:**
*   Injects `AuthenticationManager` (Spring Security component).
*   Injects `JwtUtil` (from `authentication-core` feature).

**Public Methods:**

### `login(AuthRequest authRequest): ResponseEntity<AuthResponse>`
**Endpoint:** `POST /api/v1/auth/login`
**Description:** Authenticates a user and returns a JWT.
**Parameters:**
*   `@RequestBody @Valid AuthRequest authRequest`: The authentication request containing email and password.

**Logic:**
1.  Create a `UsernamePasswordAuthenticationToken` using `authRequest.email()` and `authRequest.password()`.
2.  Attempt authentication using `authenticationManager.authenticate(authenticationToken)`. This will delegate to the `DaoAuthenticationProvider` configured in `SecurityConfig`.
3.  If authentication is successful, retrieve the `UserDetails` from the authenticated `Authentication` object (e.g., `authentication.getPrincipal()`).
4.  Generate a JWT using `jwtUtil.generateToken(userDetails)`.
5.  Extract the user's role from `userDetails.getAuthorities()`. Assume the first authority is the primary role (e.g., `userDetails.getAuthorities().iterator().next().getAuthority()`).
6.  Return a `ResponseEntity` with `HttpStatus.OK` (200) and an `AuthResponse` containing the generated token and user role.

**Error Cases:**
*   If authentication fails (e.g., invalid credentials), `authenticationManager.authenticate()` will throw a `BadCredentialsException`. Catch this exception and return `ResponseEntity` with `HttpStatus.UNAUTHORIZED` (401) and a suitable error message.
*   If `AuthRequest` validation fails (due to `@Valid` annotations), Spring's default exception handling for `MethodArgumentNotValidException` will return `HttpStatus.BAD_REQUEST` (400).

## File: `backend/src/main/java/com/multifitaundh/security/JwtAuthFilter.java`
This file defines a filter that intercepts requests to validate the JWT from the Authorization header and set the security context.

**Class Name:** `JwtAuthFilter`
**Type:** Extends `OncePerRequestFilter`

**Dependencies:**
*   Injects `JwtUtil` (from `authentication-core` feature).
*   Injects `UserService` (from `authentication-core` feature).

**Public Methods:**

### `doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain): void`
**Description:** Performs JWT validation for each incoming request.
**Parameters:**
*   `@NonNull HttpServletRequest request`: The HTTP request.
*   `@NonNull HttpServletResponse response`: The HTTP response.
*   `@NonNull FilterChain filterChain`: The filter chain.

**Logic:**
1.  Retrieve the `Authorization` header from the `HttpServletRequest`.
2.  Check if the header exists and starts with "Bearer ".
3.  If a Bearer token is found:
    a.  Extract the JWT string by removing "Bearer " prefix.
    b.  Extract the email from the token using `jwtUtil.extractEmail(token)`.
    c.  If the email is not null and `SecurityContextHolder.getContext().getAuthentication()` is null (meaning the user is not already authenticated):
        i.   Load `UserDetails` using `userService.loadUserByUsername(email)`.
        ii.  Validate the token using `jwtUtil.validateToken(token, userDetails)`.
        iii. If the token is valid, create a `UsernamePasswordAuthenticationToken` with `userDetails`, `null` credentials, and `userDetails.getAuthorities()`.
        iv.  Set the authentication object in `SecurityContextHolder.getContext()`.
4.  Continue the filter chain by calling `filterChain.doFilter(request, response)`.

## File: `backend/src/main/java/com/multifitaundh/config/SecurityConfig.java`
This file configures Spring Security, including CORS, stateless session management, JWT filter chain, and authorization rules.

**Class Name:** `SecurityConfig`
**Type:** `@Configuration`, `@EnableWebSecurity`, `@EnableMethodSecurity`

**Dependencies:**
*   Injects `JwtAuthFilter`.
*   Injects `UserService` (from `authentication-core` feature).

**Public Methods:**

### `securityFilterChain(HttpSecurity http): SecurityFilterChain`
**Type:** `@Bean`
**Description:** Defines the security filter chain and request authorization rules.
**Parameters:**
*   `HttpSecurity http`: The HttpSecurity object to configure.

**Logic:**
1.  Configure CORS using `http.cors(Customizer.withDefaults())`.
2.  Disable CSRF protection using `http.csrf(csrf -> csrf.disable())`.
3.  Configure session management to be stateless using `http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))`.
4.  Define authorization rules using `http.authorizeHttpRequests(auth -> auth
    .requestMatchers("/api/v1/auth/**").permitAll()
    .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
    .requestMatchers("/api/v1/**").permitAll()
    .anyRequest().authenticated()
)`.
    *   `/api/v1/auth/**` (e.g., `/api/v1/auth/login`) should be permitted for all.
    *   `/api/v1/admin/**` endpoints require an authenticated user with the `ADMIN` role.
    *   All other `/api/v1/**` endpoints (public APIs like trainers, testimonials, leads, gym info) should be permitted for all.
    *   Any other request not explicitly matched requires authentication.
5.  Add `JwtAuthFilter` to the filter chain before `UsernamePasswordAuthenticationFilter` using `http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)`.
6.  Configure the `AuthenticationProvider` using `http.authenticationProvider(authenticationProvider())`.
7.  Build and return the `SecurityFilterChain`.

### `passwordEncoder(): BCryptPasswordEncoder`
**Type:** `@Bean`
**Description:** Provides a `BCryptPasswordEncoder` bean for password hashing.
**Logic:** Returns a new instance of `BCryptPasswordEncoder`.

### `authenticationProvider(): DaoAuthenticationProvider`
**Type:** `@Bean`
**Description:** Configures a `DaoAuthenticationProvider` with `UserService` and `passwordEncoder()`.
**Logic:**
1.  Create a new `DaoAuthenticationProvider`.
2.  Set the `UserDetailsService` to `userService`.
3.  Set the `PasswordEncoder` to the result of `passwordEncoder()`.
4.  Return the configured `DaoAuthenticationProvider`.

### `authenticationManager(AuthenticationConfiguration config): AuthenticationManager`
**Type:** `@Bean`
**Description:** Exposes the `AuthenticationManager` bean.
**Parameters:**
*   `AuthenticationConfiguration config`: The Spring `AuthenticationConfiguration`.
**Logic:** Returns `config.getAuthenticationManager()`.

---

## Trainer Management (Backend Core)

**Name:** `trainer-management`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/multifitaundh/model/Trainer.java` — MODEL layer - Defines the Trainer entity for storing trainer profiles, including name, specializations, bio, and image URL.
- `backend/src/main/java/com/multifitaundh/repository/TrainerRepository.java` — REPOSITORY layer - Provides data access for Trainer entities, including a custom findBySlug(String slug) method for public-facing profile pages.
- `backend/src/main/java/com/multifitaundh/service/TrainerService.java` — SERVICE layer - Implements the business logic for trainer CRUD operations. Methods like createTrainer(CreateTrainerRequest) and getAllTrainers() serve the admin and public controllers.

**Feature Instruction:**

The `trainer-management` backend feature provides core functionality for managing gym trainer profiles. It consists of a `Trainer` entity, a `TrainerRepository` for data access, and a `TrainerService` for business logic.

### Trainer.java
This file defines the `Trainer` JPA entity. It represents a gym trainer with the following attributes:
- `id`: A `UUID` serving as the primary key. It should be automatically generated.
- `name`: A `String` representing the trainer's full name. This field must not be null.
- `specializations`: A `String` storing a comma-separated list of the trainer's specializations (e.g., "CrossFit, Yoga").
- `bio`: A `String` for a short biography of the trainer. This should be mapped to a `TEXT` column type in the database.
- `imageUrl`: A `String` storing the URL to the trainer's profile picture.
- `slug`: A `String` representing a URL-friendly unique identifier for the trainer's detail page. This field must be unique.

The `Trainer` class should be annotated with `@Entity` and `@Table` (if a custom table name is desired). Fields should be annotated with `@Id`, `@GeneratedValue`, `@Column`, and `@Lob` as appropriate.

### TrainerRepository.java
This file defines the `TrainerRepository` interface, which extends Spring Data JPA's `JpaRepository<Trainer, UUID>`. This provides standard CRUD operations for `Trainer` entities.
Additionally, it declares one custom finder method:
- `findBySlug(String slug): Optional<Trainer>`: This method finds a `Trainer` entity by its unique `slug`. It returns an `Optional` to handle cases where no trainer with the given slug is found.

### TrainerService.java
This file implements the business logic for managing trainer data. It is annotated with `@Service` and injects `TrainerRepository`.

**Dependencies:**
- `TrainerRepository`

**Public Methods:**

1.  **`getAllTrainers(): List<TrainerDto>`**
    -   **Logic:**
        1.  Retrieve all `Trainer` entities from the `trainerRepository`.
        2.  Map each `Trainer` entity to a `TrainerDto`. The mapping should include all fields from `Trainer` to `TrainerDto`.
        3.  Return the list of `TrainerDto`.
    -   **Error Cases:** None specific; an empty list is returned if no trainers exist.

2.  **`createTrainer(CreateTrainerRequest request): TrainerDto`**
    -   **Logic:**
        1.  Generate a URL-friendly `slug` from `request.getName()`. The slug should be lowercase and replace spaces with hyphens. For example, "John Doe" becomes "john-doe".
        2.  Check if a `Trainer` with the generated `slug` already exists using `trainerRepository.findBySlug()`. If it exists, append a unique suffix (e.g., "-1", "-2") to the slug until it is unique.
        3.  Create a new `Trainer` entity. Populate its `name`, `specializations`, `bio`, `imageUrl` from the `CreateTrainerRequest`, and set the generated unique `slug`.
        4.  Save the new `Trainer` entity using `trainerRepository.save()`.
        5.  Map the saved `Trainer` entity to a `TrainerDto`.
        6.  Return the `TrainerDto`.
    -   **Error Cases:** None specific; validation of `CreateTrainerRequest` fields should ideally happen at the controller level.

3.  **`updateTrainer(UUID id, UpdateTrainerRequest request): TrainerDto`**
    -   **Logic:**
        1.  Find the `Trainer` entity by `id` using `trainerRepository.findById()`.
        2.  If the `Trainer` is not found, throw a `ResourceNotFoundException` (from the `shared-backend` feature) with a message indicating the trainer was not found.
        3.  Update the found `Trainer` entity's `name`, `specializations`, `bio`, and `imageUrl` fields with the values from the `UpdateTrainerRequest`. The `slug` should not be updated via this method.
        4.  Save the updated `Trainer` entity using `trainerRepository.save()`.
        5.  Map the updated `Trainer` entity to a `TrainerDto`.
        6.  Return the `TrainerDto`.
    -   **Error Cases:**
        -   `ResourceNotFoundException`: If no trainer with the given `id` is found.

4.  **`deleteTrainer(UUID id): void`**
    -   **Logic:**
        1.  Check if a `Trainer` with the given `id` exists using `trainerRepository.existsById()`.
        2.  If the `Trainer` does not exist, throw a `ResourceNotFoundException` (from the `shared-backend` feature) with a message indicating the trainer was not found.
        3.  Delete the `Trainer` entity by `id` using `trainerRepository.deleteById()`.
    -   **Error Cases:**
        -   `ResourceNotFoundException`: If no trainer with the given `id` is found.

---

## Trainer Management (Backend API)

**Name:** `trainer-management-api`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/multifitaundh/controller/TrainerController.java` — CONTROLLER layer - Exposes public, read-only endpoints for trainers. GET /api/v1/trainers and GET /api/v1/trainers/{slug} are consumed by the frontend to display trainer profiles.
- `backend/src/main/java/com/multifitaundh/controller/AdminTrainerController.java` — CONTROLLER layer - Provides secure, ADMIN-only endpoints for full CRUD management of trainers, consumed by the admin portal frontend. Path is /api/v1/admin/trainers.
- `backend/src/main/java/com/multifitaundh/dto/TrainerDto.java` — DTO layer - A record representing the public view of a Trainer, used as the response body for all trainer-related API endpoints.
- `backend/src/main/java/com/multifitaundh/dto/CreateTrainerRequest.java` — DTO layer - A record for the POST /api/v1/admin/trainers request body, with validation annotations to ensure all required fields are present.
- `backend/src/main/java/com/multifitaundh/dto/UpdateTrainerRequest.java` — DTO layer - A record for the PUT /api/v1/admin/trainers/{id} request body, with validation annotations.

**Feature Instruction:**

The `trainer-management-api` feature provides RESTful endpoints for managing trainer profiles, with separate public-facing read-only access and admin-only CRUD operations. It consists of DTOs for data transfer and two controller classes.

### DTOs

**TrainerDto.java**

This is a record representing the public view of a Trainer. It is used as the response body for all trainer-related API endpoints.

*   **Fields:**
    *   `UUID id`
    *   `String name`
    *   `String specializations`
    *   `String bio`
    *   `String imageUrl`
    *   `String slug`

**CreateTrainerRequest.java**

This is a record for the request body when creating a new trainer. It includes validation annotations.

*   **Fields:**
    *   `@NotBlank String name`
    *   `@NotBlank String specializations`
    *   `@NotBlank String bio`
    *   `@NotBlank @URL String imageUrl`

**UpdateTrainerRequest.java**

This is a record for the request body when updating an existing trainer. It includes validation annotations.

*   **Fields:**
    *   `@NotBlank String name`
    *   `@NotBlank String specializations`
    *   `@NotBlank String bio`
    *   `@NotBlank @URL String imageUrl`

### Controllers

**TrainerController.java**

This controller exposes public, read-only endpoints for trainers. It injects `TrainerService`.

*   **Dependencies:**
    *   `TrainerService trainerService`

*   **Endpoints:**

    1.  **GET /api/v1/trainers**
        *   **Method:** `getAllTrainers()`
        *   **Signature:** `ResponseEntity<List<TrainerDto>> getAllTrainers()`
        *   **Logic:**
            1.  Call `trainerService.getAllTrainers()`.
            2.  Return the `List<TrainerDto>` with HTTP status 200 OK.
        *   **Error Cases:** None specific; service layer handles exceptions.

    2.  **GET /api/v1/trainers/{slug}**
        *   **Method:** `getTrainerBySlug(String slug)`
        *   **Signature:** `ResponseEntity<TrainerDto> getTrainerBySlug(@PathVariable String slug)`
        *   **Logic:**
            1.  Call `trainerService.getTrainerBySlug(slug)`.
            2.  Return the `TrainerDto` with HTTP status 200 OK.
        *   **Error Cases:**
            *   If `trainerService.getTrainerBySlug()` throws `ResourceNotFoundException`, return HTTP status 404 NOT FOUND.

**AdminTrainerController.java**

This controller provides secure, ADMIN-only endpoints for full CRUD management of trainers. It injects `TrainerService`.

*   **Dependencies:**
    *   `TrainerService trainerService`

*   **Endpoints:**

    1.  **POST /api/v1/admin/trainers**
        *   **Method:** `createTrainer(CreateTrainerRequest request)`
        *   **Signature:** `ResponseEntity<TrainerDto> createTrainer(@Valid @RequestBody CreateTrainerRequest request)`
        *   **Logic:**
            1.  Call `trainerService.createTrainer(request)`.
            2.  Return the created `TrainerDto` with HTTP status 201 CREATED.
        *   **Error Cases:**
            *   If validation fails, Spring's `@Valid` will handle it, returning HTTP status 400 BAD REQUEST.

    2.  **PUT /api/v1/admin/trainers/{id}**
        *   **Method:** `updateTrainer(UUID id, UpdateTrainerRequest request)`
        *   **Signature:** `ResponseEntity<TrainerDto> updateTrainer(@PathVariable UUID id, @Valid @RequestBody UpdateTrainerRequest request)`
        *   **Logic:**
            1.  Call `trainerService.updateTrainer(id, request)`.
            2.  Return the updated `TrainerDto` with HTTP status 200 OK.
        *   **Error Cases:**
            *   If validation fails, Spring's `@Valid` will handle it, returning HTTP status 400 BAD REQUEST.
            *   If `trainerService.updateTrainer()` throws `ResourceNotFoundException`, return HTTP status 404 NOT FOUND.

    3.  **DELETE /api/v1/admin/trainers/{id}**
        *   **Method:** `deleteTrainer(UUID id)`
        *   **Signature:** `ResponseEntity<Void> deleteTrainer(@PathVariable UUID id)`
        *   **Logic:**
            1.  Call `trainerService.deleteTrainer(id)`.
            2.  Return HTTP status 204 NO CONTENT.
        *   **Error Cases:**
            *   If `trainerService.deleteTrainer()` throws `ResourceNotFoundException`, return HTTP status 404 NOT FOUND.

---

## Testimonial Management (Backend Core)

**Name:** `testimonial-management`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/multifitaundh/model/Testimonial.java` — MODEL layer - Defines the Testimonial entity for storing customer reviews, including author, quote, and rating.
- `backend/src/main/java/com/multifitaundh/repository/TestimonialRepository.java` — REPOSITORY layer - Provides data access for Testimonial entities, including a findAllByOrderByCreatedAtDesc() method to fetch the latest testimonials first.
- `backend/src/main/java/com/multifitaundh/service/TestimonialService.java` — SERVICE layer - Implements business logic for testimonial CRUD operations, serving both public and admin controllers.

**Feature Instruction:**

This feature, Testimonial Management (Backend Core), provides the foundational data model, repository, and service logic for handling customer testimonials. It enables the creation, retrieval, and deletion of testimonials, ensuring data integrity and proper ordering.

### Testimonial.java
This file defines the `Testimonial` entity, representing a customer review or feedback. It is a JPA entity mapped to a database table.

**Fields:**
*   `id`: `UUID` - The primary key for the testimonial. Generated automatically.
*   `authorName`: `String` - The name of the person providing the testimonial. Must not be null or empty.
*   `quote`: `String` - The actual text of the testimonial. Stored as a large text field. Must not be null or empty.
*   `rating`: `int` - The star rating given, an integer value from 1 to 5.
*   `createdAt`: `LocalDateTime` - Timestamp when the testimonial was created. Automatically set on creation.

**Annotations:**
*   Use `@Entity` to mark it as a JPA entity.
*   Use `@Table(name = "testimonials")` to specify the table name.
*   Use `@Id` and `@GeneratedValue` for the `id` field.
*   Use `@Column(nullable = false)` for `authorName` and `quote`.
*   Use `@Column(columnDefinition = "TEXT")` for the `quote` field.
*   Use `@CreationTimestamp` for the `createdAt` field.
*   Include standard JPA constructors (no-arg and all-arg) and getter/setter methods for all fields.

### TestimonialRepository.java
This file defines the `TestimonialRepository` interface, which extends Spring Data JPA's `JpaRepository` to provide standard CRUD operations for `Testimonial` entities.

**Interface Definition:**
*   `TestimonialRepository` extends `org.springframework.data.jpa.repository.JpaRepository<Testimonial, UUID>`.

**Custom Methods:**
*   `findAllByOrderByCreatedAtDesc(): List<Testimonial>`
    *   **Description:** Retrieves all `Testimonial` entities from the database, ordered by their `createdAt` timestamp in descending order (latest first).

**Dependencies:**
*   Imports `com.multifitaundh.model.Testimonial`.

### TestimonialService.java
This file implements the business logic for managing `Testimonial` entities. It interacts with `TestimonialRepository` for data persistence and maps entities to DTOs for API consumption.

**Dependencies:**
*   Injects `TestimonialRepository`.
*   Assumes the existence of `com.multifitaundh.dto.TestimonialDto` and `com.multifitaundh.dto.CreateTestimonialRequest`.

**DTO Structures (for context, these files are not part of this feature but are consumed by it):
*   `TestimonialDto`:
    *   `id`: `UUID`
    *   `authorName`: `String`
    *   `quote`: `String`
    *   `rating`: `int`
    *   `createdAt`: `LocalDateTime`
*   `CreateTestimonialRequest`:
    *   `authorName`: `String`
    *   `quote`: `String`
    *   `rating`: `int`

**Public Methods:**

1.  `getAllTestimonials(): List<TestimonialDto>`
    *   **Logic:**
        1.  Calls `testimonialRepository.findAllByOrderByCreatedAtDesc()` to retrieve all testimonials.
        2.  Maps each `Testimonial` entity to a `TestimonialDto`.
        3.  Returns the list of `TestimonialDto` objects.
    *   **Error Cases:** None specific to this method; any database access issues would propagate as Spring Data JPA exceptions.

2.  `createTestimonial(CreateTestimonialRequest request): TestimonialDto`
    *   **Logic:**
        1.  Validates that `request.getAuthorName()` and `request.getQuote()` are not null or empty.
        2.  Validates that `request.getRating()` is between 1 and 5 (inclusive).
        3.  Creates a new `Testimonial` entity.
        4.  Sets `authorName`, `quote`, and `rating` from the `request`.
        5.  Calls `testimonialRepository.save(testimonial)` to persist the new testimonial.
        6.  Maps the saved `Testimonial` entity to a `TestimonialDto`.
        7.  Returns the created `TestimonialDto`.
    *   **Error Cases:**
        *   Throws `IllegalArgumentException` if `authorName`, `quote` are null/empty, or `rating` is out of the 1-5 range.

3.  `deleteTestimonial(UUID id): void`
    *   **Logic:**
        1.  Checks if a `Testimonial` with the given `id` exists using `testimonialRepository.existsById(id)`.
        2.  If the testimonial does not exist, throws `ResourceNotFoundException` (from the `shared-backend` feature).
        3.  If the testimonial exists, calls `testimonialRepository.deleteById(id)` to remove it from the database.
    *   **Error Cases:**
        *   Throws `com.multifitaundh.exception.ResourceNotFoundException` if no testimonial with the given `id` is found.

---

## Testimonial Management (Backend API)

**Name:** `testimonial-management-api`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/multifitaundh/controller/TestimonialController.java` — CONTROLLER layer - Exposes the public GET /api/v1/testimonials endpoint, consumed by the frontend to display social proof.
- `backend/src/main/java/com/multifitaundh/controller/AdminTestimonialController.java` — CONTROLLER layer - Provides secure, ADMIN-only endpoints for managing testimonials (GET all, POST, DELETE), consumed by the admin portal. Path is /api/v1/admin/testimonials.
- `backend/src/main/java/com/multifitaundh/dto/TestimonialDto.java` — DTO layer - A record representing the public view of a Testimonial, used as the response body for testimonial API endpoints.
- `backend/src/main/java/com/multifitaundh/dto/CreateTestimonialRequest.java` — DTO layer - A record for the POST /api/v1/admin/testimonials request body, with validation annotations.

**Feature Instruction:**

This feature, `testimonial-management-api`, provides RESTful API endpoints for managing customer testimonials. It includes public endpoints for retrieving testimonials and admin-only endpoints for creating, retrieving, and deleting testimonials.

## DTOs

### `TestimonialDto.java`
This is a Java record that serves as a Data Transfer Object for exposing testimonial data. It represents the public view of a testimonial.
- **Fields:**
    - `UUID id`: The unique identifier of the testimonial.
    - `String authorName`: The name of the author who provided the testimonial.
    - `String quote`: The text content of the testimonial.
    - `int rating`: The star rating associated with the testimonial (e.g., 1 to 5).

### `CreateTestimonialRequest.java`
This is a Java record used as the request body for creating new testimonials via the admin API. It includes validation annotations.
- **Fields:**
    - `String authorName`: The name of the author. Must be annotated with `@NotBlank`.
    - `String quote`: The testimonial text. Must be annotated with `@NotBlank`.
    - `int rating`: The star rating. Must be annotated with `@Min(1)` and `@Max(5)`.

## Controllers

### `TestimonialController.java`
This controller exposes public-facing API endpoints for retrieving testimonials. It is designed for consumption by the frontend to display social proof.
- **Dependencies:**
    - Injects `com.multifitaundh.service.TestimonialService` (from `testimonial-management` feature).
- **Endpoints:**
    - `GET /api/v1/testimonials`
        - **Method:** `public ResponseEntity<List<TestimonialDto>> getAllTestimonials()`
        - **Logic:**
            1. Call `testimonialService.getAllTestimonials()` to retrieve a list of all testimonials.
            2. Return the list of `TestimonialDto` objects with an HTTP status of `200 OK`.

### `AdminTestimonialController.java`
This controller provides secure, ADMIN-only API endpoints for managing testimonials (create, retrieve all, delete). These endpoints are consumed by the admin portal.
- **Dependencies:**
    - Injects `com.multifitaundh.service.TestimonialService` (from `testimonial-management` feature).
- **Security:**
    - All methods in this controller must be secured with `@PreAuthorize("hasRole('ADMIN')")` to ensure only authenticated administrators can access them.
- **Endpoints:**
    - `GET /api/v1/admin/testimonials`
        - **Method:** `public ResponseEntity<List<TestimonialDto>> getAllAdminTestimonials()`
        - **Logic:**
            1. Call `testimonialService.getAllTestimonials()` to retrieve a list of all testimonials.
            2. Return the list of `TestimonialDto` objects with an HTTP status of `200 OK`.
    - `POST /api/v1/admin/testimonials`
        - **Method:** `public ResponseEntity<TestimonialDto> createTestimonial(@Valid @RequestBody CreateTestimonialRequest request)`
        - **Logic:**
            1. Validate the `request` object using Spring's `@Valid` annotation.
            2. Call `testimonialService.createTestimonial(request)` to create a new testimonial.
            3. Return the created `TestimonialDto` with an HTTP status of `201 Created`.
    - `DELETE /api/v1/admin/testimonials/{id}`
        - **Method:** `public ResponseEntity<Void> deleteTestimonial(@PathVariable UUID id)`
        - **Logic:**
            1. Call `testimonialService.deleteTestimonial(id)` to remove the testimonial.
            2. Return an empty response with an HTTP status of `204 No Content`.
        - **Error Cases:**
            - If `testimonialService.deleteTestimonial(id)` throws `com.multifitaundh.exception.ResourceNotFoundException` (from `shared-backend` feature), catch this exception and return an HTTP status of `404 Not Found`.

---

## Lead Capture (Backend Core)

**Name:** `lead-capture`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/multifitaundh/model/TrialLead.java` — MODEL layer - Defines the TrialLead entity for storing leads from the free trial form, capturing name, email, and phone number.
- `backend/src/main/java/com/multifitaundh/repository/TrialLeadRepository.java` — REPOSITORY layer - Provides data access for TrialLead entities, including a method to fetch all leads sorted by most recent.
- `backend/src/main/java/com/multifitaundh/service/TrialLeadService.java` — SERVICE layer - Implements logic for creating and retrieving trial leads. The createTrialLead(CreateTrialLeadRequest) method persists the lead and calls NotificationService to alert staff.
- `backend/src/main/java/com/multifitaundh/service/NotificationService.java` — SERVICE layer - An abstraction for sending notifications. Its sendNewLeadNotification(TrialLeadDto) method uses JavaMailSender to email gym staff about new sign-ups.

**Feature Instruction:**

The `lead-capture` feature provides backend functionality for capturing and managing trial leads from the '3-Day Free Trial' form. It includes an entity for persistence, a repository for data access, and a service layer for business logic, including notifications.

### `TrialLead.java`
This file defines the `TrialLead` entity, representing a lead captured from the free trial form. It is a JPA entity mapped to a database table.
-   **Package:** `com.multifitaundh.model`
-   **Class:** `TrialLead`
-   **Annotations:** `@Entity`, `@Table(name = "trial_leads")`
-   **Fields:**
    -   `id`: `UUID`. Primary key. Annotated with `@Id` and `@GeneratedValue(strategy = GenerationType.AUTO)`.
    -   `name`: `String`. Lead's full name. Annotated with `@Column(nullable = false)`.
    -   `email`: `String`. Lead's email address. Annotated with `@Column(nullable = false)`.
    -   `phone`: `String`. Lead's phone number. Annotated with `@Column(nullable = false)`.
    -   `createdAt`: `Instant`. Timestamp of when the lead was submitted. Annotated with `@Column(nullable = false)` and `@CreationTimestamp`.

### `TrialLeadRepository.java`
This file defines the Spring Data JPA repository for `TrialLead` entities, providing standard CRUD operations and custom query methods.
-   **Package:** `com.multifitaundh.repository`
-   **Interface:** `TrialLeadRepository`
-   **Extends:** `org.springframework.data.jpa.repository.JpaRepository<TrialLead, UUID>`
-   **Public Methods:**
    -   `findAllByOrderByCreatedAtDesc()`: `List<TrialLead>`. Finds all `TrialLead` entities, ordered by `createdAt` in descending order.

### `TrialLeadService.java`
This file implements the business logic for managing trial leads, including creating new leads and retrieving existing ones. It interacts with `TrialLeadRepository` for data persistence and `NotificationService` for sending alerts.
-   **Package:** `com.multifitaundh.service`
-   **Class:** `TrialLeadService`
-   **Annotations:** `@Service`
-   **Dependencies:**
    -   `TrialLeadRepository trialLeadRepository`: Injected via constructor.
    -   `NotificationService notificationService`: Injected via constructor.
-   **Public Methods:**
    -   `createTrialLead(CreateTrialLeadRequest request)`: `TrialLeadDto`
        1.  **Input Validation:** Ensure `request.name`, `request.email`, and `request.phone` are not null or empty. If any are invalid, throw an `IllegalArgumentException` with a descriptive message.
        2.  **Entity Creation:** Create a new `TrialLead` instance.
        3.  **Field Mapping:** Set the `name`, `email`, and `phone` fields of the `TrialLead` entity from the `request`.
        4.  **Persistence:** Save the `TrialLead` entity using `trialLeadRepository.save(trialLead)`.
        5.  **DTO Conversion:** Convert the saved `TrialLead` entity to a `TrialLeadDto`.
        6.  **Notification:** Call `notificationService.sendNewLeadNotification(trialLeadDto)` to alert staff about the new lead.
        7.  **Return:** Return the `TrialLeadDto`.
    -   `getAllTrialLeads()`: `List<TrialLeadDto>`
        1.  **Data Retrieval:** Retrieve all `TrialLead` entities from the database using `trialLeadRepository.findAllByOrderByCreatedAtDesc()`.
        2.  **DTO Conversion:** Map each `TrialLead` entity in the retrieved list to a `TrialLeadDto`.
        3.  **Return:** Return the list of `TrialLeadDto`.

### `NotificationService.java`
This file provides functionality for sending email notifications, specifically for new trial leads. It uses Spring's `JavaMailSender` to send emails.
-   **Package:** `com.multifitaundh.service`
-   **Class:** `NotificationService`
-   **Annotations:** `@Service`
-   **Dependencies:**
    -   `org.springframework.mail.javamail.JavaMailSender javaMailSender`: Injected via constructor.
    -   `String adminEmail`: Injected via `@Value("${app.admin.email}")` from application properties.
-   **Public Methods:**
    -   `sendNewLeadNotification(TrialLeadDto lead)`: `void`
        1.  **Message Creation:** Create a `MimeMessage` using `javaMailSender.createMimeMessage()`.
        2.  **Helper Initialization:** Create a `MMimeMessageHelper` with the `MimeMessage`.
        3.  **Recipient:** Set the `to` address to `adminEmail`.
        4.  **Subject:** Set the email subject to "New 3-Day Free Trial Lead from MultiFit Aundh".
        5.  **Content:** Construct the email body as a plain text message, including the lead's `name`, `email`, `phone`, and `createdAt` from the `TrialLeadDto`.
        6.  **Sending:** Send the email using `javaMailSender.send(mimeMessage)`.

### Data Transfer Objects (DTOs)
These DTOs are used for transferring data between the controller and service layers.

#### `CreateTrialLeadRequest.java`
-   **Package:** `com.multifitaundh.dto`
-   **Class:** `CreateTrialLeadRequest`
-   **Fields:**
    -   `name`: `String`
    -   `email`: `String`
    -   `phone`: `String`

#### `TrialLeadDto.java`
-   **Package:** `com.multifitaundh.dto`
-   **Class:** `TrialLeadDto`
-   **Fields:**
    -   `id`: `UUID`
    -   `name`: `String`
    -   `email`: `String`
    -   `phone`: `String`
    -   `createdAt`: `Instant`

---

## Lead Capture (Backend API)

**Name:** `lead-capture-api`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/multifitaundh/controller/LeadController.java` — CONTROLLER layer - Exposes the public POST /api/v1/leads/trial endpoint, which is the submission target for the '3-Day Free Trial' form.
- `backend/src/main/java/com/multifitaundh/controller/AdminLeadController.java` — CONTROLLER layer - Provides the secure GET /api/v1/admin/leads/trial endpoint for the admin portal to display a list of all submitted leads.
- `backend/src/main/java/com/multifitaundh/dto/TrialLeadDto.java` — DTO layer - A record representing a TrialLead, used as the response body for lead-related API endpoints.
- `backend/src/main/java/com/multifitaundh/dto/CreateTrialLeadRequest.java` — DTO layer - A record for the POST /api/v1/leads/trial request body, with validation annotations for name, email, and phone.

**Feature Instruction:**

This feature, `lead-capture-api`, provides the backend API endpoints for managing trial leads for MultiFit Aundh. It includes public-facing endpoints for submitting new trial leads and admin-only endpoints for retrieving all captured leads. This feature relies on the `lead-capture` service layer for business logic and persistence.

## DTOs

### `CreateTrialLeadRequest.java`
This record serves as the request body for submitting a new trial lead. It includes validation annotations.
- **Fields:**
    - `String name`: The lead's full name. Must not be blank (`@NotBlank`).
    - `String email`: The lead's email address. Must not be blank (`@NotBlank`) and must be a valid email format (`@Email`).
    - `String phone`: The lead's phone number. Must not be blank (`@NotBlank`).

### `TrialLeadDto.java`
This record serves as the response body for trial lead related API endpoints, exposing the captured lead's details.
- **Fields:**
    - `UUID id`: The unique identifier for the trial lead.
    - `String name`: The lead's full name.
    - `String email`: The lead's email address.
    - `String phone`: The lead's phone number.
    - `Instant createdAt`: The timestamp when the lead was submitted.

## Controllers

### `LeadController.java`
This public-facing REST controller handles the submission of new trial leads from the MultiFit Aundh website.
- **Dependencies:** Injects `TrialLeadService` from the `lead-capture` feature.
- **Endpoints:**
    - `POST /api/v1/leads/trial`
        - **Description:** Accepts a new trial lead submission.
        - **Request Body:** `CreateTrialLeadRequest` (validated with `@Valid`).
        - **Response Body:** `TrialLeadDto`
        - **Method Signature:** `public ResponseEntity<TrialLeadDto> createTrialLead(@Valid @RequestBody CreateTrialLeadRequest request)`
        - **Logic:**
            1.  Call `trialLeadService.createTrialLead(request)` (from the `lead-capture` feature's `TrialLeadService`).
            2.  Return the resulting `TrialLeadDto` wrapped in a `ResponseEntity` with HTTP status `201 Created`.
        - **Error Cases:**
            - If `CreateTrialLeadRequest` fails validation, Spring will throw `MethodArgumentNotValidException`, which should result in an HTTP `400 Bad Request` response.

### `AdminLeadController.java`
This admin-only REST controller provides functionality to retrieve all captured trial leads for display in the admin panel.
- **Dependencies:** Injects `TrialLeadService` from the `lead-capture` feature.
- **Endpoints:**
    - `GET /api/v1/admin/leads/trial`
        - **Description:** Retrieves all captured trial leads.
        - **Request Body:** None.
        - **Response Body:** `List<TrialLeadDto>`
        - **Method Signature:** `public ResponseEntity<List<TrialLeadDto>> getAllTrialLeads()`
        - **Logic:**
            1.  Call `trialLeadService.getAllTrialLeads()` (from the `lead-capture` feature's `TrialLeadService`).
            2.  Return the resulting `List<TrialLeadDto>` wrapped in a `ResponseEntity` with HTTP status `200 OK`.
        - **Error Cases:** None specific to this operation; standard Spring exceptions may apply.

---

## SaaS Integration (Backend)

**Name:** `saas-integration`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/multifitaundh/service/SaaSIntegrationService.java` — SERVICE layer - Acts as a client for the external Gym Management SaaS. Methods like getMembershipPlans() use RestTemplate/WebClient to call the third-party API, hiding API keys and complexity from the rest of the application.
- `backend/src/main/java/com/multifitaundh/controller/GymController.java` — CONTROLLER layer - A Backend-for-Frontend (BFF) controller that exposes simplified, public endpoints like GET /api/v1/gym/memberships by proxying requests to the SaaSIntegrationService.
- `backend/src/main/java/com/multifitaundh/dto/MembershipPlanDto.java` — DTO layer - A record that defines the data structure for a membership plan as consumed from the SaaS and exposed to the frontend.
- `backend/src/main/java/com/multifitaundh/dto/ClassScheduleDto.java` — DTO layer - A record that defines the data structure for a scheduled class as consumed from the SaaS and exposed to the frontend.

**Feature Instruction:**

This feature, `saas-integration`, provides backend services and API endpoints to integrate with an external Gym Management SaaS API, exposing membership plans and class schedules to the frontend. It consists of DTOs for data representation, a service layer for external API communication, and a controller layer for public REST endpoints.

### `MembershipPlanDto.java`
This DTO represents a membership plan as received from the external SaaS API and exposed to the frontend. It is a record class.

**Public Variables:**
- `String id`: SaaS-provided plan ID.
- `String name`: Name of the plan (e.g., '1 Month Unlimited').
- `String price`: Price of the plan.
- `String description`: Description of the plan.
- `String purchaseUrl`: Direct URL to purchase this plan on the SaaS platform.

### `ClassScheduleDto.java`
This DTO represents a class in the schedule as received from the external SaaS API and exposed to the frontend. It is a record class.

**Public Variables:**
- `String id`: SaaS-provided class ID.
- `String className`: Name of the class (e.g., 'Zumba').
- `String startTime`: Start time of the class (ISO 8601 format).
- `int durationMinutes`: Duration of the class in minutes.
- `String trainerName`: Name of the trainer for the class.
- `String bookingUrl`: Direct URL to book this class on the SaaS platform.

### `SaaSIntegrationService.java`
This service acts as a client for the external Gym Management SaaS API, handling the communication logic, API keys, and data transformation. It should be annotated with `@Service`.

**Dependencies:**
- This service will internally use a `RestTemplate` or `WebClient` to make HTTP calls to the external SaaS API. Configuration for the SaaS API base URL and API keys should be managed via Spring's `@Value` annotation or a dedicated configuration class.

**Public Methods:**

1.  `List<MembershipPlanDto> getMembershipPlans()`
    *   **Description:** Fetches membership plans from the external Gym Management SaaS API.
    *   **Logic:**
        1.  Construct the full URL for the SaaS API's membership plans endpoint using the configured base URL and API key.
        2.  Execute an HTTP GET request to this URL using `RestTemplate` or `WebClient`.
        3.  Parse the JSON response from the SaaS API into a `List<MembershipPlanDto>`. Assume the external API returns a structure directly mappable to `MembershipPlanDto` or requires minimal transformation.
        4.  Return the list of `MembershipPlanDto` objects.
    *   **Error Cases:**
        *   If the external API call fails (e.g., network error, non-2xx status code), throw an `IllegalStateException` with a descriptive message.
        *   If JSON parsing fails, catch `tools.jackson.core.JacksonException` and throw an `IllegalStateException`.

2.  `List<ClassScheduleDto> getClassSchedule()`
    *   **Description:** Fetches the class schedule from the external Gym Management SaaS API.
    *   **Logic:**
        1.  Construct the full URL for the SaaS API's class schedule endpoint using the configured base URL and API key.
        2.  Execute an HTTP GET request to this URL using `RestTemplate` or `WebClient`.
        3.  Parse the JSON response from the SaaS API into a `List<ClassScheduleDto>`. Assume the external API returns a structure directly mappable to `ClassScheduleDto` or requires minimal transformation.
        4.  Return the list of `ClassScheduleDto` objects.
    *   **Error Cases:**
        *   If the external API call fails (e.g., network error, non-2xx status code), throw an `IllegalStateException` with a descriptive message.
        *   If JSON parsing fails, catch `tools.jackson.core.JacksonException` and throw an `IllegalStateException`.

### `GymController.java`
This public-facing REST controller exposes simplified endpoints for the frontend to consume data from the Gym Management SaaS. It should be annotated with `@RestController` and `@RequestMapping("/api/v1/gym")`.

**Dependencies:**
- `GymController` injects `SaaSIntegrationService`.

**API Endpoints:**

1.  `GET /api/v1/gym/memberships`
    *   **Description:** Returns available membership plans from MultiFit Aundh, fetched from the SaaS API.
    *   **Signature:** `public ResponseEntity<List<MembershipPlanDto>> getMembershipPlans()`
    *   **Logic:**
        1.  Call `saaSIntegrationService.getMembershipPlans()`.
        2.  Return the `List<MembershipPlanDto>` wrapped in a `ResponseEntity` with HTTP status 200 OK.
    *   **Error Cases:**
        *   If `saaSIntegrationService.getMembershipPlans()` throws an `IllegalStateException`, catch it and return a `ResponseEntity` with HTTP status 500 Internal Server Error and the exception message.

2.  `GET /api/v1/gym/schedule`
    *   **Description:** Returns the current class schedule for MultiFit Aundh, fetched from the SaaS API.
    *   **Signature:** `public ResponseEntity<List<ClassScheduleDto>> getClassSchedule()`
    *   **Logic:**
        1.  Call `saaSIntegrationService.getClassSchedule()`.
        2.  Return the `List<ClassScheduleDto>` wrapped in a `ResponseEntity` with HTTP status 200 OK.
    *   **Error Cases:**
        *   If `saaSIntegrationService.getClassSchedule()` throws an `IllegalStateException`, catch it and return a `ResponseEntity` with HTTP status 500 Internal Server Error and the exception message.

---

## Shared Backend Utilities

**Name:** `shared-backend`  
**Type:** SHARED  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/multifitaundh/controller/SpaController.java` — CONTROLLER layer - A special @Controller that forwards all non-API, non-file requests to the frontend's index.html, enabling client-side routing to work correctly on page refresh.
- `backend/src/main/java/com/multifitaundh/exception/GlobalExceptionHandler.java` — EXCEPTION layer - A @RestControllerAdvice that catches exceptions across all controllers and formats them into a standardized ErrorResponse DTO.
- `backend/src/main/java/com/multifitaundh/dto/ErrorResponse.java` — DTO layer - A record representing the standard JSON structure for all API error responses.
- `backend/src/main/java/com/multifitaundh/exception/ResourceNotFoundException.java` — EXCEPTION layer - A custom RuntimeException thrown by services when an entity lookup by ID or slug fails, which is then handled by GlobalExceptionHandler to return a 404 Not Found response.

**Feature Instruction:**

This `shared-backend` feature provides core utilities for the backend application, including a SPA fallback controller, a global exception handler, a standardized error response DTO, and a custom exception for resource not found scenarios.

### SpaController.java
This file defines a Spring `@Controller` responsible for forwarding non-API and non-static asset requests to the frontend's `index.html` file. This is crucial for enabling client-side routing in the Next.js Single Page Application (SPA) when a user directly accesses a SPA route or refreshes the page.

**Class:** `SpaController`
- **Annotation:** `@Controller`
- **Method:** `fallback()`
  - **Signature:** `public String fallback()`
  - **Description:** Handles all GET requests that do not match other API endpoints or static resources.
  - **Logic:**
    1. Returns the string `"forward:/index.html"`. This instructs Spring to internally forward the request to the `index.html` file, allowing the frontend application to handle the routing.

### GlobalExceptionHandler.java
This file defines a Spring `@RestControllerAdvice` that provides centralized exception handling across all `@Controller` components in the application. It ensures consistent error responses in a standardized `ErrorResponse` format.

**Class:** `GlobalExceptionHandler`
- **Annotation:** `@RestControllerAdvice`
- **Dependencies:** Injects `ErrorResponse` for constructing error payloads.
- **Method:** `handleResourceNotFoundException(ResourceNotFoundException ex, WebRequest request)`
  - **Signature:** `public ResponseEntity<ErrorResponse> handleResourceNotFoundException(ResourceNotFoundException ex, WebRequest request)`
  - **Description:** Catches `ResourceNotFoundException` instances thrown by services.
  - **Logic:**
    1. Creates a `LocalDateTime` for the current timestamp.
    2. Extracts the request URI from the `WebRequest` (casting to `ServletWebRequest` to access the underlying `HttpServletRequest`).
    3. Constructs an `ErrorResponse` object with:
       - `timestamp`: The current `LocalDateTime`.
       - `status`: `HttpStatus.NOT_FOUND.value()` (404).
       - `error`: The message from the `ResourceNotFoundException` (`ex.getMessage()`).
       - `path`: The extracted request URI.
    4. Returns a `ResponseEntity` containing the `ErrorResponse` object and `HttpStatus.NOT_FOUND`.
- **Method:** `handleGlobalException(Exception ex, WebRequest request)`
  - **Signature:** `public ResponseEntity<ErrorResponse> handleGlobalException(Exception ex, WebRequest request)`
  - **Description:** Catches all other unhandled `Exception` instances.
  - **Logic:**
    1. Creates a `LocalDateTime` for the current timestamp.
    2. Extracts the request URI from the `WebRequest` (casting to `ServletWebRequest` to access the underlying `HttpServletRequest`).
    3. Constructs an `ErrorResponse` object with:
       - `timestamp`: The current `LocalDateTime`.
       - `status`: `HttpStatus.INTERNAL_SERVER_ERROR.value()` (500).
       - `error`: The message from the `Exception` (`ex.getMessage()`).
       - `path`: The extracted request URI.
    4. Returns a `ResponseEntity` containing the `ErrorResponse` object and `HttpStatus.INTERNAL_SERVER_ERROR`.

### ErrorResponse.java
This file defines a Java `record` that serves as a standardized Data Transfer Object (DTO) for returning error details from API endpoints. It provides a consistent structure for all error responses.

**Record:** `ErrorResponse`
- **Fields:**
  - `timestamp`: `LocalDateTime` - The time when the error occurred.
  - `status`: `int` - The HTTP status code of the error (e.g., 404, 500).
  - `error`: `String` - A descriptive error message.
  - `path`: `String` - The request path where the error occurred.

### ResourceNotFoundException.java
This file defines a custom `RuntimeException` that should be thrown by service layers when a requested resource (e.g., an entity by ID or slug) cannot be found. This exception is specifically handled by `GlobalExceptionHandler` to return a `404 Not Found` HTTP status.

**Class:** `ResourceNotFoundException`
- **Extends:** `RuntimeException`
- **Constructor:** `ResourceNotFoundException(String message)`
  - **Signature:** `public ResourceNotFoundException(String message)`
  - **Logic:** Calls the superclass constructor with the provided message: `super(message)`.

---

## Core Frontend Setup

**Name:** `core-frontend`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/api/client.ts` — SERVICE layer - A singleton Axios instance configured with the VITE_API_URL. It includes a request interceptor that reads 'token' from localStorage and adds the 'Authorization: Bearer' header to all outgoing API calls.
- `frontend/src/pages/_app.tsx` — PAGE layer - The root Next.js component. It wraps the entire application in necessary providers: QueryClientProvider for data fetching and AuthProvider for authentication state management.
- `frontend/src/pages/_document.tsx` — PAGE layer - The Next.js custom document, used to set the `lang` attribute on the <html> tag and include any global font links or third-party scripts in the <head>.

**Feature Instruction:**

## Design Tokens
- Navbar: bg-[#1A1A1A] text-[#F5F5F5]
- Primary CTA: bg-[#DFFF00] hover:bg-[#DFFF00] text-[#1A1A1A] font-bold rounded-full px-8 py-3 transition-all duration-200
- Brand text accent: text-[#DFFF00]
- Section bg: bg-[#1A1A1A] text-[#F5F5F5] (default) / bg-[#333333] text-[#F5F5F5] (alternate)
- Card: bg-[#333333] rounded-xl shadow-lg border border-[#1A1A1A] p-6 text-[#F5F5F5]
- Section container: <section className="py-16 px-4"><div className="max-w-7xl mx-auto">
- Hero h1: text-4xl md:text-6xl font-extrabold text-[#F5F5F5]
- Body: text-[#F5F5F5] leading-relaxed

## client.ts
This file exports a pre-configured Axios instance, `apiClient`, for making API requests. It ensures that all outgoing requests automatically include the JWT for authentication.

### Public Variables
- `apiClient`: `AxiosInstance`
  1.  Initialize an Axios instance with `baseURL` set to `process.env.NEXT_PUBLIC_API_URL`.
  2.  Add a request interceptor to this `apiClient`.
  3.  Inside the interceptor, retrieve the JWT token from `localStorage` using the key `'token'`.
  4.  If a token exists, set the `Authorization` header of the request to `Bearer <token>`.
  5.  Return the modified request configuration.

## _app.tsx
This is the custom Next.js `App` component, responsible for initializing pages and wrapping the entire application with global providers like `QueryClientProvider` for data fetching and `AuthProvider` for authentication state management.

### Public Functions
- `MyApp({ Component, pageProps }): JSX.Element`
  1.  Import `QueryClientProvider` and `QueryClient` from `@tanstack/react-query`.
  2.  Import `AuthProvider` from `frontend/src/context/AuthContext.tsx` (from the `auth-ui` feature).
  3.  Create a new `QueryClient` instance.
  4.  Return a `JSX.Element` that wraps the `Component` with `QueryClientProvider` and `AuthProvider`.
  5.  Pass `pageProps` to the `Component`.

## _document.tsx
This is the custom Next.js `Document` component, used to augment the application's `<html>` and `<body>` tags. It's ideal for setting global attributes and including external resources like fonts.

### Public Functions
- `Document(): JSX.Element`
  1.  Extend `NextDocument`.
  2.  In the `render` method, return the basic `Html`, `Head`, `Main`, and `NextScript` components.
  3.  Set the `lang` attribute of the `Html` component to `"en"`.
  4.  Inside the `Head` component, include a `<link>` tag to import the 'Montserrat' font from Google Fonts, ensuring it supports `wght@400;700;800;900` for various weights to match the energetic design.

---

## Authentication UI (Frontend)

**Name:** `auth-ui`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/context/AuthContext.tsx` — CONTEXT layer - Manages global authentication state. It stores the JWT in localStorage under the key 'token' and provides login(email, password), logout(), and state variables like isAuthenticated and isAdmin to the entire component tree.
- `frontend/src/hooks/useAuth.ts` — HOOK layer - A simple convenience hook that calls `useContext(AuthContext)` to provide easy access to the authentication state and functions within components.
- `frontend/src/services/authService.ts` — SERVICE layer - Contains the login(credentials) async function that makes the POST request to /api/v1/auth/login using the shared apiClient.
- `frontend/src/types/auth.ts` — UTIL layer - Exports TypeScript interfaces like LoginCredentials and AuthResponse, ensuring type safety between the auth service, context, and login page.
- `frontend/src/pages/login.tsx` — PAGE layer - A public page containing a form built with react-hook-form and zod for validation. On submit, it calls the login() function from the useAuth hook and redirects to /admin on success.
- `frontend/src/components/ProtectedRoute.tsx` — COMPONENT layer - A wrapper component that checks the isAuthenticated status from useAuth(). If false, it uses the Next.js router to redirect to '/login'. If true, it renders its children.

**Feature Instruction:**

## Design Tokens
- Page Background: bg-[#1A1A1A]
- Form Container: bg-[#333333] rounded-lg shadow-xl p-8
- Text Color: text-[#F5F5F5]
- Input Fields: bg-gray-700 text-white border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent
- Primary CTA: bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-bold rounded-md py-3 transition-all duration-200
- Heading: text-3xl font-bold text-[#F5F5F5]
- Subheading/Paragraph: text-[#F5F5F5] text-opacity-80

## Feature Instruction: Authentication UI (Frontend)
This feature provides the frontend components and logic for user authentication, specifically for admin users of MultiFit Aundh. It includes a React context for managing authentication state, a custom hook for easy access to this context, a service for API calls, TypeScript types, a login page, and a protected route component.

### `frontend/src/types/auth.ts`
This file defines the TypeScript interfaces used across the authentication feature to ensure type safety.

**Interfaces:**
- `interface LoginCredentials`:
  - `email: string`
  - `password: string`
- `interface AuthResponse`:
  - `token: string`
  - `role: 'ADMIN' | 'USER'`

### `frontend/src/services/authService.ts`
This service handles the actual API call for user login.

**Imports:**
- `apiClient` from `frontend/src/api/client.ts`
- `LoginCredentials`, `AuthResponse` from `frontend/src/types/auth.ts`

**Public Functions:**
- `login(credentials: LoginCredentials): Promise<AuthResponse>`
  1. Makes a `POST` request to `/api/v1/auth/login` using `apiClient`.
  2. The request body is the `credentials` object.
  3. Returns the `AuthResponse` received from the API.
  4. Throws an error if the API call fails (e.g., invalid credentials).

### `frontend/src/context/AuthContext.tsx`
This file provides the React context for managing authentication state globally.

**Imports:**
- `React`, `createContext`, `useContext`, `useState`, `useEffect` from 'react'
- `useRouter` from 'next/router'
- `login` from `frontend/src/services/authService.ts`
- `AuthResponse`, `LoginCredentials` from `frontend/src/types/auth.ts`

**Context Type:**
- `AuthContextType` interface:
  - `isAuthenticated: boolean`
  - `isAdmin: boolean`
  - `token: string | null`
  - `login: (credentials: LoginCredentials) => Promise<void>`
  - `logout: () => void`

**Public Components:**
- `AuthProvider({ children: React.ReactNode }): JSX.Element`
  1. Initializes state variables: `token` (string | null, read from `localStorage` on mount), `isAuthenticated` (boolean), `isAdmin` (boolean).
  2. `useEffect` hook:
     a. On component mount, attempts to retrieve the JWT from `localStorage` using the key `'token'`. If a token exists, sets `token` state and derives `isAuthenticated` and `isAdmin` (e.g., by decoding the token or assuming admin if token exists for this feature's scope).
     b. Sets `isAuthenticated` to `true` if `token` is present, `false` otherwise.
     c. Sets `isAdmin` to `true` if `token` is present and the role within the token (if applicable, otherwise assume admin for this admin-focused feature) is 'ADMIN', `false` otherwise.
  3. `login(credentials: LoginCredentials): Promise<void>` function:
     a. Calls `authService.login(credentials)`.
     b. On successful response, stores the received `token` in `localStorage` using the key `'token'` (`localStorage.setItem('token', response.token)`).
     c. Updates `token`, `isAuthenticated`, and `isAdmin` state variables based on the `AuthResponse`.
     d. Throws an error if login fails.
  4. `logout(): void` function:
     a. Removes the JWT from `localStorage` using the key `'token'` (`localStorage.removeItem('token')`).
     b. Resets `token`, `isAuthenticated`, and `isAdmin` state variables to their initial (logged-out) values.
     c. Redirects the user to `/login` using `router.push('/login')`.
  5. Provides the `AuthContextType` value (containing `isAuthenticated`, `isAdmin`, `token`, `login`, `logout`) to its children.

### `frontend/src/hooks/useAuth.ts`
This custom hook simplifies accessing the authentication context.

**Imports:**
- `useContext` from 'react'
- `AuthContext`, `AuthContextType` from `frontend/src/context/AuthContext.tsx`

**Public Functions:**
- `useAuth(): AuthContextType`
  1. Calls `useContext(AuthContext)`.
  2. Throws an error if `useAuth` is called outside of an `AuthProvider`.
  3. Returns the current authentication context value.

### `frontend/src/pages/login.tsx`
This page provides the administrative login interface for MultiFit Aundh.

**Imports:**
- `React`, `useState` from 'react'
- `useForm` from 'react-hook-form'
- `zodResolver` from '@hookform/resolvers/zod'
- `z` from 'zod'
- `useRouter` from 'next/router'
- `useAuth` from `frontend/src/hooks/useAuth.ts`
- `LoginCredentials` from `frontend/src/types/auth.ts`

**Public Components:**
- `LoginPage(): JSX.Element`
  1. **Design:**
     - Page wrapper: `min-h-screen flex items-center justify-center` with `bg-[#1A1A1A]`.
     - Form container: Centered `div` with `w-full max-w-md` and `bg-[#333333] rounded-lg shadow-xl p-8`.
     - Heading: `h2` with `text-3xl font-bold text-[#F5F5F5] text-center mb-6` and content "Admin Login for MultiFit Aundh".
     - Subheading/Paragraph: `p` with `text-[#F5F5F5] text-opacity-80 text-center mb-8` and content "Access the MultiFit Aundh management portal."
     - Form fields (email, password): `div` with `mb-4`.
       - Label: `label` with `block text-[#F5F5F5] text-sm font-bold mb-2`.
       - Input: `input` with `w-full bg-gray-700 text-white border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent`.
       - Error message: `p` with `text-red-500 text-xs mt-1`.
     - Submit button: `button` with `w-full bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-bold rounded-md py-3 transition-all duration-200` and content "Login to Dashboard".
     - Loading/Error messages: `p` with `text-center mt-4` and appropriate styling (`text-blue-400` for loading, `text-red-500` for error).
  2. **Logic:**
     a. Uses `useAuth()` to get the `login` function and `isAuthenticated` state.
     b. Uses `useRouter()` for navigation.
     c. Defines a `loginSchema` using `zod` for email (string, required, email format) and password (string, required, min length).
     d. Initializes `react-hook-form` with `useForm<LoginCredentials>({ resolver: zodResolver(loginSchema) })`.
     e. If `isAuthenticated` is true, redirects to `/admin` using `router.replace('/admin')`.
     f. `onSubmit` handler for the form:
        i. Calls `auth.login(data.email, data.password)`.
        ii. On success, redirects to `/admin` using `router.push('/admin')`.
        iii. On error, sets an error state and displays a user-friendly message (e.g., "Invalid credentials. Please try again.").

### `frontend/src/components/ProtectedRoute.tsx`
This component acts as a guard for routes that require authentication.

**Imports:**
- `React`, `useEffect` from 'react'
- `useRouter` from 'next/router'
- `useAuth` from `frontend/src/hooks/useAuth.ts`

**Public Components:**
- `ProtectedRoute({ children: React.ReactNode }): JSX.Element | null`
  1. Uses `useAuth()` to get the `isAuthenticated` status.
  2. Uses `useRouter()` for navigation.
  3. `useEffect` hook:
     a. If `isAuthenticated` is `false`, redirects the user to `/login` using `router.replace('/login')`.
     b. This effect runs on component mount and when `isAuthenticated` changes.
  4. Returns `children` if `isAuthenticated` is `true`.
  5. Returns `null` (or a loading spinner) if `isAuthenticated` is `false` while the redirect is in progress, to prevent rendering protected content momentarily.

---

## Core Layout (Frontend)

**Name:** `core-layout`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/components/Layout.tsx` — COMPONENT layer - The primary wrapper for all public pages. It renders a Header, the page's {children}, and a Footer, providing a consistent structure.
- `frontend/src/components/Header.tsx` — COMPONENT layer - A responsive, sticky navigation bar. Displays the 'MultiFit Aundh' brand name, nav links (Memberships, Schedule, Trainers), and a prominent 'Get Free Trial' button styled with the accent color #DFFF00.
- `frontend/src/components/Footer.tsx` — COMPONENT layer - A multi-column footer with the gym's address and phone, opening hours, and an iframe embedding Google Maps pointed to the Aundh, Pune location. Styled with the dark theme colors.
- `frontend/src/pages/index.tsx` — PAGE layer - The main landing page. It includes a full-bleed hero with a high-energy video background, a section for class highlights, the prominent TestimonialsSection, and the TrialForm component.
- `frontend/src/components/LocalBusinessSchema.tsx` — COMPONENT layer - A utility component that renders a <script type="application/ld+json"> tag containing structured data about the gym (name, address, phone, etc.) to improve local SEO.
- `frontend/src/components/FloatingWhatsAppButton.tsx` — COMPONENT layer - Renders a circular button with the WhatsApp icon, fixed to the bottom-right of the screen, which links to the WhatsApp chat API for instant customer communication.

**Feature Instruction:**

## Design Tokens
- Navbar: bg-[#1A1A1A] text-[#F5F5F5]
- Primary CTA: bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200
- Secondary CTA: bg-[#333333] hover:bg-[#4a4a4a] text-[#F5F5F5] font-semibold rounded-full px-8 py-3 transition-all duration-200
- Brand text accent: text-[#DFFF00]
- Section bg: bg-[#F5F5F5] (odd sections) / bg-gray-50 (even sections)
- Dark section bg: bg-[#1A1A1A] text-[#F5F5F5]
- Card: bg-white rounded-xl shadow-md border border-gray-100 p-6
- Section container: <section className="py-16 px-4"><div className="max-w-7xl mx-auto">
- Hero h1: text-4xl md:text-6xl font-bold text-[#F5F5F5]
- Body: text-gray-700 leading-relaxed

## Feature Instruction: Core Layout (Frontend)
This feature provides the foundational layout and common components for the public-facing areas of the MultiFit Aundh website. It ensures a consistent look and feel, integrates essential SEO elements, and provides quick access to communication channels.

### Layout.tsx
**Role**: The primary wrapper for all public pages. It renders a `Header`, the page's `{children}`, and a `Footer`, providing a consistent structure.
**Public Function**: `Layout({ children: React.ReactNode }): JSX.Element`
**Logic**:
1.  Renders a `div` element that acts as the main container.
2.  Inside this `div`, it renders the `Header` component.
3.  Below the `Header`, it renders the `children` prop, which represents the content of the current page.
4.  Below the `children`, it renders the `Footer` component.
5.  Renders the `FloatingWhatsAppButton` component at the bottom of the layout.
6.  Renders the `LocalBusinessSchema` component to inject structured data for SEO.
**Inter-file Wiring**:
-   Imports `Header` from `frontend/src/components/Header.tsx`.
-   Imports `Footer` from `frontend/src/components/Footer.tsx`.
-   Imports `FloatingWhatsAppButton` from `frontend/src/components/FloatingWhatsAppButton.tsx`.
-   Imports `LocalBusinessSchema` from `frontend/src/components/LocalBusinessSchema.tsx`.

### Header.tsx
**Role**: A responsive, sticky navigation bar. Displays the 'MultiFit Aundh' brand name, nav links (Memberships, Schedule, Trainers), and a prominent 'Get Free Trial' button.
**Public Function**: `Header(): JSX.Element`
**Logic**:
1.  Renders a `header` element with a `sticky` position, `top-0`, `z-50`, `w-full`, and `py-4` padding.
2.  Applies `bg-[#1A1A1A]` and `text-[#F5F5F5]` for the background and text color.
3.  Contains a `div` for `max-w-7xl mx-auto px-4 flex justify-between items-center`.
4.  **Brand Logo/Name**: Displays 'MultiFit Aundh' as a `Link` to `/` with `text-2xl font-bold text-[#DFFF00]`.
5.  **Navigation Links**: Renders a `nav` element with links for:
    -   'Memberships' (Link to `/memberships`)
    -   'Schedule' (Link to `/schedule`)
    -   'Trainers' (Link to `/trainers`)
    -   Each link should have `hover:text-[#DFFF00]` for interaction.
6.  **Call-to-Action Button**: Renders a 'Get Free Trial' button as a `Link` to `/trial`.
    -   Applies the 'Primary CTA' design token styles: `bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-semibold rounded-full px-8 py-3 transition-all duration-200`.
7.  Includes responsive hamburger menu icon for mobile view, which toggles a mobile navigation drawer/menu (implementation details for mobile menu not required, just the icon and basic structure).

### Footer.tsx
**Role**: A multi-column footer with the gym's address and phone, opening hours, and an iframe embedding Google Maps pointed to the Aundh, Pune location.
**Public Function**: `Footer(): JSX.Element`
**Logic**:
1.  Renders a `footer` element with `bg-[#1A1A1A]` and `text-[#F5F5F5]` for the background and text color, and `py-12` padding.
2.  Contains a `div` for `max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8`.
3.  **Column 1: About MultiFit Aundh**
    -   `h3` with text 'MultiFit Aundh' and `text-xl font-semibold text-[#DFFF00]`.
    -   Paragraph with motivational copy: "Your journey to a stronger, healthier you starts here. Experience the difference of a high-energy, community-focused fitness environment."
4.  **Column 2: Contact Information**
    -   `h3` with text 'Contact Us' and `text-xl font-semibold text-[#DFFF00]`.
    -   Address: `Multifit Aundh , D.P. Road Medipoint Hospital Road, opp. to Indian Bank, Aundh, Pune, Maharashtra 411067`.
    -   Phone: `075070 08009` (as a `tel:` link).
    -   Opening Hours:
        -   Monday - Friday: 6:00 AM - 10:00 PM
        -   Saturday: 7:00 AM - 8:00 PM
        -   Sunday: 8:00 AM - 6:00 PM
5.  **Column 3: Location Map**
    -   `h3` with text 'Find Us' and `text-xl font-semibold text-[#DFFF00]`.
    -   Embeds a Google Map using an `iframe`.
    -   The `src` attribute of the `iframe` should be: `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.392934091012!2d73.78458731493086!3d18.562876!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf2a6f2b2e8f%3A0x8f2b2e8f8f2b2e8f!2sMultifit%20Aundh!5e0!3m2!1sen!2sin!4v1678912345678!5m2!1sen!2sin` (replace `1678912345678` with a current timestamp if possible, otherwise use a static one).
    -   `width="100%" height="200" style="border:0;" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"`.
6.  Includes a copyright notice at the bottom: `© {Current Year} MultiFit Aundh. All rights reserved.`

### index.tsx (HomePage)
**Role**: The main landing page. It includes a full-bleed hero, class highlights, testimonials, and the trial lead form.
**Public Function**: `HomePage(): JSX.Element`
**Logic**:
1.  Wraps the entire page content within the `Layout` component.
2.  **Hero Section**: 
    -   A full-bleed section with `relative h-screen flex items-center justify-center text-center`.
    -   **Background**: An `img` element with `src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80"` (or a `video` element if a video background is preferred, with appropriate `autoplay`, `loop`, `muted` attributes) and `absolute inset-0 w-full h-full object-cover`.
    -   **Overlay**: A `div` with `absolute inset-0 bg-black bg-opacity-50`.
    -   **Content**: A `div` with `relative z-10 text-[#F5F5F5]`.
        -   `h1` with `text-4xl md:text-6xl font-bold mb-4` and text: "Unleash Your Potential at MultiFit Aundh".
        -   `p` with `text-lg md:text-xl mb-8` and text: "Experience high-energy workouts, expert trainers, and a supportive community that pushes you further."
        -   **CTA Button**: A `Link` to `/trial` with text 'Start Your Free Trial Today'.
            -   Applies the 'Primary CTA' design token styles.
3.  **Class Highlights Section**:
    -   Uses the 'Section container' design token.
    -   `h2` with `text-3xl md:text-4xl font-bold text-center mb-12 text-[#1A1A1A]` and text: "Our Signature Classes".
    -   Placeholder content for class descriptions (e.g., cards for HIIT, Yoga, Strength Training) with motivational copy and images.
4.  **Testimonials Section**:
    -   Renders the `TestimonialsSection` component.
    -   Uses the 'Section container' design token, potentially with an alternating background color (e.g., `bg-gray-50`).
    -   The `TestimonialsSection` component is expected to fetch and display testimonials from the backend.
5.  **Trial Lead Form Section**:
    -   Renders the `TrialForm` component.
    -   Uses the 'Section container' design token.
    -   `h2` with `text-3xl md:text-4xl font-bold text-center mb-12 text-[#1A1A1A]` and text: "Ready to Transform? Grab Your Free Trial!".
**Inter-file Wiring**:
-   Imports `Layout` from `frontend/src/components/Layout.tsx`.
-   Imports `TestimonialsSection` from `frontend/src/components/TestimonialsSection.tsx` (from another feature).
-   Imports `TrialForm` from `frontend/src/components/TrialForm.tsx` (from another feature).

### LocalBusinessSchema.tsx
**Role**: A utility component that renders a `<script type="application/ld+json">` tag containing structured data about the gym to improve local SEO.
**Public Function**: `LocalBusinessSchema(): JSX.Element`
**Logic**:
1.  Renders a `<script>` tag with `type="application/ld+json"`.
2.  The content of the script tag is a JSON-LD object representing a `LocalBusiness` schema.
3.  The JSON-LD object includes the following properties, using the business context:
    -   `@context`: `https://schema.org`
    -   `@type`: `Gym`
    -   `name`: `MultiFit Aundh`
    -   `image`: `https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80` (or a relevant gym image URL)
    -   `address`: 
        -   `@type`: `PostalAddress`
        -   `streetAddress`: `D.P. Road Medipoint Hospital Road, opp. to Indian Bank`
        -   `addressLocality`: `Aundh`
        -   `addressRegion`: `Maharashtra`
        -   `postalCode`: `411067`
        -   `addressCountry`: `IN`
    -   `geo`: 
        -   `@type`: `GeoCoordinates`
        -   `latitude`: `18.562876`
        -   `longitude`: `73.7845873` (corrected from business context to be a valid coordinate)
    -   `url`: `https://www.multifitaundh.com` (placeholder, use actual domain if available)
    -   `telephone`: `+917507008009` (formatted for schema)
    -   `openingHoursSpecification`: An array of `OpeningHoursSpecification` objects:
        -   For Monday-Friday:
            -   `@type`: `OpeningHoursSpecification`
            -   `dayOfWeek`: `['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']`
            -   `opens`: `06:00`
            -   `closes`: `22:00`
        -   For Saturday:
            -   `@type`: `OpeningHoursSpecification`
            -   `dayOfWeek`: `Saturday`
            -   `opens`: `07:00`
            -   `closes`: `20:00`
        -   For Sunday:
            -   `@type`: `OpeningHoursSpecification`
            -   `dayOfWeek`: `Sunday`
            -   `opens`: `08:00`
            -   `closes`: `18:00`

### FloatingWhatsAppButton.tsx
**Role**: Renders a circular button with the WhatsApp icon, fixed to the bottom-right of the screen, which links to the WhatsApp chat API for instant customer communication.
**Public Function**: `FloatingWhatsAppButton(): JSX.Element`
**Logic**:
1.  Renders a `Link` component (or `a` tag) that is fixed to the bottom-right of the viewport (`fixed bottom-6 right-6 z-50`).
2.  The link's `href` attribute should be `https://wa.me/917507008009` (using the business phone number, formatted for WhatsApp).
3.  The button should be circular (`rounded-full`) and have a distinct background color (e.g., `bg-[#25D366]` for WhatsApp green) and `text-white`.
4.  It should contain a WhatsApp icon (e.g., an SVG icon or an icon from a library like `react-icons`).
5.  Includes `p-4 shadow-lg hover:scale-105 transition-transform duration-200` for styling and interaction.



---

## Admin Portal (Frontend)

**Name:** `admin-portal`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/components/AdminLayout.tsx` — COMPONENT layer - The wrapper for all admin-facing pages. It renders a vertical sidebar with NavLink components for Dashboard, Trainers, Testimonials, Leads, and a Logout button. The main content area renders the {children} prop.
- `frontend/src/pages/admin/index.tsx` — PAGE layer - The landing page for the /admin route. It is wrapped in ProtectedRoute and AdminLayout and displays a welcome message and summary stats.

**Feature Instruction:**

## Design Tokens
- Admin Sidebar: bg-[#1A1A1A] text-[#F5F5F5]
- Admin Sidebar NavLink (active): bg-[#333333] text-[#DFFF00]
- Admin Sidebar NavLink (inactive): text-[#F5F5F5] hover:bg-[#333333]
- Admin Logout Button: bg-[#DFFF00] hover:bg-[#DFFF00]/80 text-[#1A1A1A] font-semibold rounded-md px-4 py-2 transition-all duration-200
- Admin Page Header: text-3xl font-bold text-[#1A1A1A]
- Admin Body Text: text-[#333333] leading-relaxed
- Admin Section Background: bg-[#F5F5F5]
- Admin Card: bg-white rounded-xl shadow-md border border-gray-100 p-6

## Admin Portal (Frontend) Feature Instruction
This feature provides the core layout and dashboard for the administrative section of the MultiFit Aundh website. It ensures that all admin pages share a consistent navigation and are protected by authentication.

### AdminLayout.tsx
This component serves as the primary layout wrapper for all pages within the `/admin` route. It provides a persistent sidebar for navigation and renders its children within the main content area.

**Public Function:**
- `AdminLayout({ children: React.ReactNode }): JSX.Element`
  1.  Renders a `div` with a flex layout to contain the sidebar and main content.
  2.  **Sidebar:**
      *   A fixed-width sidebar (e.g., `w-64`) with a background color of `bg-[#1A1A1A]` and text color `text-[#F5F5F5]`.
      *   Displays the "MultiFit Aundh Admin" title prominently at the top.
      *   Contains a list of navigation links using `NavLink` from `react-router-dom`.
      *   Each `NavLink` should have a base style of `text-[#F5F5F5] hover:bg-[#333333] py-2 px-4 block rounded-md`.
      *   Active `NavLink`s should apply `bg-[#333333] text-[#DFFF00]`.
      *   The navigation links are:
          *   **Dashboard**: `to="/admin"`
          *   **Trainers**: `to="/admin/trainers"`
          *   **Testimonials**: `to="/admin/testimonials"`
          *   **Leads**: `to="/admin/leads"`
      *   A "Logout" button at the bottom of the sidebar. This button should have the style `bg-[#DFFF00] hover:bg-[#DFFF00]/80 text-[#1A1A1A] font-semibold rounded-md px-4 py-2 transition-all duration-200`.
      *   The Logout button's `onClick` handler calls the `logout()` function obtained from the `useAuth()` hook.
  3.  **Main Content Area:**
      *   A scrollable `div` that takes the remaining width, rendering the `children` prop.
      *   Applies a default background color of `bg-[#F5F5F5]`.

**Dependencies:**
- Imports `useAuth` from `frontend/src/hooks/useAuth.ts` (from `auth-ui` feature).
- Imports `NavLink` from `react-router-dom`.

### index.tsx (AdminDashboardPage)
This page serves as the landing page for the `/admin` route, displaying a welcome message and a placeholder for summary statistics.

**Public Function:**
- `AdminDashboardPage(): JSX.Element`
  1.  The entire content of this page is wrapped within the `ProtectedRoute` component to ensure only authenticated users can access it.
  2.  Inside `ProtectedRoute`, the content is further wrapped by `AdminLayout` to apply the consistent admin portal structure.
  3.  Within `AdminLayout`, renders a main `div` with padding and a max-width container.
  4.  Displays a prominent `h1` heading: "Welcome to the MultiFit Aundh Admin Dashboard!" using `text-3xl font-bold text-[#1A1A1A]`.
  5.  Includes a `p` tag with a motivational sub-heading: "Empower your fitness community. Manage trainers, testimonials, and leads with ease." using `text-[#333333] leading-relaxed mt-2`.
  6.  Provides a placeholder section for "Summary Statistics" (e.g., "Total Trainers: X", "New Leads This Week: Y", "Pending Testimonials: Z"). These should be displayed within `Admin Card` styled `div`s.

**Dependencies:**
- Imports `AdminLayout` from `frontend/src/components/AdminLayout.tsx`.
- Imports `ProtectedRoute` from `frontend/src/components/ProtectedRoute.tsx` (from `auth-ui` feature).


---

## Trainer Display (Frontend)

**Name:** `trainer-display`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/types/trainer.ts` — UTIL layer - Exports TypeScript interfaces like Trainer and CreateTrainerData, ensuring type safety for trainer-related frontend logic.
- `frontend/src/services/trainerService.ts` — SERVICE layer - Contains async functions like getTrainers() and createTrainer(data) that make HTTP requests to the corresponding backend endpoints using apiClient.
- `frontend/src/hooks/useTrainers.ts` — HOOK layer - Wraps trainerService calls with React Query's useQuery and useMutation. useTrainers() handles fetching, caching, and state management for the trainer list. useCreateTrainer() handles the form submission state for the admin panel.
- `frontend/src/pages/trainers/index.tsx` — PAGE layer - The public-facing page at /trainers. It calls the useTrainers() hook to fetch data and displays a grid of trainer profile cards, each linking to the trainer's detail page.
- `frontend/src/pages/trainers/[slug].tsx` — PAGE layer - A dynamic Next.js page for /trainers/[slug]. It uses the router's slug parameter to fetch and display the detailed profile of a single trainer, including their bio and specializations.
- `frontend/src/pages/admin/trainers.tsx` — PAGE layer - The admin interface at /admin/trainers. It displays a table of existing trainers and includes a button to open a modal (using Radix Dialog) with a form for creating/editing trainers, powered by the useCreateTrainer mutation.

**Feature Instruction:**

## Design Tokens
- Navbar: bg-[#1A1A1A] text-[#F5F5F5]
- Primary CTA: bg-[#DFFF00] hover:bg-[#c2e600] text-[#1A1A1A] font-bold rounded-full px-8 py-3 transition-all duration-200
- Brand text accent: text-[#DFFF00]
- Section bg: bg-[#F5F5F5] (odd sections) / bg-white (even sections)
- Card: bg-white rounded-xl shadow-md border border-gray-100 p-6
- Section container: <section className="py-16 px-4 md:py-24"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
- Hero h1: text-4xl md:text-6xl font-bold text-[#F5F5F5]
- Hero p: text-lg md:text-xl text-[#F5F5F5] mt-4 max-w-2xl
- Body: text-[#333333] leading-relaxed
- Form Label: text-[#333333] font-semibold mb-2
- Form Input: border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent
- Admin Table Header: bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider
- Admin Table Row: bg-white border-b border-gray-200 hover:bg-gray-50

This feature provides the frontend components and logic for displaying trainer profiles to the public and managing them in the admin portal. It consists of TypeScript types, a service for API interaction, React Query hooks for data management, and three Next.js pages.

### `frontend/src/types/trainer.ts`
This file defines the TypeScript interfaces for trainer-related data, ensuring type safety across the feature.

**Public Variables:**
- `interface Trainer`:
  - `id: string`: Unique identifier for the trainer.
  - `name: string`: Full name of the trainer.
  - `slug: string`: URL-friendly identifier for the trainer (e.g., 'john-doe').
  - `specializations: string[]`: An array of strings describing the trainer's specializations (e.g., ['Strength Training', 'Yoga']).
  - `bio: string`: A detailed biography of the trainer.
  - `imageUrl: string`: URL to the trainer's profile image.
- `interface CreateTrainerData`:
  - `name: string`: Full name of the trainer.
  - `slug: string`: URL-friendly identifier for the trainer.
  - `specializations: string[]`: An array of strings describing the trainer's specializations.
  - `bio: string`: A detailed biography of the trainer.
  - `imageUrl: string`: URL to the trainer's profile image.

### `frontend/src/services/trainerService.ts`
This service handles all direct API calls related to trainers, abstracting the HTTP requests from the UI components. It imports `apiClient` from `frontend/src/api/client.ts` and `Trainer`, `CreateTrainerData` from `frontend/src/types/trainer.ts`.

**Public Functions:**
- `getTrainers(): Promise<Trainer[]>`:
  1. Makes a `GET` request to `/api/v1/trainers` using `apiClient.get()`.
  2. Returns a `Promise` that resolves to an array of `Trainer` objects.
  3. Throws an error if the API call fails.
- `createTrainer(data: CreateTrainerData): Promise<Trainer>`:
  1. Makes a `POST` request to `/api/v1/admin/trainers` using `apiClient.post()`.
  2. The request body is the `data` object of type `CreateTrainerData`.
  3. Returns a `Promise` that resolves to the newly created `Trainer` object.
  4. Throws an error if the API call fails.

### `frontend/src/hooks/useTrainers.ts`
This file provides React Query hooks for efficient data fetching, caching, and mutation management for trainer data. It imports `useQuery`, `useMutation`, and `useQueryClient` from `'@tanstack/react-query'`, `getTrainers`, `createTrainer` from `frontend/src/services/trainerService.ts`, and `Trainer`, `CreateTrainerData` from `frontend/src/types/trainer.ts`.

**Public Functions:**
- `useTrainers(): UseQueryResult<Trainer[], Error>`:
  1. Uses `useQuery` with the query key `['trainers']`.
  2. The query function calls `trainerService.getTrainers()`.
  3. Returns a `UseQueryResult` object containing `data` (list of `Trainer`s), `isLoading`, `isError`, `error`, etc.
- `useCreateTrainer(): UseMutationResult<Trainer, Error, CreateTrainerData>`:
  1. Uses `useMutation` with the mutation function `trainerService.createTrainer`.
  2. On successful mutation (`onSuccess` callback):
     a. Invalidates the `['trainers']` query using `queryClient.invalidateQueries({ queryKey: ['trainers'] })` to refetch the list of trainers.
  3. Returns a `UseMutationResult` object containing `mutate` (the function to call for creating a trainer), `isLoading`, `isSuccess`, `isError`, `error`, etc.

### `frontend/src/pages/trainers/index.tsx`
This is the public-facing page that displays a grid of all gym trainers. It imports `Layout` from `@/components/Layout.tsx` and `useTrainers` from `frontend/src/hooks/useTrainers.ts`.

**Public Functions:**
- `TrainersPage(): JSX.Element`:
  1. Renders the page content wrapped in `<Layout>`.
  2. Utilizes the `useTrainers()` hook to fetch the list of trainers.
  3. Displays a hero section at the top:
     a. Background image: `https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80` with an `absolute inset-0 bg-black bg-opacity-50` overlay.
     b. Headline (`h1` with `Hero h1` tokens): "Meet Our Expert Trainers at MultiFit Aundh"
     c. Subheadline (`p` with `Hero p` tokens): "Dedicated to helping you achieve your fitness goals with personalized guidance and motivation."
  4. Below the hero, renders a section (using `Section container` tokens) titled "Our Team" (`h2` with `text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-10 text-center`).
  5. Displays a responsive grid of trainer profile cards. Each card (using `Card` tokens) should:
     a. Show the trainer's `imageUrl` (as a circular or square image).
     b. Display the trainer's `name` (`h3` with `text-xl font-semibold text-[#1A1A1A] mt-4`).
     c. List `specializations` (`p` with `text-[#333333] text-sm mt-1`).
     d. Include a call to action link (`Link` from `next/link`) to `/trainers/[slug]` for the specific trainer, styled as a secondary button (e.g., `text-[#DFFF00] hover:underline mt-3 inline-block`).
  6. Implements loading states (e.g., a spinner or skeleton loaders) while `useTrainers` is fetching data.
  7. Implements error states (e.g., a message "Failed to load trainers.") if `useTrainers` encounters an error.

### `frontend/src/pages/trainers/[slug].tsx`
This is a dynamic public page for displaying a single trainer's detailed profile. It imports `Layout` from `@/components/Layout.tsx`, `useRouter` from `'next/router'`, and `useTrainers` from `frontend/src/hooks/useTrainers.ts`.

**Public Functions:**
- `TrainerDetailPage(): JSX.Element`:
  1. Renders the page content wrapped in `<Layout>`.
  2. Retrieves the `slug` parameter from the URL using `useRouter().query.slug`.
  3. Uses the `useTrainers()` hook to fetch the list of all trainers.
  4. Filters the fetched `Trainer[]` data to find the `Trainer` object whose `slug` matches the URL parameter.
  5. Displays the detailed profile of the found trainer:
     a. Trainer's `imageUrl` prominently at the top of a section (using `Section container` tokens).
     b. Trainer's `name` (`h1` with `text-3xl md:text-5xl font-bold text-[#1A1A1A] mt-6`).
     c. Trainer's `specializations` (`p` with `text-xl text-[#DFFF00] mt-2`).
     d. Trainer's `bio` (`p` with `Body` tokens, `mt-6`).
  6. Implements loading states (e.g., a spinner) while `useTrainers` is fetching data.
  7. Implements error states (e.g., a message "Failed to load trainer details.") if `useTrainers` encounters an error.
  8. Displays a "Trainer not found" message if no trainer matches the `slug` after data is loaded.

### `frontend/src/pages/admin/trainers.tsx`
This is the admin page for managing trainer profiles, accessible at `/admin/trainers`. It imports `AdminLayout` from `@/components/AdminLayout.tsx`, `ProtectedRoute` from `@/components/ProtectedRoute.tsx` (from the `auth-ui` feature), `useTrainers`, `useCreateTrainer` from `frontend/src/hooks/useTrainers.ts`, and Radix UI Dialog components (e.g., `* as Dialog` from `'@radix-ui/react-dialog'`).

**Public Functions:**
- `AdminTrainersPage(): JSX.Element`:
  1. Renders the page content wrapped in `<ProtectedRoute><AdminLayout>`.
  2. Utilizes `useTrainers()` to fetch the list of trainers for display.
  3. Displays a heading (`h1` with `text-3xl font-bold text-[#1A1A1A] mb-6`) "Manage Trainers".
  4. Includes a button (using `Primary CTA` tokens) labeled "Add New Trainer" that acts as a `Dialog.Trigger` to open a modal for creating a new trainer.
  5. Displays a table of existing trainers:
     a. Table headers (using `Admin Table Header` tokens) for "Name", "Specializations", "Image URL", "Actions".
     b. Each row (using `Admin Table Row` tokens) displays trainer `name`, `specializations` (joined by comma), `imageUrl` (perhaps a small thumbnail or just the URL string).
     c. "Actions" column should include buttons for "Edit" and "Delete" (functionality for these is not part of this feature's spec but placeholders should exist).
  6. Implements a Radix UI `Dialog.Root` component for the "Add New Trainer" modal:
     a. `Dialog.Content` should contain a form for `CreateTrainerData`.
     b. Form fields should include `name`, `slug`, `specializations` (e.g., a comma-separated input or multi-select), `bio`, and `imageUrl` (input type `url`). Each field should have a label (using `Form Label` tokens) and input (using `Form Input` tokens).
     c. The form uses the `useCreateTrainer()` hook for submission.
     d. Displays loading state (e.g., a disabled button or spinner) while `useCreateTrainer` is processing.
     e. Displays success/error messages after form submission.
     f. Includes a submit button (using `Primary CTA` tokens) labeled "Create Trainer" and a `Dialog.Close` button labeled "Cancel".
  7. Implements loading states (e.g., a spinner or skeleton table rows) while `useTrainers` is fetching data.
  8. Implements error states (e.g., a message "Failed to load trainers for admin.") if `useTrainers` encounters an error.

---

