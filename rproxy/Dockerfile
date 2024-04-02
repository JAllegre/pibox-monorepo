FROM nginx:latest

RUN apt-get update -y && apt-get install -y nano cron python3-certbot-nginx

COPY rproxy-cron /etc/cron.d/rproxy-cron

RUN crontab /etc/cron.d/rproxy-cron

RUN update-rc.d cron defaults

COPY common/locations.conf /etc/nginx/common/locations.conf

RUN mkdir -p /usr/share/nginx/html/.well-known/acme-challenge

RUN chmod a+rwx /usr/share/nginx/html/.well-known/acme-challenge

COPY conf/default.conf /etc/nginx/conf.d/default.conf

# Comment lines below  when using in localhost , otherwise nginx will fail
COPY conf/pibox.hd.free.fr.conf /etc/nginx/conf.d/pibox.hd.free.fr.conf







