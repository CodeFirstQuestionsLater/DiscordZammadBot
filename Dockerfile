FROM node:12

WORKDIR /bot

COPY package*.json ./

RUN npm install

COPY . ./

ENV PORT=9321

CMD [ "npm", "run start"]