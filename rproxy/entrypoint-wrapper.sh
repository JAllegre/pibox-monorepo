#!/bin/bash

# Start cron and start nginx entry point
cron && /docker-entrypoint.sh "$@"