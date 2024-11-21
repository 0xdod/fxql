# FXQL Statement Parser API

## The Parser

The purpose of this API is to parse FXQL statments. Valid FXQL statements have the form:

```
CURR1-CURR2 {
 BUY {AMOUNT}
 SELL {AMOUNT}
 CAP {AMOUNT}
}
```

The API uses regex to parse an input string in this format and return a valid FXQL statement if the input conforms to the constraints described above.

The decision to use regex to parse the input is simply because of how easier it would be compared to writing a dedicated parser for the statements, although with this approach, detailed error reporting is sacrificed as it would be tedious to pinpoint exactly where the error occured and there is also a potential issue with scaling.

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
