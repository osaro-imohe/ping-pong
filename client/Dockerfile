FROM node:alpine
WORKDIR /src
COPY package.json ./
COPY yarn.lock ./
COPY ./ ./
RUN  yarn install
CMD ["yarn", "start"]