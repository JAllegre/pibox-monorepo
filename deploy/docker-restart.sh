#!/bin/bash

git pull
sudo docker system prune -f

if [ "$1" = "" ]; then
  echo "Restart all containers"
  
else
  echo "Restart container $1"
fi

sudo docker compose down $1

sudo docker compose build $1

sudo docker compose up -d $1


