FROM node:20-bookworm-slim as builder

WORKDIR /app

COPY ./common/ ./common/

COPY ./miam/ ./miam/

WORKDIR /app/miam

RUN npm install

RUN npm run build

FROM nginx:latest

COPY --from=builder /app/miam/dist /usr/share/nginx/html

COPY ./miam/nginx.default.conf /etc/nginx/conf.d/default.conf
