FROM debian:jessie

# Install dependencies for nodejs
RUN apt-get update && apt-get install -y \
    build-essential \
    make \
    gcc \
	curl

ENV NPM_CONFIG_LOGLEVEL info
ENV NODE_VERSION 6.8.1

RUN curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.xz" \
	&& tar -xJf "node-v$NODE_VERSION-linux-x64.tar.xz" -C /usr/local --strip-components=1 \
	&& rm "node-v$NODE_VERSION-linux-x64.tar.xz"

ENV NODE_ENV production

WORKDIR /app/api
COPY ./api/package.json /app/api/
RUN npm install

WORKDIR /app/front
COPY ./front/package.json /app/front/
RUN npm install

COPY . /app
RUN npm run deploiement

WORKDIR /app/api

CMD npm start
