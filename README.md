# Pokemon API

![master](https://github.com/strvcom/backend-template-nestjs-api/actions/workflows/api-ci.yml/badge.svg)

## Table of Contents

- [Setup](#setup)
- [Development](#development)
- [Database](#database)
- [Testing](#testing)

## Setup

1. Install dependencies: `make install` (the project uses [yarn](https://github.com/yarnpkg))
2. Create local environment file: `cp .env.template .env`
3. Run infrastructure `make infra` (`.db/init/init.sql` should automatically create `api_db` database)
4. Run database migrations: `make migration-run`

## Development

- `make infra` - start postgres docker container
- `make develop` - start development server
- `make type-check` - run type checking
- `make lint-fix` - run linter
- `make format` - run prettier

## Database

- `make seed-database` - truncate all tables and seed database with initial data
- `make migration-create name=<migration-name>` - create new empty migration file
- `make migration-generate name=<migration-name>` - generate migration file based on the current schema diff
- `make migration-run` - run all pending migrations
- `make migration-revert` - revert last migration
- `make schema-drop` - drop all tables

```mermaid
classDiagram
direction BT

class evolution_requirement {
   integer amount
   varchar name
   integer pokemonId
   integer id
}

class pokemon {
   integer number
   varchar name
   varchar classification
   text types
   text resistant
   text weaknesses
   numrange weightRange
   numrange heightRange
   double precision fleeRate
   integer maxCP
   integer maxHP
   boolean isFavorite
   integer evolutionRequirementsId
   integer id
}

class pokemon_attack {
   varchar name
   varchar type
   integer damage
   integer pokemonId
   integer id
}

class pokemon_evolutions_pokemon {
   integer pokemonId_1
   integer pokemonId_2
}

evolution_requirement  -->  pokemon : pokemonId_id
pokemon  -->  evolution_requirement : evolutionRequirementsId_id
pokemon_attack  -->  pokemon : pokemonId_id
pokemon_evolutions_pokemon  -->  pokemon : pokemonId_2_id
pokemon_evolutions_pokemon  -->  pokemon : pokemonId_1_id
```

## Testing

Most of the tests are E2E tests, which means that they are testing the whole application, including the database. For
that.

- `make test` - run all tests
