FROM node:alpine
WORKDIR /src
COPY package.json ./
COPY yarn.lock ./
COPY ./ ./
RUN npm i
CMD ["yarn", "start"]