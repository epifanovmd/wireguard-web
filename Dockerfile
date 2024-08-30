ARG NODE_VERSION=20.10.0

FROM node:${NODE_VERSION}

WORKDIR .
COPY . ./wireguard-web

WORKDIR ./wireguard-web

RUN yarn
RUN npm build

EXPOSE 4173
CMD ["npm", "run", "prod"]
