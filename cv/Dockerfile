FROM node:20-bookworm-slim as builder

WORKDIR /app

COPY ./ ./

RUN npm install

RUN npm run build

FROM nginx:latest

COPY --from=builder /app/build /usr/share/nginx/html

COPY ./nginx.default.conf /etc/nginx/conf.d/default.conf



