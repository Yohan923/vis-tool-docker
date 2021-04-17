FROM mhart/alpine-node:latest
WORKDIR /client
COPY package*.json /client/
RUN npm install
COPY . /client/
# Build for production.
RUN npm run build

# Install `serve` to run the application.
RUN npm install -g serve
EXPOSE 5000
CMD ["serve", "-s", "build"]