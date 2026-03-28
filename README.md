<p align="center">
  <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800" alt="Geeks Learning Platform" style="border-radius: 10px; width: 100%; max-height: 250px; object-fit: cover;">
</p>

# 🚀 Geeks Learning.io - Enterprise Architecture

Welcome to **Geeks Learning.io**, a scalable, distributed microservice-based e-learning platform. This educational network is purposefully designed to scale globally, natively resolving modern educational challenges ranging from massive concurrent video streaming payloads, high-availability data consistency, and low-latency interactive architectures connecting systems engineers directly with specialized instructors globally.

---

## 🏗 System Architecture Diagram Highlights

This platform is heavily decentralized leveraging a **Java Spring Boot microservices backend** orchestrated by Spring Cloud, backing an aggressively optimized, component-driven **React + Vite frontend**.

### 1. The Microservices Backend Mesh
The backend is split into multiple highly cohesive, loosely coupled distributed services avoiding monolithic anti-patterns:
- **`eureka-server`**: The Service Naming Registry. All microservices automatically hook into Eureka seamlessly ensuring dynamic load-balancing mappings without hardcoded IP configurations.
- **`api-gateway`**: Centralized HTTP Router & CORS interceptor parsing raw payloads from the frontend and securely routing traffic to internal services mapping correctly onto active Eureka instances.
- **`student-service`**: Handles the full Authentication map (`/api/students/register`, `/login`) leveraging strict `BCrypt` hashes and stateless `HS512 JWT` Tokens! Also contains the heavily guarded User Registry tables.
- **`course-service`**: Manages Course generation, curriculum tracking, and Teacher Proposal APIs. It relies on internal REST interceptors validating the JWT signatures upstream seamlessly tracking Admin approval workflows. 
- **`enrollment-service`**: Manages the mapping of Students to Courses natively bypassing tight coupling architectures between Student and Course architectures.
- **`notification-service`**: A RabbitMQ consumer actively waiting asynchronously for routing keys (`registration.routing.key` & `zoom-allocation`). When pinged, it dispatches an automated SMTP Google Mail via `JavaMailSender` explicitly to the user.

### 2. Live Postgres Database Integrations & Concurrency Control
Instead of local arrays or H2 bindings, the system uses multiple heavily mapped raw **PostgreSQL** architectures natively ensuring data layer independence:
- **Data Persistence**: Students structure and passwords persist explicitly over DB mapping.
- **Database Thread Safety**: Incorporates JPA **Optimistic Locking** via `@Version` mapping to strictly guard against concurrent transaction collisions natively (e.g., preventing two Admins from mutating a user's enrollment variables simultaneously).
- Every time the System Administrator launches the "User Registry" dashboard, the UI queries a secure `GET /api/students/all` REST ping returning true Postgres user arrays natively bypassing mock environments!

### 3. Asynchronous Task Processing (RabbitMQ)
Instead of blocking core threads waiting for an SMTP server, the `student-service` queues tokens like `[ZOOM-ALLOCATION] email||name||url` straight down the **RabbitMQ Engine**.
The `NotificationService` consumes this, reconstructs the message, and rapidly shoots 1-on-1 Zoom Scheduling emails safely asynchronously!

---

## 🎨 Enterprise Frontend UI/UX Upgrades (React + Vite)
We use a radically fast **React + Vite** setup explicitly rejecting Tailwind utility soup in favor of strict, native Vanilla CSS architectures capturing enterprise dark-mode footprints seamlessly (`index.css`).

#### Key Technical Capabilities:
- **Global Contextual Search Engine**: Rapid state-driven filtering engine built into `App.jsx`. It evaluates both course titles and engineering tags intuitively, utilizing an intelligent sorting algorithm to proactively suggest Top-Tier (★ 4.5+ Rating) modules inside horizontally scrolling dynamic glassmorphism carousels!
- **W3Schools Cinematic Interface (Course Viewer)**: Enrolled courses physically break the React SPA mapping and force an isolated rendering sequence into a new Browser Tab. It boots a beautiful Split-Pane Dashboard explicitly decoupling the navigational sidebar from the deep rendering pane (wrapping YouTube `iframes`, textual Markdown, and Document linking components dynamically). 
- **Persistent LocalStorage State Matrix**: Real-time cross-tab state syncing intelligently locks student tracking variables locally. When a user closes `.geeks-learning`, it serializes their module progress to `localStorage`, allowing the Boot Hook to seamlessly load their previous offset seamlessly bypassing 0-index repetition traps!
- **Nested Schema Form Builder**: Natively allows Instructors mapping `{ title, subtopics: [] }` nested variables across multi-step UI form interfaces securely routing complex JSON tree strings reliably over React Arrays without strict mutation penalties. 
- **Pure CSS Confetti Sub-Routines**: On terminal exhaustion of all mapped curriculum nodes, the system triggers a mathematical cascade overlay invoking raw `@keyframes` generating a complex randomized CSS particle animation logic exclusively native without external node package bloating natively celebrating completion milestones securely!

---

## 🛡 Security Workflows & Authentication
Security heavily prioritizes minimal surface attack areas intelligently. 
1. **The Strategy Pattern (`RegistrationStrategy.java`)**: We avoided massive `if-else` loops handling Student vs Teacher vs Admin capabilities mapping cleanly into the Strategy Software Engineering methodology.
2. **Global Exception Mapping**: A `GlobalExceptionHandler` intercepts bad requests (e.g., throwing a `BadRequestException`) mapping and stripping internal Java Server Stack Traces aggressively formatting it into cleanly parsed JSON objects natively digested by React's robust `try-catch` algorithms avoiding ugly raw HTML dumps securely!
3. **Stateless Tokens**: The system validates session capabilities through encrypted JWTs signed securely natively avoiding distributed cache complexities. 

---

## ⚡ Quick Start Deployment Routines

1. **Spin up Core Databases & Messages**: Ensure standard `PostgresDB` instances alongside a `RabbitMQ` message-broker server are currently ticking natively on `localhost:5432` & `localhost:5672`. 
2. **Engage Backing Services**:
   Execute Eureka `mvn spring-boot:run` followed directly by `api-gateway` ensuring networking links hook gracefully.
3. **Deploy Microservices**:
   Launch `student-service`, `course-service`, `enrollment-service`, and `notification-service`. *Ensure you generate a secure Application Password on Gmail mapping into your `application.properties` inside the notification properties map natively!*
4. **Boot React Ecosystem**:
   Navigate natively to `frontend/` deploying `npm install` gracefully before typing `npm run dev` spinning up `http://localhost:5173`.

> **Note**: For initial configurations, attempting to spawn an `ADMIN` safely requires intercepting the frontend manually sending the strict global passphrase config mapping natively into the Java backend securely.
