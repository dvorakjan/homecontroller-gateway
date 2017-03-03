FROM hypriot/rpi-node:latest

RUN npm install nodemon -g

RUN mkdir /app
ADD package.json /app/package.json
WORKDIR /app
RUN npm install

ADD nodemon.json /app/nodemon.json
 
EXPOSE 3000
 
CMD npm start