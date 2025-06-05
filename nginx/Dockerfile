FROM nginx:latest

COPY default.conf.template /etc/nginx/templates/default.conf.template

CMD ["/bin/sh", "-c", "envsubst < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]