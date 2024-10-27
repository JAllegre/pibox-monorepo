#!/bin/bash

# Start cron and start nginx entry point
service start cron && /docker-entrypoint.sh "$@"