FROM node:20-bullseye AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-bullseye
WORKDIR /app

RUN npm i -g serve
COPY --from=build /app/build ./build

ENV PORT=3000
EXPOSE 3000

CMD ["sh", "-c", "serve -s build -l $PORT"]
