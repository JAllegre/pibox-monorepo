# pibox-monorepo

Mono reposotory to manage all app and service of my home box: miam app, checklist app, rproxy, ...

## Certificate configuration (for reverse proxy)

On a fresh system install , configure letsencrypt SSL certs with cerbot

- Remove cerbot lines from rproxy/conf/pibox.hd.free.fr.conf (in order to be able to run without error in HTTP mode)

- Run the docker rproxy container (docker compose up)

- Connect to it (docker exec -it <container_id> bash) and do the following on it:

  - !!! BE SURE TO BE ON THE RIGHT container (use id instead of name)

- Run certbot

> certbot --nginx -d pibox.hd.free.fr --non-interactive --agree-tos -m ju.allegre@gmail.com

This will replace config in .conf file

- Copy new conf file into git (rproxy/conf/pibox.hd.free.fr.conf). It should be the same

## TROUBLESHOOT

Install certbot on the host machine(pi) and run cron n it to renew certs on the shared volume (/etc/letsencrypt)
