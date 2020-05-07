FROM node:12.16-alpine

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# default to port 3000 for node, and 9229 and 9230 (tests) for debug
ARG PORT=3000
ENV PORT $PORT
EXPOSE $PORT 9229 9230

WORKDIR /app

COPY lerna.json package.json yarn.lock ./
COPY packages ./packages
COPY services/account/package.json ./services/account/

RUN chown -R node:node /app
USER node

RUN yarn && yarn run bootstrap

ENV PATH /app/services/account/node_modules/.bin:$PATH

COPY services/account/src ./services/account/src
WORKDIR /app/services/account

CMD [ "node", "src/index.js" ]
