FROM node:20.12.1-alpine3.19

RUN apk update && apk add curl openssl procps

USER node

WORKDIR /home/node/app

CMD ["tail", "-f", "/dev/null"]