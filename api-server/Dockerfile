FROM node:20-bookworm-slim as buildStage

WORKDIR /builder

COPY ./ ./

RUN npm install

RUN npm run build

FROM node:20-bookworm-slim

WORKDIR /app

COPY --from=buildStage /builder/node_modules ./node_modules

COPY --from=buildStage /builder/build ./runtime

CMD ["node", "runtime/api-server/src/main.js"]

