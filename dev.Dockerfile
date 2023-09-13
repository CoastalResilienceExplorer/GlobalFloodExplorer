FROM node:16 as build-stage
WORKDIR app
COPY ./ /app/
RUN git submodule init && git submodule update
RUN yarn add package.json
EXPOSE 3000
ENTRYPOINT [ "npm", "start" ]