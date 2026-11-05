FROM node:22-alpine AS dependencies
WORKDIR /app
COPY package.json package-lock.json* ./
COPY frontend/package.json frontend/package.json
COPY backend/package.json backend/package.json
RUN npm ci

FROM dependencies AS build
COPY frontend frontend
RUN npm run build --workspace frontend

FROM dependencies AS test
COPY backend backend
RUN npm run test --workspace backend

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json* ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
RUN npm ci --omit=dev --workspace backend
COPY backend backend
COPY --from=build /app/frontend/dist frontend/dist
EXPOSE 3000
HEALTHCHECK --interval=10s --timeout=3s --start-period=10s --retries=10 \
  CMD wget -q -O - http://127.0.0.1:3000/api/health || exit 1
CMD ["node", "backend/src/server.js"]

