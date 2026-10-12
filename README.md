# Class2Life — Project Structure

```
class2life/                     # project root (two independent apps)
├── README.md
├── .gitignore
│
├── frontend/                   # React + Vite + TypeScript
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   ├── .env                    # VITE_API_BASE_URL etc.
│   ├── .env.example
│   ├── public/
│   │   └── favicon.svg
│   └── src/
│       ├── <ROLE> features/        # Independent domain modules
│       │   └── dashboard/
│       │       ├── api/            # Feature-scoped API endpoints & queries
│       │       ├── assets/         # Feature-scoped media & static files
│       │       ├── components/     # Feature-scoped UI components
│       │       ├── hooks/          # Feature-scoped custom hooks
│       │       ├── types/          # Feature-scoped TypeScript definitions
│       │       └── index.ts        # Public API / barrel export for this feature
│       │   ├── catalog/
│       │   └── others/
│       ├── routes/                 # Route guards & authentication flow
│       │   ├── ProtectedRoute.tsx  # Guard for authenticated/authorized views
│       │   └── PublicRoute.tsx     # Guard for public/guest-only views
│       └── shared/                 # Project-wide reusable layer
│           ├── api/                # Base Axios/Fetch client & global interceptors
│           ├── assets/             # Global icons, branding, images, fonts
│           ├── components/         # Pure UI kit (Design System primitives)
│           ├── context/            # Global React context providers
│           ├── hooks/              # Reusable generic utility hooks
│           ├── layouts/            # Page shell layouts (Header, Sidebar, Footers)
│           ├── store/              # Global state management (Zustand/Redux)
│           └── utils/              # Pure helper functions
│
└── backend/                    # Java + Spring Boot + Maven
    ├── pom.xml
    ├── mvnw / mvnw.cmd         # Maven wrapper (commit these!)
    ├── .mvn/wrapper/
    └── src/
        ├── main/
        │   ├── java/com/class2life/
        │   │   ├── BackendApplication.java   # @SpringBootApplication
        │   │   ├── controller/    # HTTP layer — maps URLs to methods
        │   │   ├── service/       # business logic — the "what"
        │   │   ├── repository/    # data access — Spring Data JPA interfaces
        │   │   ├── model/         # @Entity classes (maps to DB tables)
        │   │   ├── dto/           # request/response objects (don't leak entities)
        │   │   ├── config/        # beans, CORS, security config
        │   │   └── exception/     # @ControllerAdvice, custom exceptions
        │   └── resources/
        │       └── application.yml
        └── test/
            └── java/com/class2life/
```

## Frontend — React + Vite5 + TypeScript

### 1. `features/` (Domain Modules)

Houses isolated business features (e.g., `auth`, `products`, `orders`, `dashboard`). Each subfolder behaves like an autonomous mini-application:
- **`api/`**: Feature-specific endpoints, API requests (Axios/fetch callers), or query hooks (React Query / RTK Query).
- **`assets/`**: Media files, icons, and illustrations scoped exclusively to this feature.
- **`components/`**: Private UI components used solely within this module (e.g., `ProductFilterCard`, `OrderDetailModal`).
- **`hooks/`**: Custom hooks encapsulating feature-specific UI and business logic.
- **`types/`**: TypeScript interfaces, enums, and types defining the domain models for this feature.

### 2. `routes/` (Access Control & Navigation)

Handles routing guards and screen access policies:
- **`ProtectedRoute.tsx`**: Route wrapper verifying authentication status and authorization roles. Redirects unauthenticated or unauthorized users to the login screen or a 403 Forbidden page.
- **`PublicRoute.tsx`**: Route wrapper for public pages (e.g., login, registration, landing page). Automatically redirects already-authenticated users away from auth screens directly into the main application.
### 3. `shared/` (Core Foundation & Reusables)

Contains application-wide utilities, UI elements, and infrastructure code that multiple features depend on:
- **`api/`**: Base HTTP client setup (Axios instance, base URLs, interceptors for JWT token injection and refresh logic) and global endpoints (e.g., file upload, dictionary/metadata APIs).
- **`assets/`**: Global static assets including brand logos, favicons, fonts, and fallback images.
- **`components/`**: Generic, design-system UI primitives with zero business logic (e.g., `Button`, `Input`, `Modal`, `Table`, `Badge`).
- **`context/`**: Global React Context providers for lightweight cross-cutting state (e.g., `ThemeContext`, `LanguageContext`).
- **`hooks/`**: Generic reusable utility hooks (e.g., `useDebounce`, `useLocalStorage`, `useOnClickOutside`).
- **`layouts/`**: Page layout scaffolding (e.g., `MainLayout` with header and sidebar, `AuthLayout`, `BlankLayout`).
- **`store/`**: Global state management configuration (Zustand, Redux Toolkit, or Pinia) for app-wide data (auth session, notifications, user preferences).
- **`utils/`**: Pure helper functions without UI or state dependencies (e.g., date formatting, currency helpers, regex validators).
### Dependency Rules

1. **Unidirectional Dependency:** `features/` may import from `shared/`, but **`shared/` must never import from `features/`**.
2. **Feature Isolation:** Features should not reach directly into internal files of other features. If logic or UI must be shared across features, promote it to `shared/`.               |


| Directory / Item           | Purpose                                                       |
| -------------------------- | ------------------------------------------------------------- |
| **features/**              | Isolated domain modules (autonomous mini-apps).               |
| `├─ api/`                  | Feature-specific endpoints & API calls.                       |
| `├─ assets/`               | Feature-scoped media and icons.                               |
| `├─ components/`           | Private UI components.                                        |
| `├─ hooks/`                | Feature-specific logic hooks.                                 |
| `└─ types/`                | Domain models and TS interfaces.                              |
| **routes/**                | Access control and routing policies.                          |
| `├─ ProtectedRoute.tsx`    | Guards for authenticated/authorized users.                    |
| `└─ PublicRoute.tsx`       | Public routes (auto-redirects if logged in).                  |
| **shared/**                | App-wide core foundation and reusables.                       |
| `├─ api/`                  | Base HTTP client & global endpoints.                          |
| `├─ assets/`               | Global static assets (logos, fonts).                          |
| `├─ components/`           | Generic UI primitives (no business logic).                    |
| `├─ context/`              | Global React Context providers.                               |
| `├─ hooks/`                | Reusable utility hooks.                                       |
| `├─ layouts/`              | Page layout scaffolding.                                      |
| `├─ store/`                | Global state management (Zustand, Redux).                     |
| `└─ utils/`                | Pure helper functions (formatting, validation).               |
| **Dependency Rules**       |                                                               |
| `1. Unidirectional`        | `features/` imports `shared/`; `shared/` never imports back.  |
| `2. Isolation`             | Features cannot access each other. Share via `shared/`.       |

## Backend — Java 21+ Spring Boot + Maven

| Package       | Purpose                                              |
| ------------- | ---------------------------------------------------- |
| `controller/` | REST endpoints — maps HTTP requests to service calls |
| `service/`    | Business logic and transactions                      |
| `repository/` | Spring Data JPA interfaces for persistence           |
| `model/`      | `@Entity` classes mapped to DB tables                |
| `dto/`        | Request/response objects — keep entities internal    |
| `config/`     | `@Configuration` beans, CORS, security               |
| `exception/`  | `@ControllerAdvice` + custom exception handling      |

## Typical request flow

```
React component → api/client.ts → Spring @RestController
    → @Service → @Repository (JPA) → database
    → DTO → JSON response → React types/
```
# Class2Life — Docker Setup Guide
 
This guide gets the full stack (Postgres, Redis, backend, frontend) running locally with one command. Read this before touching any Docker files.
 
## Prerequisites
 
- Docker Desktop installed and running
- Clone the repo, `cd` into the root folder (the one containing `docker-compose.yml`)
## Project structure
 
```
Class2Life/
├── backend/
│   └── Dockerfile        # Spring Boot build
├── frontend/
│   └── Dockerfile        # Vite dev server
├── docker-compose.yml    # orchestrates all 4 services
└── README.md
```
 
## Running everything
 
```bash
docker compose up --build
```
 
- `--build` forces a rebuild from the Dockerfiles — use it any time you change backend/frontend code or the Dockerfiles themselves.
- Without `--build`, Compose reuses existing images (faster, but won't pick up code changes).
- First run will take a few minutes (downloading Postgres/Redis images, installing Maven/npm dependencies). Later runs are much faster thanks to Docker's layer caching.
## What's running
 
| Service  | URL / Port              | Notes                                  |
|----------|--------------------------|-----------------------------------------|
| frontend | http://localhost:5173    | Vite dev server, hot-reloads on save    |
| backend  | http://localhost:8080    | Spring Boot API                         |
| postgres | localhost:5432           | DB name/user/pass: `class2life`         |
| redis    | localhost:6379           | no auth in dev                          |
 
## Verifying it's actually working
 
Run these after `docker compose up --build` finishes:
 
```bash
# All 4 services should show "Up"
docker compose ps
 
# Postgres — empty table list is expected until migrations/entities exist
docker compose exec postgres psql -U class2life -d class2life -c "\dt"
 
# Redis — should return PONG
docker compose exec redis redis-cli ping
```
 
Then open `http://localhost:5173` in a browser — you should see the frontend load.
 
## Day-to-day workflow
 
- **Stopping for the day:** `docker compose down` — this stops and removes containers, but your Postgres **data is preserved** (it lives in a separate Docker volume, not inside the container).
- **Starting again:** `docker compose up` (no `--build` needed unless code changed).
- **Editing backend/frontend code:** just edit normally. Rebuild with `docker compose up --build` to see changes reflected (frontend hot-reloads without a rebuild; backend needs a rebuild since Java isn't live-reloaded).
## Connecting with a DB GUI (DBeaver, TablePlus, etc.)
 
Use `localhost:5432`, **not** `postgres:5432` — the hostname `postgres` only resolves *inside* Docker's internal network (i.e., from the backend container). From your own machine, use `localhost` with the port that's mapped in `docker-compose.yml`.
 
- Host: `localhost`
- Port: `5432`
- Database/User/Password: `class2life`
## Troubleshooting
 
**"Empty compose file" error**
`docker-compose.yml` exists but has no content, or isn't saved. Make sure the file actually has the service definitions in it.
 
**YAML parsing errors (e.g. "unexpected type map")**
Usually an indentation or stray-dash issue. Environment variables should be written as plain `KEY: value` pairs, not list items (`- KEY: value` is wrong).
 
**Postgres container won't start / "pg_ctlcluster" directory error**
This happens if an old data volume (from a previous Postgres version) conflicts with the current image. Fix:
```bash
docker compose down
docker volume rm class2life_pgdata   # run `docker volume ls` if the name differs
docker compose up --build
```
 
**Port already in use**
If you have Postgres or Redis installed natively on your machine, it may already be using port 5432 or 6379, conflicting with the container. Either stop your local instance or change the host-side port in `docker-compose.yml` (e.g. `"5433:5432"`).
 
**Frontend loads inside the container but not in your browser**
Make sure the frontend's run command includes `--host` (already set up in the Dockerfile) — without it, Vite only binds to `localhost` *inside* the container, which isn't reachable from outside.
 
## Resetting everything from scratch
 
If something's broken and you just want a clean slate:
```bash
docker compose down -v   # -v also removes volumes — this WIPES your Postgres data
docker compose up --build
```
Only do this if you're okay losing all current DB data (fine during early setup; not fine once you have real test data you want to keep).
 
