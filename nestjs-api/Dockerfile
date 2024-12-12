FROM node:20.12.1-alpine3.19

RUN apk update && \ 
  apk add openssl procps && \
  npm i -g @nestjs/cli@10.4.8

USER node

WORKDIR /home/node/app

CMD ["tail", "-f", "/dev/null"]