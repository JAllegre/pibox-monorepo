FROM nginx:latest

RUN apt-get update -y && apt-get install -y nano cron python3-certbot-nginx procps

COPY rproxy-cron /etc/cron.d/rproxy-cron

COPY entrypoint-wrapper.sh /entrypoint-wrapper.sh

RUN chmod +x /entrypoint-wrapper.sh

RUN crontab /etc/cron.d/rproxy-cron

COPY common/locations.conf /etc/nginx/common/locations.conf

RUN mkdir -p /usr/share/nginx/html/.well-known/acme-challenge

RUN chmod a+rwx /usr/share/nginx/html/.well-known/acme-challenge

COPY conf/default.conf /etc/nginx/conf.d/default.conf

# Comment lines below  when using in localhost , otherwise nginx will fail
COPY conf/pibox.hd.free.fr.conf /etc/nginx/conf.d/pibox.hd.free.fr.conf


# Overwrite the nginx ENTRYPOINT/CMD directive to allow run also cron
ENTRYPOINT ["/entrypoint-wrapper.sh"]
CMD ["nginx", "-g", "daemon off;"]



