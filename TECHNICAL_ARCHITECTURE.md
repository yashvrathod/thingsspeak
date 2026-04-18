# System Architecture & Technical Specification: IoT Nexus Platform

This document provides a high-level technical decomposition of the **IoT Nexus Platform**, a distributed full-stack environment engineered for real-time telemetry ingestion, multi-tenant resource orchestration, and reactive data visualization.

---

## 1. Global Architectural Paradigm
The platform is architected as a **Unified Reactive Monolith**, leveraging the **Next.js 16 App Router** to converge server-side rendering (SSR), static site generation (SSG), and client-side hydration. It employs a **Direct-to-Compute** model where the edge-compatible middleware intercepts requests for identity verification before they reach the high-performance API fabric.

## 2. Persistence Layer & Schema Orchestration
The persistence layer is managed via **Prisma ORM**, abstracting a high-concurrency **PostgreSQL** instance. 
- **Relational Integrity:** The schema utilizes **CUID (Collision-resistant Unique Identifiers)** for primary keys to ensure global uniqueness across distributed nodes.
- **Entity Decomposition:**
    - `User` & `Account`: Implements a federated identity model supporting both local credentials and OAuth providers.
    - `Channel` & `DataPoint`: A time-series optimized relationship for telemetry ingestion, featuring field-level abstraction (field1-field8) analogous to industry-standard IoT protocols.
    - `Project` & `UserProject`: A many-to-many junction architecture managing the lifecycle of IoT implementation blueprints.
- **Indexing Strategy:** Composite indices on `[channelId, createdAt]` and `[userId, createdAt]` ensure $O(\log n)$ lookup performance for time-series range queries.

## 3. Identity Fabric & Access Control
Authentication is orchestrated through **NextAuth.js**, implementing a multi-layered security posture:
- **Session Strategy:** Hybrid JWT/Database session management for stateless scalability and stateful revocation.
- **Role-Based Access Control (RBAC):** Enforced via `UserRole` enums (`USER`, `ADMIN`), determining the entropy level of accessible API segments.
- **API Key Entropy:** The `ApiKey` entity manages cryptographic tokens with automated status revocation (`ACTIVE`, `EXPIRED`, `REVOKED`) and request-count telemetry.

## 4. Telemetry Ingestion Pipeline
The platform implements a **High-Throughput Ingestion Fabric** via `app/api/data/upload`:
- **Protocol Abstraction:** Supports RESTful POST/GET ingestion with API Key validation.
- **Payload Normalization:** Incoming floating-point telemetry is mapped to dynamically labeled fields, allowing for heterogeneous device integration (e.g., Temperature, Humidity, Luminosity).
- **Spatial Metadata:** Native support for `latitude`, `longitude`, and `elevation` allows for geospatial intelligence and device mapping.

## 5. UI/UX Subsystem: Atomic Composition
The frontend is built on a **Systemic Atomic Design** principle using **Tailwind CSS 4.0** and **Radix UI Primitives**.
- **Component Primitives:** `components/ui/` contains a library of "headless" components that separate logic (Radix) from aesthetics (Tailwind), ensuring maximum accessibility (A11y) and keyboard navigation.
- **Reactive State:** Utilizing **React 19 Server Components (RSC)** to minimize client-side bundle size while maintaining real-time interactivity through Client Side Hydration.
- **Data Visualization:** Integration of **Recharts** for rendering high-fidelity, interactive telemetry trends directly from the persistence layer.

## 6. Edge Infrastructure & Routing
- **Middleware Orchestration:** `middleware.js` acts as a programmable edge gateway, handling route protection and session verification before the execution context enters the Node.js runtime.
- **Dynamic Segmenting:** The use of `[id]` and `[...nextauth]` directories utilizes Next.js's file-system based routing to handle polymorphic API endpoints and catch-all authentication routes.
- **Type Safety:** **TypeScript 5.7** provides static analysis and end-to-end type safety across the entire stack, from database models to frontend props.

---

## 7. File-System Decomposition (Advanced)

| Path Segment | Engineering Significance |
| :--- | :--- |
| `app/api/` | The **API Gateway Fabric**; handles asynchronous request-response cycles and state mutation. |
| `lib/db.ts` | The **Singleton Database Client**; prevents connection pooling exhaustion in serverless environments. |
| `prisma/schema.prisma` | The **Source of Truth**; the declarative definition of the system's data-driven reality. |
| `components/providers.tsx` | The **Dependency Injection Layer**; orchestrates Theme, Auth, and Query contexts. |
| `hooks/` | **Logic Encapsulation**; reusable state machines for client-side side effects. |
| `app/dashboard/` | The **Secure Compute Zone**; contains the core business logic and telemetry visualization. |

---
*Technical documentation compiled for the IoT Nexus Engineering Team.*
