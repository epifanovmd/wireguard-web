ARG NODE_VERSION=20-alpine

# ─── Stage 1: dependencies ───────────────────────────────────────────────────
# Устанавливаем зависимости отдельным слоем — кэш инвалидируется только
# при изменении package.json / yarn.lock, не при изменении исходников.
FROM node:${NODE_VERSION} AS deps

WORKDIR /app
ENV NODE_ENV=production

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --non-interactive

# ─── Stage 2: build ──────────────────────────────────────────────────────────
# VITE_* переменные встраиваются в бандл на этапе сборки.
# Передаются через build-args в docker-compose (см. docker-compose.yml).
FROM node:${NODE_VERSION} AS builder

WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN yarn build

# ─── Stage 3: serve ──────────────────────────────────────────────────────────
FROM node:${NODE_VERSION} AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist        ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/vite.config.ts ./vite.config.ts

EXPOSE 4173

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://localhost:4173/ || exit 1

CMD ["yarn", "prod"]
