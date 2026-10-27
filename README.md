# Teamdesk — SaaS Subscription & Deployment Platform

Teamdesk is a multi-tenant SaaS application built to demonstrate application development, containerized deployment, automated testing, CI/CD, monitoring, and database recovery.

The platform allows users to create organisations, manage team members, view subscription plans, and monitor usage. The project also includes health-check endpoints, runtime metrics, and a MongoDB backup-and-restore workflow.

> **Project status:** Development capstone. Core application, Docker deployment, automated tests, monitoring endpoints, and a manual backup-and-restore workflow have been implemented and tested. Some production-readiness features remain future work.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Objectives](#objectives)
3. [Features](#features)
4. [Technology Stack](#technology-stack)
5. [Architecture](#architecture)
6. [Project Structure](#project-structure)
7. [Prerequisites](#prerequisites)
8. [Getting Started](#getting-started)
9. [Docker Deployment](#docker-deployment)
10. [Environment Configuration](#environment-configuration)
11. [API Endpoints](#api-endpoints)
12. [Authentication and Access Control](#authentication-and-access-control)
13. [Subscription Plans and Usage](#subscription-plans-and-usage)
14. [Automated Testing](#automated-testing)
15. [CI/CD Pipeline](#cicd-pipeline)
16. [Monitoring and Health Checks](#monitoring-and-health-checks)
17. [Database Backup and Recovery](#database-backup-and-recovery)
18. [Security Considerations](#security-considerations)
19. [Validation Results](#validation-results)
20. [Known Limitations](#known-limitations)
21. [Future Improvements](#future-improvements)
22. [Author](#author)

---

## Project Overview

Modern SaaS applications require more than a working user interface. They need reliable deployment, secure access control, automated testing, monitoring, and data recovery procedures.

Teamdesk combines a web application with a containerized backend infrastructure. Docker Compose runs the application services, while GitHub Actions provides a CI/CD workflow for building and validating the project.

The project focuses on learning and demonstrating the foundations of deploying and operating a SaaS application.

## Objectives

- Develop a web-based SaaS dashboard.
- Implement authentication and organisation-based access control.
- Manage teams, roles, subscription plans, and usage limits.
- Containerize the frontend, backend, and database.
- Automate application checks through CI/CD.
- Expose health, readiness, and runtime metrics endpoints.
- Create and verify MongoDB backups and recovery procedures.
- Document deployment, validation, and remaining production work.

## Features

### Application Features

- User registration and login.
- Organisation creation and management.
- Team member management and role assignment.
- Subscription plan selection.
- Usage tracking and quotas.
- Feature availability based on plans.
- Billing and subscription status display.
- Admin overview of organisations available to the logged-in user.

### Deployment and Reliability Features

- Docker-based application deployment.
- Docker Compose service orchestration.
- Automated backend tests.
- Frontend production build.
- GitHub Actions CI/CD workflow.
- Container health checks.
- API health and readiness endpoints.
- Prometheus-format Node.js runtime metrics.
- Structured HTTP request logging.
- MongoDB backup script.
- Timestamped local database backups.
- Backup log and non-empty file validation.
- Restore testing using a separate MongoDB database.

---

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | React |
| Frontend build tool | Vite |
| Backend | Node.js and Express |
| Database | MongoDB |
| Database ODM | Mongoose |
| Authentication | JSON Web Tokens (JWT) |
| Request validation | Zod |
| Logging | Pino and HTTP request logging |
| Containerization | Docker |
| Service orchestration | Docker Compose |
| CI/CD | GitHub Actions |
| Security scanning | Trivy |
| Backup tooling | `mongodump` and `mongorestore` |
| Backup automation script | PowerShell |

---

## Architecture

```text
                    User / Browser
                          |
                          v
                 React + Vite Frontend
                          |
                     HTTP / API
                          |
                          v
                  Express REST API
                          |
             +------------+------------+
             |            |            |
             v            v            v
       Authentication  Organisations  Billing
       and JWT          and Members    and Usage
             |            |            |
             +------------+------------+
                          |
                          v
                    MongoDB Database
                          |
                          v
                Backup and Restore Tools
```

### Deployment Architecture

```text
GitHub Repository
       |
       v
GitHub Actions
       |
       +--> Backend Tests
       |
       +--> Frontend Build
       |
       +--> Docker Image Build
       |
       +--> Security Scan
       |
       v
Docker Compose
       |
       +--> Web / Nginx
       +--> Node.js API
       +--> MongoDB
```

The diagram represents the intended CI/CD and deployment flow. The workflow has passed previously, but the latest run should be checked before claiming every job is currently green.

---

## Project Structure

```text
saas-capstone/
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components