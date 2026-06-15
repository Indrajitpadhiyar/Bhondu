FROM node:22-alpine

COPY ./backend . 

RUN npm install

EXPOSE 4000
CMD [ "node", "server.js" ] 