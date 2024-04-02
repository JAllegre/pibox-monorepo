FROM node:20-bookworm-slim as buildStage

WORKDIR /app

COPY ./common/ ./common/

COPY ./checkList/ ./checkList/

WORKDIR /app/checkList

RUN npm install

RUN npm run build

FROM nginx:latest

COPY --from=buildStage /app/checkList/dist /usr/share/nginx/html

COPY ./checkList/nginx.default.conf /etc/nginx/conf.d/default.conf
