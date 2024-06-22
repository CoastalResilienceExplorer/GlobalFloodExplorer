FROM cypress/base:20.14.0

WORKDIR /app
COPY ./package.json /app/
RUN yarn
COPY ./ /app/
EXPOSE 3000

ARG REACT_APP_USE_SITE_GATING=0
ENV REACT_APP_USE_SITE_GATING $REACT_APP_USE_SITE_GATING

ARG REACT_APP_SITE_GATING_MATCH=default_value
ENV REACT_APP_SITE_GATING_MATCH $REACT_APP_SITE_GATING_MATCH

RUN CI=false yarn build
RUN npx serve -s build & npx wait-on http://localhost:3000 && yarn cypress:ci
