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
│       ├── main.tsx            # ReactDOM.createRoot(...) entry
│       ├── App.tsx             # router + layout
│       ├── index.css
│       ├── vite-env.d.ts
│       ├── api/                # fetch/axios calls to the backend
│       │   └── client.ts
│       ├── components/         # reusable UI (Button, Card...)
│       ├── pages/              # route-level screens (Home, Login...)
│       ├── hooks/              # custom hooks (useAuth, useFetch...)
│       ├── types/              # TS mirrors of your backend DTOs
│       ├── utils/              # pure helpers
│       └── assets/             # images, fonts
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

| Directory         | Purpose                                                 |
| ----------------- | ------------------------------------------------------- |
| `src/api/`        | HTTP client + endpoint calls to the Spring Boot backend |
| `src/components/` | Reusable presentational UI (buttons, cards, inputs)     |
| `src/pages/`      | Route-level screens wired to the router                 |
| `src/hooks/`      | Custom hooks (`useAuth`, `useFetch`, …)                 |
| `src/types/`      | TypeScript interfaces mirroring backend DTOs            |
| `src/utils/`      | Pure helper functions (formatting, validation)          |
| `src/assets/`     | Static assets: images, fonts, icons                     |

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
