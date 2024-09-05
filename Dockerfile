ARG NODE_VERSION=20-alpine

FROM node:${NODE_VERSION} AS installer

WORKDIR /app

COPY package*.json .
COPY yarn.lock .

RUN yarn

FROM node:${NODE_VERSION}

WORKDIR /app

COPY --from=installer /app /app
COPY . .

RUN yarn build

EXPOSE 4173
CMD ["npm", "run", "prod"]
