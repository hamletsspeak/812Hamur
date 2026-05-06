FROM node:20-alpine AS builder
WORKDIR /app

ENV NODE_OPTIONS=--max_old_space_size=4096

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/build ./build
COPY --from=builder /app/server ./server

EXPOSE 3000
CMD ["npm", "run", "server"]
