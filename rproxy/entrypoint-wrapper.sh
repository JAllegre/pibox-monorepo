#!/bin/bash

crontab /etc/cron.d/rproxy-cron

# Start cron and start nginx entry point
cron && /docker-entrypoint.sh "$@"