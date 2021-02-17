FROM mhart/alpine-node:8.11.4
WORKDIR /server
COPY package*.json /server/
RUN npm install
COPY . /server/
EXPOSE 80
CMD ["npm", "start"]