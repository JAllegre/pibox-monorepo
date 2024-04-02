# rproxy service

## Certificate configuration

On a fresh system install , configure letsencrypt SSL certs with cerbot

Install first the docker rproxy container and do the following on it: 

!!! BE SURE TO BE ON THE RIGHT container (use id instead of name)

- Run certbot 

> certbot --nginx -d pibox.hd.free.fr --non-interactive --agree-tos -m ju.allegre@gmail.com

This will replace config in .conf file  

Copy new conf file into git (pibox.hd.free.fr.conf)

## TROUBLESHOOT

Install certbot on the host machine(pi) and run cron n it to renew certs on the shared volume (/etc/letsencrypt)






