# Cercana app image. Build: docker compose build
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM node:22-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS run
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
RUN addgroup -S cercana && adduser -S cercana -G cercana && mkdir -p /app/data/files && chown -R cercana:cercana /app/data
COPY --from=build --chown=cercana:cercana /app/.next/standalone ./
COPY --from=build --chown=cercana:cercana /app/.next/static ./.next/static
COPY --from=build --chown=cercana:cercana /app/public ./public
COPY --from=build --chown=cercana:cercana /app/db ./db
COPY --from=build --chown=cercana:cercana /app/scripts ./scripts
COPY --from=deps --chown=cercana:cercana /app/node_modules/postgres ./node_modules/postgres
USER cercana
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1
# Apply any new database migrations, then start the app.
CMD ["sh", "-c", "node scripts/migrate.mjs && node server.js"]
