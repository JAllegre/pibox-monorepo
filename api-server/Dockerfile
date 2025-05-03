FROM node:20-bookworm-slim as builder

WORKDIR /builder

COPY ./common/ ./common/

COPY ./api-server/ ./api-server/

WORKDIR /builder/api-server

RUN npm install

RUN npm run build

FROM node:20-bookworm-slim

WORKDIR /app

COPY --from=builder /builder/api-server/node_modules ./node_modules

COPY --from=builder /builder/api-server/build/ ./runtime

COPY --from=builder /builder/api-server/tools ./tools

CMD ["node", "runtime/api-server/src/main.js"]

