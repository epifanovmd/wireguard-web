ARG NODE_VERSION=16.14.2

FROM node:${NODE_VERSION}

WORKDIR .
COPY . ./wireguard-web

WORKDIR ./wireguard-web

RUN yarn
RUN yarn build

EXPOSE 4173
CMD ["npm", "run", "prod"]
