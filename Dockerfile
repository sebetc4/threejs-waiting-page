FROM node:20-alpine as build
WORKDIR '/app'
COPY package.json .
COPY pnpm-lock.yaml .
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN pnpm install
COPY . .
RUN ["pnpm", "run", "build"]

FROM nginx:1.25.5-alpine-slim
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80