# Online Learning Platform - Microservices Architecture

A comprehensive Spring Boot microservices-based online learning platform with multiple services for authentication, course management, enrollment, notifications, and API routing.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         API Gateway (8080)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
├──────────────────┬──────────────────┬──────────────────────────┤
│                  │                  │                          │
▼                  ▼                  ▼                          ▼
Student Service   Course Service    Enrollment Service    Notification Service
(8001)           (8002)            (8003)               (8004)
├─Auth            ├─Get Courses     ├─Enroll             ├─RabbitMQ Listener
├─Register        ├─Update Courses  ├─JWT Validation     ├─Email Notifications
├─Login           ├─Delete Courses  ├─Feign Clients      └─Logging
└─JWT Token       └─PostgreSQL      ├─PostgreSQL
                                    └─RabbitMQ Publisher

┌─────────────────────────────────────────────────────────────────┐
│         Service Registry - Eureka (8761)                        │
│         (Load Balancer & Service Discovery)                     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  PostgreSQL Database & RabbitMQ Message Queue                   │
└─────────────────────────────────────────────────────────────────┘
```

## Services

### 1. Service Registry (Eureka Server)
- **Port**: 8761
- **Purpose**: Service discovery and load balancing
- **Features**:
  - Registers all microservices
  - Enables Feign client communication
  - Health monitoring

### 2. Student Service
- **Port**: 8001
- **Database**: PostgreSQL (students table)
- **Endpoints**:
  - `POST /api/students/register` - Register new student
  - `POST /api/students/login` - Login and get JWT token
  - `GET /api/students/{id}` - Get student details
- **Authentication**: JWT-based
- **Features**:
  - Password encryption using BCrypt
  - JWT token generation

### 3. Course Service
- **Port**: 8002
- **Database**: PostgreSQL (courses table)
- **Endpoints**:
  - `POST /api/courses` - Create course
  - `GET /api/courses` - Get all courses
  - `GET /api/courses/{id}` - Get course by ID
  - `GET /api/courses/category/{category}` - Filter by category
  - `GET /api/courses/instructor/{instructor}` - Filter by instructor
  - `PUT /api/courses/{id}` - Update course
  - `DELETE /api/courses/{id}` - Delete course
- **Features**:
  - Course management
  - Filtering capabilities

### 4. Enrollment Service
- **Port**: 8003
- **Database**: PostgreSQL (enrollments table)
- **Endpoints**:
  - `POST /api/enrollments` - Enroll in course (requires JWT token)
  - `GET /api/enrollments/student` - Get student's enrollments (requires JWT token)
  - `GET /api/enrollments/course/{courseId}` - Get course enrollments
  - `DELETE /api/enrollments/{enrollmentId}` - Cancel enrollment (requires JWT token)
- **Authentication**: JWT token required
- **Features**:
  - Validates student and course existence using Feign clients
  - Prevents duplicate enrollments
  - Publishes enrollment events to RabbitMQ

### 5. API Gateway
- **Port**: 8080
- **Purpose**: Routing and request forwarding
- **Routes**:
  - `/api/students/**` → Student Service
  - `/api/courses/**` → Course Service
  - `/api/enrollments/**` → Enrollment Service
- **Features**:
  - Centralized entry point
  - Load balancing via Eureka

### 6. Notification Service
- **Port**: 8004
- **Message Broker**: RabbitMQ
- **Features**:
  - Listens to enrollment events
  - Sends notifications
  - Logs enrollment activities

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- PostgreSQL 12+
- RabbitMQ 3.8+

## Setup Instructions

### 1. PostgreSQL Setup

```bash
# Create database
createdb learning_platform

# Connect to the database
psql -U postgres -d learning_platform
```

### 2. RabbitMQ Setup

Install and start RabbitMQ:

```bash
# Using Docker (recommended)
docker run -d --name rabbitmq \
  -p 5672:5672 \
  -p 15672:15672 \
  rabbitmq:3.11-management

# Access RabbitMQ Management Console
# URL: http://localhost:15672
# Username: guest
# Password: guest
```

Or install locally:
- Visit: https://www.rabbitmq.com/download.html

### 3. Build All Services

From the project root directory:

```bash
# Build parent pom
mvn clean install

# Or build all modules
mvn clean package
```

## Running the Services

Start services in the following order:

### Terminal 1: Service Registry
```bash
cd service-registry
mvn spring-boot:run
```
Access: http://localhost:8761

### Terminal 2: Student Service
```bash
cd student-service
mvn spring-boot:run
```

### Terminal 3: Course Service
```bash
cd course-service
mvn spring-boot:run
```

### Terminal 4: Enrollment Service
```bash
cd enrollment-service
mvn spring-boot:run
```

### Terminal 5: API Gateway
```bash
cd api-gateway
mvn spring-boot:run
```

### Terminal 6: Notification Service
```bash
cd notification-service
mvn spring-boot:run
```

## API Usage Examples

### 1. Register Student

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

Response:
```json
{
  "studentId": 1,
  "email": "student@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "token": "eyJhbGciOiJIUzUxMiJ9..."
}
```

### 2. Login

```bash
curl -X POST http://localhost:8080/api/students/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123"
  }'
```

### 3. Create Course

```bash
curl -X POST http://localhost:8080/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Spring Boot Basics",
    "description": "Learn Spring Boot from scratch",
    "instructor": "John Smith",
    "price": 29.99,
    "duration": 30,
    "category": "Java"
  }'
```

### 4. Get All Courses

```bash
curl http://localhost:8080/api/courses
```

### 5. Enroll in Course (Requires Authentication)

```bash
curl -X POST http://localhost:8080/api/enrollments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "courseId": 1
  }'
```

### 6. Get Student Enrollments (Requires Authentication)

```bash
curl -X GET http://localhost:8080/api/enrollments/student \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

### 7. Cancel Enrollment (Requires Authentication)

```bash
curl -X DELETE http://localhost:8080/api/enrollments/1 \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

### 8. Update Course

```bash
curl -X PUT http://localhost:8080/api/courses/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Advanced Spring Boot",
    "description": "Learn advanced topics",
    "instructor": "John Smith",
    "price": 49.99,
    "duration": 50,
    "category": "Java"
  }'
```

## Database Schema

### Students Table
```sql
CREATE TABLE students (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Courses Table
```sql
CREATE TABLE courses (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructor VARCHAR(255) NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    duration INT NOT NULL,
    category VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Enrollments Table
```sql
CREATE TABLE enrollments (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    UNIQUE(student_id, course_id)
);
```

## Key Features

1. **Authentication & Authorization**
   - JWT token-based authentication
   - Secure password encryption with BCrypt
   - Token validation on protected endpoints

2. **Microservices Architecture**
   - Independent deployment and scaling
   - Service discovery with Eureka
   - Inter-service communication using Feign clients

3. **Message Queue Integration**
   - RabbitMQ for asynchronous notifications
   - Enrollment event publishing
   - Event-driven architecture

4. **Database Persistence**
   - PostgreSQL for data storage
   - JPA/Hibernate ORM
   - Automatic schema updates

5. **API Gateway**
   - Centralized routing
   - Load balancing
   - Single entry point

## Configuration

### JWT Configuration
- **Secret**: `mySecretKeyForJWTTokenGenerationAndValidationPurpose`
- **Expiration**: 86400000 ms (24 hours)
- Location: `student-service/src/main/resources/application.yml`

### Database Configuration
- **Host**: localhost
- **Port**: 5432
- **Database**: learning_platform
- **Username**: postgres
- **Password**: password

### RabbitMQ Configuration
- **Host**: localhost
- **Port**: 5672
- **Username**: guest
- **Password**: guest

## Troubleshooting

### Services not connecting
1. Ensure Eureka Server is running on port 8761
2. Check if all services can reach the Eureka registry
3. Verify network connectivity

### Database connection errors
1. Ensure PostgreSQL is running
2. Verify database and user credentials
3. Check if the database exists

### RabbitMQ connection errors
1. Ensure RabbitMQ is running
2. Verify credentials (default: guest/guest)
3. Check if port 5672 is accessible

### JWT validation errors
1. Ensure token is included in Authorization header
2. Token format should be: `Bearer <token>`
3. Check token expiration

## Security Notes

- Change default JWT secret in production
- Update database credentials
- Configure RabbitMQ authentication properly
- Use HTTPS in production
- Implement rate limiting
- Add request validation and sanitization

## Scaling Considerations

1. **Horizontal Scaling**: Run multiple instances of each service
2. **Load Balancing**: API Gateway handles distribution
3. **Database**: Consider connection pooling and replication
4. **Message Queue**: RabbitMQ can handle multiple consumers
5. **Caching**: Add Redis for improved performance

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please refer to the Spring Boot and Spring Cloud documentation:
- Spring Boot: https://spring.io/projects/spring-boot
- Spring Cloud: https://spring.io/projects/spring-cloud
