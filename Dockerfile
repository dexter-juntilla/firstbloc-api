FROM node:16.13.1-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

EXPOSE 3333

COPY . .

CMD npm run migration:run && npm run dev
