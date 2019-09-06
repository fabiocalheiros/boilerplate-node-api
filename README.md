# Install and Run project

```
yarn install
```

## Docker run

```
docker run --name postgres -e POSTGRES_PASSWORD=docker -d postgres
docker run --name mongoexample -p 27017:27017 -d -t mongo
docker run --name redisexmaple -p 6379:6379 -d -t redis:alpine
```

## create file .env

- Create file and configure .env with base .env.example

## create tables database

```
yarn sequelize db:migrate
```

## Start server

```
yarn dev
```

## Start Queue (Jobs send mail)

```
yarn queue
```

## API file test

Import data (Insomnia_2019-09-06.json)

# Properties

### CRUD Users

- create
  -- check user exists

- update
  -- validate fields
  -- check if the password is correct

- index
  -- File avatar association

- delete
  -- Check User exist

### Sessions (jwt)

- create
  -- validate fields
  -- check user exists
  -- check Password

### Files

- upload files to server

### Database

- Postgress
  -- Migration model (create and add field)
- Redis

### Send Email Notification

- Send notification email example (mailtrap)

#### Error Handling

- Configure errors mode development (Sentry)

### Middlewares

- Auth (jwt)

#### Configs

.editorconfig
.eslintrc.js ["airbnb-base", "prettier"]
.prettierrc
.sequelizerc
.env
