# 1) Build stage
FROM node:20-bookworm-slim AS build
WORKDIR /app
COPY package*.json ./
RUN rm -f package-lock.json && npm i --no-audit --no-fund
COPY . .
RUN npm run build    # -> /app/dist

# 2) Runtime stage (static file server)
FROM node:20-alpine
WORKDIR /app
RUN npm i -g serve
COPY --from=build /app/dist ./dist
EXPOSE 80
# -s: SPA fallback, -l: port
CMD ["serve", "-s", "dist", "-l", "80"]