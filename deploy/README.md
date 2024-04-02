# deploy

## Usual commands

### At initial install, git pull all services including reverse proxy (rproxy, miam, cv, ...)

```sh
docker-compose down

docker compose build

docker compose up -d
```

### At service update, git pull only this service

```sh
docker-compose down <SERVICE_NAME>

docker compose build <SERVICE_NAME>

docker compose up -d <SERVICE_NAME>
```

## Tools

- "gitsubdir": Allow to apply common command to sub dirs
