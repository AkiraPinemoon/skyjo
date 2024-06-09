FROM node:18-alpine AS base

WORKDIR /app
RUN npm i -g pnpm

FROM base AS dependencies

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm i

FROM base AS build

WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpm build

FROM node:18-alpine AS deploy

WORKDIR /app
COPY --from=build /app/.output/ ./.output/
CMD [ "node", ".output/server/index.mjs" ]
