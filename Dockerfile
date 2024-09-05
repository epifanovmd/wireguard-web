ARG NODE_VERSION=20-alpine

FROM node:${NODE_VERSION}

WORKDIR .
COPY . ./wireguard-web

WORKDIR ./wireguard-web

RUN yarn
RUN yarn build

EXPOSE 4173
CMD ["npm", "run", "prod"]
