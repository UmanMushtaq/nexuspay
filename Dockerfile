# syntax=docker/dockerfile:1
ARG NODE_VERSION=20-alpine

# ---------- Stage 1: install, build, and prune dev deps ----------
FROM node:${NODE_VERSION} AS build
ARG APP_NAME
ENV NX_DAEMON=false
WORKDIR /app

COPY . .
RUN npm ci --legacy-peer-deps
RUN npx nx build ${APP_NAME} --configuration=production
RUN npm prune --omit=dev --legacy-peer-deps

# ---------- Stage 2: runtime ----------
FROM node:${NODE_VERSION} AS runtime
ARG APP_NAME
ENV NODE_ENV=production
WORKDIR /app

COPY --from=build /app ./

WORKDIR /app/apps/${APP_NAME}/dist
CMD ["node", "main.js"]