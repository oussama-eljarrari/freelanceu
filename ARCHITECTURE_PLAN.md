# Architecture Review & Refactoring Plan (FreelanceU)

This document outlines the core architectural issues in the current FreelanceU project and the proposed solutions, focusing on the 80/20 rule (the 20% of architectural changes that will solve 80% of the current "Big Ball of Mud" pain points).

## 1. Core Problems (The "Big Ball of Mud")

### A. UI-Driven Domain Models
Currently, the database/backend shape is being dictated by what the React components need to render (`src/types/index.ts`). 
*   **Symptom:** Infinite nesting (e.g., `Order` contains a full `Gig`, which contains a full `User` as the seller).
*   **Business Impact:** Updating a user's profile (like an avatar) would require finding and updating every gig and order they are attached to.

### B. Missing Security & Boundary Layers
The NestJS backend has a flat architecture where controllers handle raw logic without global protection.
*   **Symptom:** Auth checks (`if (!session.user)`) are hardcoded inside individual controller routes.
*   **Business Impact:** High risk of exposing endpoints (Direct Object Reference vulnerabilities). Any user could potentially modify another user's gig if endpoints are added without strict Role/Auth Guards.

### C. Leaking Business Logic to the Client
The frontend (`AuthContext.tsx`, UI components) is responsible for data validation and enforcing business rules.
*   **Symptom:** Manual checks for email/password presence in React; backend accepts whatever it is given (missing `ValidationPipe` and DTO enforcement).
*   **Business Impact:** The API cannot be trusted if consumed by a different client (e.g., a mobile app), as invalid states can easily be written to the backend.

---

## 2. Proposed Architectural Boundaries

To fix these issues, we will implement strict boundaries using NestJS best practices, adapted for our JSON-file data layer.

### A. Strict Module Isolation
*   **Users Module:** Owns `users.json`.
*   **Gigs Module:** Owns `gigs.json`.
*   **Orders Module:** Owns `orders.json`.
*   **Rule:** A module can **never** directly read another module's JSON file. It must request data through the other module's Service layer.

### B. Decoupling DB Shape from UI Shape (DTOs vs. Entities)
*   **Entities (Database):** Flat, normalized data. A Gig in `gigs.json` will only store `sellerId: "u1"`.
*   **DTOs (Contracts):** The Service layer will act as the translator. It will fetch the Gig, fetch the User, and stitch them together into a `GigResponseDto` that matches what the React UI expects.

### C. Security via Guards
*   Implement a global `AuthGuard` to verify sessions before requests reach the controller.
*   Implement a `RolesGuard` to easily restrict endpoints (e.g., `@Roles('freelancer')` on Gig creation).

---

## 3. Technical Architecture (Solving the N+1 Problem)

Because we are enforcing strict module isolation, fetching a list of 50 Gigs could result in 50 separate calls to the `UsersService` to get the seller profiles (The N+1 Query Problem).

**The Solution: Service-Level Batching**
Instead of looping and fetching individually, we will use batching:
1. `GigsService` fetches 50 gigs.
2. Extracts unique `sellerId`s.
3. Calls `UsersService.findManyByIds(['u1', 'u2'])`.
4. Stitches the data together in memory.
*This reduces database (JSON file) reads from 51 down to 2.*

---

## 4. Open Questions & Next Steps

Before executing the refactor, we need to decide on the following:

1.  **Refactoring Order:** Do we rebuild the backend modules first (starting with Auth/Users, then Gigs), or do we restructure the React frontend to feature-folders first?
2.  **Shared Utilities:** Should we create a generic `JsonRepository<T>` base class that all modules extend to handle file reads/writes, UUID generation, and locking?
3.  **Error Handling:** Do we want a global Exception Filter to format all backend errors consistently for the frontend?
