FROM node:20.10.0-alpine3.19 as build-stage

WORKDIR /app_build

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

# production stage
FROM node:20.10.0-alpine3.19 as production-stage

WORKDIR /app_pro

COPY --from=build-stage /app_build/dist /app_pro
COPY --from=build-stage /app_build/package.json /app_pro/package.json

RUN npm install --omit=dev

EXPOSE 3000

CMD ["node", "/app_pro/main.js"]
