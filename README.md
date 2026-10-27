# Teamdesk - subscription SaaS capstone

Teams, roles, plans, usage quotas and feature flags on a MERN stack, with Docker + CI.

## Run it
```bash
# 1) API + MongoDB (needs Mongo running locally, or use docker compose below)
cd server && cp .env.example .env && npm install
npm run seed        # creates feature flags
npm run dev         # http://localhost:5000/healthz
npm test

# 2) React app
cd ../client && npm install && npm run dev    # http://localhost:5173

# 3) Everything in containers (production-like)
cp .env.example .env     # set JWT_SECRET
docker compose up --build   # http://localhost:8080
```
Run `npm install` in both folders once so `package-lock.json` exists (CI uses `npm ci`).

## Where each syllabus concept is used
| Concept | File(s) |
|---|---|
| Promises, `Promise.all` | `server/src/controllers/org.controller.js` (list, remove), `utils/asyncHandler.js` |
| async/await + try/catch | `client/src/api/client.js`, `components/PlanButton.jsx`, all controllers |
| Destructuring, spread, map/filter/reduce, optional chaining | `org.controller.js`, `usage.controller.js`, `AuthPage.jsx` |
| NPM (scripts, deps, devDeps) | both `package.json` files |
| CSS (variables, flex, grid, transitions, pseudo-classes) | `client/src/index.css` |
| Bootstrap | grid, navbar, forms, buttons across all components |
| Tailwind | utility classes in `Navbar`, `PlanCard`, `AuthPage` (preflight disabled to coexist with Bootstrap) |
| React hooks (all) | `pages/HooksLab.jsx`, `context/AuthContext.jsx`, `hooks/useFetch.js` |
| Props + prop drilling | `Dashboard -> PlanSection -> PlanCard -> PlanButton` |
| API fetching | `hooks/useFetch.js` (loading/error/abort), `api/client.js` |
| CRUD | Organisations: `org.routes.js` + `OrgForm` / `OrgList` |
| CORS | `server/src/app.js` |
| Middleware | `middleware/` (auth, validate, quota, errorHandler), request-id + logging in `app.js` |
| Validation | Zod in `validators/schemas.js` + `middleware/validate.js` |
| Routing + folder structure | `server/src/routes`, `controllers`, `models`, `middleware` |

## Done so far (~40%)
- Auth (JWT), teams, memberships and roles, invites, plan gating, mock billing with trial, usage quota (429), feature flags
- `/healthz`, `/readyz`, `/metrics`, structured logs with request id, graceful shutdown
- Jest + Supertest tests, multi-stage Dockerfiles (non-root API), docker-compose, GitHub Actions CI + Trivy scan

## Still to do
Email verification / password reset / 2FA, real Stripe + webhook, Redis + BullMQ worker, admin console,
TLS + certbot, SSH deploy + rollback, Sentry, backups + restore test, k6 load test, runbook, staging/prod environments.
