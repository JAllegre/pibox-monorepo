FROM node:20-bookworm-slim as builder

WORKDIR /app

COPY ./common/ ./common/

COPY ./checklist/ ./checklist/

WORKDIR /app/checklist

RUN npm install

RUN npm run build

FROM nginx:latest

COPY --from=builder /app/checklist/dist /usr/share/nginx/html

COPY ./checklist/nginx.default.conf /etc/nginx/conf.d/default.conf
