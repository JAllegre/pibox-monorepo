FROM node:20-bookworm-slim as buildStage

WORKDIR /app

COPY ./api-server/src/features/miam ./api-server/src/features/miam

COPY ./miam/ ./miam/

WORKDIR /app/miam

RUN npm install

RUN npm run build

FROM nginx:latest

COPY --from=buildStage /app/miam/dist /usr/share/nginx/html

COPY ./miam/nginx.default.conf /etc/nginx/conf.d/default.conf
