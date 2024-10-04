FROM node:12.22.9

WORKDIR /home/to-do-app

COPY package.json/ /home/to-do-app/

RUN npm install

COPY . /home/to-do-app/

EXPOSE 3000

CMD [ "node", "server.js" ]

