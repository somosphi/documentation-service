FROM node:12-alpine

LABEL maintainer="henrique.schmidt@somosphi.com"

RUN addgroup -S service && \
  adduser application -S -G service

COPY . /home/application
RUN cd /home/application && npm install --production && \
  chmod -R 775 /home/application && \
  chown -R application:service /home/application

USER application:service
WORKDIR /home/application

EXPOSE 3000

CMD npm run start
