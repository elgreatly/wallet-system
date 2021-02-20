# Wallet System

## Installation

1. Create database
2. copy .env.example file to .env file and add your data
3. install dependencies
```bash
$ npm install
```
4. build app
```bash
$ npm run build
```
5. run migrations
```bash
$ npm run typeorm:run
```
6. run app
```bash
$ npm run start
```

## Running APP

```bash
# development
$ npm run start

# update entities in dist
$ npm run build

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## API

### Register

POST /api/v1/register

body:
```bash
{
    "name": "test one",
    "phoneNumber": "+201100084331",
    "password": "123456"
}
```

### Login

POST /api/v1/login

body:
```bash
{
    "phoneNumber": "+201015161219",
    "password": "123456"
}
```

### Create Transaction

POST /api/v1/wallet/transactions

headers:
```bash
{
    "Authorization": "Bearer xxx"
}
```
body:
```bash
{
    "toUserId": 2,
    "amount": 500
}
```

### Get User Balance

GET /api/v1/users/wallet-balance

headers:
```bash
{
    "Authorization": "Bearer xxx"
}
```

### Get Transactions

GET /api/v1/wallet/transactions?limit=10&offset=0

### Get User Transactions

GET /api/v1/wallet/transactions/users?limit=10&offset=0

headers:
```bash
{
    "Authorization": "Bearer xxx"
}
```