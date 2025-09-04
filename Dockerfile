# 1) Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build    # -> /app/dist

# 2) Runtime stage (static file server)
FROM node:20-alpine
WORKDIR /app
RUN npm i -g serve
COPY --from=build /app/dist /app/dist
EXPOSE 80
# -s: SPA fallback, -l: port
CMD ["serve", "-s", "dist", "-l", "80"]