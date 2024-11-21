FROM node:18-slim

WORKDIR /opt/app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

CMD ["yarn", "start:prod"]