# FXQL Statement Parser API

## Setup Instructions

This project requires:

- Nodejs >= 18
- Yarn 1.22.22
- PostgreSQL >= 16

Copy the .env.sample to .env and set the appropriate variables

```bash
cp .env.sample .env
```

Install dependencies

```bash
yarn install
```

Run migrations

```bash
yarn migration:run
```

Start the local server

```bash
yarn start:dev
```

Run tests

```bash
yarn test
```

**Running in docker**
Build the image

```bash
docker build -t fxql:latest .
```

Start the container

```bash
docker run -d -p 8000:8000 --name fxql-api fxql
```

## OpenAPI Spec

The swagger documentation for the API is exposed via `/swagger` endpoint
