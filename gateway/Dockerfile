FROM node:12.16-alpine

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# default to port 3000 for node, and 9229 and 9230 (tests) for debug
ARG PORT=3000
ENV PORT $PORT
EXPOSE $PORT 9229 9230

# you'll likely want the latest npm, regardless of node version, for speed and fixes
# but pin this version for the best stability
RUN npm i npm@latest lerna@3 -g

WORKDIR /app

COPY lerna.json package*.json  ./
COPY gateway/package*json ./gateway/

RUN chown -R node:node /app
USER node

RUN lerna bootstrap -- --no-optional && npm cache clean --force

ENV PATH /app/gateway/node_modules/.bin:$PATH

COPY gateway/src ./gateway/src
WORKDIR /app/gateway

CMD [ "node", "src/index.js" ]
