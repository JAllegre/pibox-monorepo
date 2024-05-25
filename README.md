# pibox-monorepo

Mono reposotory to manage all apps and services hosted on my home box: miam app, checklist app, rproxy, ...

## RPROXY - Certificate configuration 

On a fresh system install , configure letsencrypt SSL certs with cerbot

- Remove cerbot lines from rproxy/conf/pibox.hd.free.fr.conf (in order to be able to run without error in HTTP mode)

- Run the docker rproxy container (docker compose up)

- Connect to it (docker exec -it <container_id> bash) and do the following on it:

  - !!! BE SURE TO BE ON THE RIGHT container (use id instead of name)

- Add certificates using certbot tool

> certbot --nginx -d pibox.hd.free.fr --non-interactive --agree-tos -m ju.allegre@gmail.com

This will replace config in .conf file

- Copy new conf file into git (rproxy/conf/pibox.hd.free.fr.conf). It should be the same

## LETSENCRYPT CERTS RENEWAL
On a fresh install we need to add a cron task on the host machine to renew certificates that are shared with the rproxy container

- Install certbot on the host machine(pi) witj nginx plugin
```sh sudo apt-get install certbot python3-certbot-nginx```

- Add a task in the crontab (/etc/crontab) to renew certs (/etc/letsencrypt is shared between host and container to be persistent)
```0 0,12 * * * root sleep 1111 && certbot renew -q```
