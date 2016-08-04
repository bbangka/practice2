FROM node:0.10

ENV TARGET_ENV development

COPY . /src

CMD node /src/server.js $TARGET_ENV