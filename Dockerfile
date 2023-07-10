FROM node:18 AS base

FROM base as builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile

FROM base as development
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
RUN yarn build
EXPOSE 3000
CMD [ "yarn", "start" ]
