# Awesome Task Exchange System [Homework on the course "[Distributed Systems]((https://education.borshev.com/architecture))"]

Welcome to the Awesome Task Exchange System, a project showcasing completed homework assignments for the course on
Distributed Systems. You can find more about the course [here (RUS)](https://education.borshev.com/architecture).

## ⚠️ Caution 💩 Code Ahead

Please note that the code in this repository is intended for educational purposes and may not adhere to production-level
standards. There might be instances of suboptimal or incomplete code that should be used with caution.

### Requirements

Read requirements [here](./docs/Requirements.md)

### Apps and Packages

- `accounting-service`: Accounting service
- `auth-service`: SSO service
- `task-service`: Task (tickets) service
- `eslint-config-custom`: `eslint` configurations for client side applications (includes `eslint-config-next`
  and `eslint-config-prettier`)
- `eslint-config-custom-server`: `eslint` configurations for server side applications (includes `eslint-config-next`
  and `eslint-config-prettier`)
- `popug-shared`: Shared code (types, events schemas)
- `logger`: Isomorphic logger (a small wrapper around console.log)
- `tsconfig`: tsconfig.json;s used throughout the monorepo

### Docker

This repo is configured to be built with Docker, and Docker compose. To build all apps in this repo:

```
# Create a network, which allows containers to communicate
# with each other, by using their container name as a hostname
docker network create app_network

# Build prod using new BuildKit engine
COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker-compose -f docker-compose.yml build

# Start prod in detached mode
docker-compose -f docker-compose.yml up -d
```

Open http://localhost:3000.

To shutdown all running containers:

```
# Stop all running containers
docker kill $(docker ps -q) && docker rm $(docker ps -a -q)
```
