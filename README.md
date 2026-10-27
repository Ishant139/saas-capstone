
# Teamdesk — Subscription-Based SaaS Platform

Teamdesk is a multi-organisation SaaS application that provides team management, role-based access control, subscription plans, usage metering, and feature gating.

## Features

- User authentication and protected API routes
- Organisation creation and management
- Team member management and role assignment
- Free, Pro, and Business subscription plans
- API usage tracking and quota enforcement
- Plan-based feature flags
- Docker-based deployment with Docker Compose
- Nginx frontend delivery and API routing
- Automated backend tests and frontend build
- GitHub Actions CI/CD workflow
- Health, readiness, metrics, and application logging endpoints

## Technology Stack

- Frontend: React and Vite
- Backend: Node.js and Express
- Database: MongoDB and Mongoose
- Authentication: JWT
- Deployment: Docker, Docker Compose, Nginx
- Testing: Jest and Supertest
- CI/CD: GitHub Actions
- Logging and metrics: Pino and Prometheus client

## Project Structure

```text
saas-capstone/
├── client/                 # React frontend
├── server/                 # Express API
├── docker-compose.yml      # Local multi-container setup
├── .github/workflows/      # CI/CD workflows
└── README.md               # Project documentation
```

## Run Locally

### Prerequisites

- Node.js and npm
- Docker Desktop
- Git

### Run with Docker Compose

Create the required environment configuration using the variables expected by your application and Compose file.

Do not commit secrets or production credentials.

Start the application:

```bash
docker compose up --build -d
```

Open the application at:

http://localhost:8080

### Run Backend Tests

```bash
cd server
npm ci
npm test
```

### Run Frontend Development Server

```bash
cd client
npm install
npm run dev
```

Open the Vite URL printed in the terminal, usually:

http://localhost:5173

## Monitoring Endpoints

When exposed by the current deployment configuration:

- `/healthz` — basic API health check
- `/readyz` — application and database readiness
- `/metrics` — Prometheus-format metrics

Inspect Docker containers:

```bash
docker compose ps
```

Inspect API logs:

```bash
docker compose logs --tail=100 api
```

Follow logs continuously:

```bash
docker compose logs -f api
```

## CI/CD

The GitHub Actions workflow runs backend tests, builds the frontend, and builds and scans the API Docker image.

Review workflow results in the GitHub repository's Actions tab.

## Current Limitations

- Subscription payment processing with Stripe is not yet implemented.
- Invitations currently use a simplified existing-account workflow.
- Account settings and administration features may require further implementation.
- Production TLS, backup restoration, deployment rollback, and load testing require additional validation.

## Future Improvements

- Stripe subscriptions and webhook handling
- Email-based invitations and password recovery
- Administrator console
- Production HTTPS and deployment rollback
- Automated database backup and restore
- Expanded security tests and load testing
- Production monitoring and alerting
