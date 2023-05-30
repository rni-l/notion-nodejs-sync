# notion-nodejs-sync

## Description

Use NodeJS and PostgreSQL to synchronize Notion's database.

## Feature

1. Utilize NestJS and Sequelize (PostgreSQL) for data synchronization and storage.
2. In theory, any Notion's database is supported.

## Installation

```shell
git clone git@github.com:rni-l/notion-nodejs-sync.git
pnpm install
pnpm run cp # copy env file
```

set .env config:

```
PG_HOST=localhost
PG_PORT=5432
PG_USERNAME=postgres
PG_PASSWORD=
PG_DATABASE=notion_sync_db


NOTION_SECRET=
NOTION_DATABASE_ID=
```

## Running the app

```bash
# development
pnpm run start

# watch mode
pnpm run start:dev

# Synchronous
curl http://localhost/data/sync

# Incremental synchronization
curl http://localhost/data/syncAll

# Get all data
curl http://localhost/data/all
```
