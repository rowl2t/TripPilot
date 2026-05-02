FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable

COPY package.json pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY apps ./apps
COPY packages ./packages

RUN pnpm install --no-frozen-lockfile
RUN pnpm --filter @trippilot/worker build

EXPOSE 8080
ENV PORT=8080
CMD ["node", "apps/worker/dist/index.js"]
