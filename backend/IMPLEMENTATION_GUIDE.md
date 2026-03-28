# Spring Boot Microservices - Implementation Guide

This guide explains the security implementation with proper Spring Security configuration, JWT authentication, and database integration.

## Security Implementation Overview

### 1. UserDetailsService
**File**: `student-service/src/main/java/com/learningplatform/service/CustomUserDetailsService.java`

- Loads user details from the database using StudentRepository
- Implements Spring Security's `UserDetailsService` interface
- Called by `DaoAuthenticationProvider` during authentication
- Returns UserDetails object with authorities (roles)

```java
@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Student not found"));
        // Returns User object with password and authorities
    }
}
```

### 2. OncePerRequestFilter (JWT Filter)
**File**: `student-service/src/main/java/com/learningplatform/security/JwtAuthenticationFilter.java`

- Extends `OncePerRequestFilter` to ensure filter runs once per request
- Extracts JWT token from Authorization header (Bearer token)
- Validates the token using JwtTokenProvider
- Sets the Authentication in SecurityContext if token is valid
- Called for every HTTP request before reaching the controller

```java
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    protected void doFilterInternal(...) {
        String jwt = getJwtFromRequest(request);
        if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
            Long studentId = tokenProvider.getStudentIdFromToken(jwt);
            String email = tokenProvider.getEmailFromToken(jwt);
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);
            // Set authentication in security context
            UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
    }
}
```

### 3. SecurityFilterChain & DAOAuthenticationProvider
**File**: `student-service/src/main/java/com/learningplatform/config/SecurityConfig.java`

#### DaoAuthenticationProvider
- Compares username/password with database values using UserDetailsService
- Uses PasswordEncoder to verify password matches hash in database
- Called during login to authenticate credentials

```java
@Bean
public DaoAuthenticationProvider authenticationProvider() {
    DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
    authProvider.setUserDetailsService(userDetailsService);
    authProvider.setPasswordEncoder(passwordEncoder());
    return authProvider;
}
```

#### AuthenticationManager
- Orchestrates the authentication process
- Uses DaoAuthenticationProvider to validate credentials
- Injected into controllers for manual authentication during login

```java
@Bean
public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
    AuthenticationManagerBuilder authenticationManagerBuilder =
        http.getSharedObject(AuthenticationManagerBuilder.class);
    authenticationManagerBuilder.authenticationProvider(authenticationProvider());
    return authenticationManagerBuilder.build();
}
```

#### SecurityFilterChain
- Configures HTTP security for the application
- Disables CSRF for stateless JWT authentication
- Sets session policy to STATELESS (no cookies/sessions)
- Permits public endpoints: `/api/students/register`, `/api/students/login`
- Requires authentication for other endpoints
- Adds JwtAuthenticationFilter to the filter chain before UsernamePasswordAuthenticationFilter

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.csrf().disable()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeHttpRequests(authz -> authz
                    .requestMatchers("/api/students/register", "/api/students/login").permitAll()
                    .requestMatchers("/api/students/**").authenticated()
                    .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
    return http.build();
}
```

## Authentication Flow

### Registration Flow
```
POST /api/students/register
└─> StudentController.register()
    └─> StudentService.register()
        ├─> Check if email exists in database (StudentRepository)
        ├─> Encode password using PasswordEncoder
        ├─> Save student to database
        ├─> Generate JWT token (JwtTokenProvider)
        └─> Return token in response
```

### Login Flow
```
POST /api/students/login
└─> StudentController.login()
    ├─> AuthenticationManager.authenticate(username, password)
    │   └─> DaoAuthenticationProvider
    │       ├─> UserDetailsService.loadUserByUsername()
    │       │   └─> Query StudentRepository by email
    │       └─> PasswordEncoder.matches(provided, database)
    ├─> StudentService.login() (after auth succeeds)
    ├─> Generate JWT token
    └─> Return token in response
```

### Protected Endpoint Access Flow
```
GET /api/students/123 (with Authorization: Bearer <token>)
└─> JwtAuthenticationFilter.doFilterInternal()
    ├─> Extract token from header
    ├─> Validate token (JwtTokenProvider)
    ├─> Get studentId and email from token
    ├─> UserDetailsService.loadUserByUsername()
    │   └─> Query StudentRepository by email
    ├─> Create Authentication object
    ├─> Set in SecurityContext
    └─> Request proceeds to controller
```

## Database Integration

### StudentRepository
```java
@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByEmail(String email);  // Used by UserDetailsService
    boolean existsByEmail(String email);          // Used during registration
}
```

### Student Entity
- Stored in PostgreSQL `students` table
- Fields: id, email, password (hashed), firstName, lastName, createdAt, updatedAt
- Password is encrypted using BCryptPasswordEncoder before storage
- Database returns hashed password which is compared during login

## API Gateway Routing

### Configuration Methods
**File**: `api-gateway/src/main/java/com/learningplatform/config/GatewayConfig.java`

#### Method 1: RouteLocatorBuilder (Java Configuration)
```java
@Bean
public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
    return builder.routes()
            .route("student-service", r -> r
                    .path("/api/students/**")
                    .uri("lb://student-service"))
            .route("course-service", r -> r
                    .path("/api/courses/**")
                    .uri("lb://course-service"))
            .route("enrollment-service", r -> r
                    .path("/api/enrollments/**")
                    .uri("lb://enrollment-service"))
            .build();
}
```

#### Method 2: application.yml Configuration
```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: student-service
          uri: lb://student-service
          predicates:
            - Path=/api/students/**

        - id: course-service
          uri: lb://course-service
          predicates:
            - Path=/api/courses/**
```

#### Method 3: application.properties Configuration
```properties
spring.cloud.gateway.routes[0].id=student-service
spring.cloud.gateway.routes[0].uri=lb://student-service
spring.cloud.gateway.routes[0].predicates[0]=Path=/api/students/**
```

### Routing Process
```
Client Request: GET /api/students/123 (Port 8080)
└─> API Gateway
    ├─> Match predicates (Path=/api/students/**)
    ├─> Identify route: student-service
    ├─> Use LoadBalancer (lb://) to find service instance
    │   └─> Query Eureka Registry for student-service
    └─> Forward to: http://student-service-instance:8001/api/students/123
```

## Configuration Files

### Using Properties Files (Recommended)
All services now use `application.properties` instead of `application.yml`:
- Service Registry: 8761
- Student Service: 8001 (with JWT config)
- Course Service: 8002
- Enrollment Service: 8003 (with RabbitMQ config)
- API Gateway: 8080
- Notification Service: 8004 (with RabbitMQ config)

### Key Properties

**JWT Configuration** (student-service/application.properties)
```properties
jwt.secret=mySecretKeyForJWTTokenGenerationAndValidationPurpose
jwt.expiration=86400000
```

**Database Configuration** (all services)
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/learning_platform
spring.datasource.username=postgres
spring.datasource.password=password
```

**RabbitMQ Configuration** (enrollment-service, notification-service)
```properties
spring.rabbitmq.host=localhost
spring.rabbitmq.port=5672
spring.rabbitmq.username=guest
spring.rabbitmq.password=guest
```

## Data Storage & Retrieval

### Registration - How Data Flows to Database
1. User submits POST /api/students/register with email, password, firstName, lastName
2. StudentService checks if email exists using StudentRepository
3. PasswordEncoder hashes the password using BCrypt
4. Student object is created with hashed password
5. StudentRepository.save() persists to PostgreSQL students table
6. JpaRepository automatically generates INSERT SQL

### Login - How Data is Retrieved from Database
1. User submits POST /api/students/login with email and password
2. AuthenticationManager calls DaoAuthenticationProvider
3. DaoAuthenticationProvider calls UserDetailsService.loadUserByUsername(email)
4. CustomUserDetailsService executes StudentRepository.findByEmail(email)
5. JPA generates SELECT query: `SELECT * FROM students WHERE email = ?`
6. PostgreSQL returns student record with hashed password
7. PasswordEncoder compares provided password with stored hash using BCrypt algorithm
8. If match succeeds, authentication is granted

### Protected Endpoint - How Data is Validated
1. Request includes Authorization: Bearer <jwt-token>
2. JwtAuthenticationFilter extracts email from JWT
3. UserDetailsService.loadUserByUsername(email) queries database
4. Student record is retrieved to get authorities/roles
5. Authentication object is set in SecurityContext
6. Request is allowed to proceed to controller

## Enrollment Service Security

**File**: `enrollment-service/src/main/java/com/learningplatform/security/JwtAuthenticationFilter.java`

Similar JWT filter but simpler - doesn't need UserDetailsService since it only validates JWT.

The enrollment service requires JWT token for all operations but allows viewing course enrollments (public endpoint).

## Testing the Implementation

### 1. Register a Student
```bash
curl -X POST http://localhost:8080/api/students/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```
Response includes JWT token. Data is stored in students table.

### 2. Login
```bash
curl -X POST http://localhost:8080/api/students/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123"
  }'
```
Returns JWT token if password matches hashed value in database.

### 3. Access Protected Endpoint
```bash
curl -X GET http://localhost:8080/api/students/1 \
  -H "Authorization: Bearer <your-jwt-token>"
```
JwtAuthenticationFilter validates token and allows access.

### 4. Enroll in Course (Requires Authentication)
```bash
curl -X POST http://localhost:8080/api/enrollments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{"courseId": 1}'
```
SecurityContext validates JWT before allowing enrollment.
