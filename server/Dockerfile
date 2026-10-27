# ---- stage 1: install production deps only ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
# After your first local `npm install`, a package-lock.json exists -> switch to `npm ci --omit=dev`
RUN npm install --omit=dev

# ---- stage 2: slim runtime image, non-root ----
FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY src ./src
COPY package.json ./
USER node
EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:5000/healthz || exit 1
CMD ["node", "src/server.js"]
