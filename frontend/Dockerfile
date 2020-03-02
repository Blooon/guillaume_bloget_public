FROM node:8

MAINTAINER Baptiste Andre <baptiste.andre536@gmail.com
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
EXPOSE 80

COPY . .
CMD ["sh", "-c", "npm run build:docker && node server_front.js"]