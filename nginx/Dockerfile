FROM nginx:latest

COPY default.conf.template /etc/nginx/templates/default.conf.template

CMD ["/bin/sh", "-c", "envsubst '${BACKEND1_HOST} ${BACKEND2_HOST} ${BACKEND3_HOST} ${FRONTEND_HOST} ${COMPILER_HOST}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]
