FROM mhart/alpine-node:latest

RUN apk add --no-cache git make musl-dev go

# Configure Go
ENV GOROOT /usr/lib/go
ENV GOPATH /go
ENV PATH /go/bin:$PATH

RUN mkdir -p ${GOPATH}/src ${GOPATH}/bin

# Install Glide
RUN go get -u github.com/Masterminds/glide/...

WORKDIR $GOPATH

CMD ["make"]

# install pifra
RUN go get -u github.com/sengleung/pifra/pifra

WORKDIR /server
COPY package*.json /server/
RUN npm install
COPY . /server/
EXPOSE 80
CMD ["npm", "start"]