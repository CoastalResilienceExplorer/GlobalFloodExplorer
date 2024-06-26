FROM node:20 as build-stage
WORKDIR app
COPY ./ /app/
RUN yarn

ARG REACT_APP_USE_SITE_GATING=default_value
ENV REACT_APP_USE_SITE_GATING $REACT_APP_USE_SITE_GATING

ARG REACT_APP_SITE_GATING_MATCH=default_value
ENV REACT_APP_SITE_GATING_MATCH $REACT_APP_SITE_GATING_MATCH

RUN yarn run build

FROM nginx
# Copy the NPM build
COPY --from=build-stage /app/build/ /usr/share/nginx/www

# Copy the nginx configuration file. This sets up the behavior of nginx, most
# importantly, it ensure nginx listens on port 8080. Google App Engine expects
# the runtime to respond to HTTP requests at port 8080.
COPY nginx.conf /etc/nginx/nginx.conf

# Create a simple file to handle heath checks. Health checking can be disabled
# in app.yaml, but is highly recommended. Google App Engine will send an HTTP
# request to /_ah/health and any 2xx or 404 response is considered healthy.
# Because 404 responses are considered healthy, this could actually be left
# out as nginx will return 404 if the file isn't found. However, it is better
# to be explicit.
RUN mkdir -p /usr/share/nginx/www/_ah && \
    echo "healthy" > /usr/share/nginx/www/_ah/health

# Finally, all static assets.
RUN chmod -R a+r /usr/share/nginx/www