FROM node:22.0-alpine3.19

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . /app

EXPOSE 3053

CMD ["yarn", "dev"]
