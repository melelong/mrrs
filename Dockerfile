FROM node:20.10.0-alpine3.19 as build-stage
WORKDIR /app

RUN npm i -g pnpm

COPY package.json .

RUN pnpm install

COPY . .

RUN pnpm run build

# production stage
FROM node:20.10.0-alpine3.19 as production-stage

COPY --from=build-stage /app/dist /app
COPY --from=build-stage /app/package.json /app/package.json

WORKDIR /app

RUN npm install --production

EXPOSE 3000

CMD ["node", "/app/main.js"]
