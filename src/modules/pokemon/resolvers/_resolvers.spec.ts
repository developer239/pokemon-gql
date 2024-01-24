/* eslint-disable max-lines-per-function, max-lines */
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { beforeEach, describe, it, expect, beforeAll, afterAll } from 'vitest'
import { AuthModule } from 'src/modules/auth/auth.module'
import { PokemonTestingService } from 'src/modules/pokemon/entities/pokemon-testing.service'
import { PokemonModule } from 'src/modules/pokemon/pokemon.module'
import { TestingDatabaseService } from 'src/modules/testing/testing-database.service'
import { bootstrap } from 'src/modules/testing/utilities'

describe('Pokemons', () => {
  let app: INestApplication
  let databaseService: TestingDatabaseService
  let testingEntityService: PokemonTestingService

  describe('Queries', () => {
    describe('[resolver] pokemons', () => {
      const POKEMONS_QUERY = `
      query pokemons($query: PokemonsQueryInput!) {
        pokemons(query: $query) {
          items {
            id
            name
          }
          count
        }
      }
    `

      it('should return a list of pokemons', async () => {
        // Arrange
        await testingEntityService.createTestPokemonCount(5)

        const queryVariables = {
          query: {
            limit: 10,
            offset: 0,
          },
        }

        // Act
        const server = app.getHttpServer()
        const response = await request(server)
          .post('/graphql')
          .send({
            query: POKEMONS_QUERY,
            variables: queryVariables,
          })
          .set('Content-Type', 'application/json')

        // Assert
        expect(response.status).toBe(200)
        expect(response.body.data.pokemons.items).toBeInstanceOf(Array)
        expect(response.body.data.pokemons.count).toBeGreaterThanOrEqual(5)
      })

      describe('when limit and offset provided', () => {
        it('should return a list of pokemons with the provided limit and offset', async () => {
          // Arrange
          await testingEntityService.createTestPokemonCount(10)

          const queryVariables = {
            query: {
              limit: 5,
              offset: 2,
            },
          }

          // Act
          const server = app.getHttpServer()
          const response = await request(server)
            .post('/graphql')
            .send({
              query: POKEMONS_QUERY,
              variables: queryVariables,
            })
            .set('Content-Type', 'application/json')

          // Assert
          expect(response.status).toBe(200)
          expect(response.body.data.pokemons.items).toHaveLength(5)
        })

        describe('when offset and limit is greater than total', () => {
          it('should return what is left', async () => {
            // Arrange
            await testingEntityService.createTestPokemonCount(10)

            const queryVariables = {
              query: {
                limit: 5,
                offset: 7,
              },
            }

            // Act
            const server = app.getHttpServer()
            const response = await request(server)
              .post('/graphql')
              .send({
                query: POKEMONS_QUERY,
                variables: queryVariables,
              })
              .set('Content-Type', 'application/json')

            // Assert
            expect(response.status).toBe(200)
            expect(response.body.data.pokemons.items).toHaveLength(3)
          })
        })
      })

      describe('when search query provided', () => {
        it('should return a list of pokemons that match the search query', async () => {
          // Arrange
          await testingEntityService.createTestPokemon()
          const pokemon1 = await testingEntityService.createTestPokemon({
            name: '123pokemon1',
          })
          await testingEntityService.createTestPokemon()
          await testingEntityService.createTestPokemon()

          const pokemonToSearch = pokemon1.pokemon
          const pokemonNameToSearch = '23pokemon'

          const queryVariables = {
            query: {
              limit: 10,
              offset: 0,
              search: pokemonNameToSearch,
            },
          }

          // Act
          const server = app.getHttpServer()
          const response = await request(server)
            .post('/graphql')
            .send({
              query: POKEMONS_QUERY,
              variables: queryVariables,
            })
            .set('Content-Type', 'application/json')

          // Assert
          expect(response.status).toBe(200)
          expect(response.body.data.pokemons.items[0].id).toStrictEqual(
            String(pokemonToSearch.id)
          )
          expect(response.body.data.pokemons.items[0].name).toStrictEqual(
            pokemonToSearch.name
          )
        })
      })

      describe('when type query provided', () => {
        it('should return a list of pokemons that match the type query', async () => {
          // Arrange
          const pokemon0 = await testingEntityService.createTestPokemon({
            types: ['type0', 'type1'],
          })
          await testingEntityService.createTestPokemon({
            types: ['type1', 'type2'],
          })
          await testingEntityService.createTestPokemon({
            types: ['type2', 'type3'],
          })
          const pokemonToSearch = pokemon0.pokemon
          const pokemonTypeToSearch = 'type0'

          const queryVariables = {
            query: {
              limit: 10,
              offset: 0,
              type: pokemonTypeToSearch,
            },
          }

          // Act
          const server = app.getHttpServer()
          const response = await request(server)
            .post('/graphql')
            .send({
              query: POKEMONS_QUERY,
              variables: queryVariables,
            })
            .set('Content-Type', 'application/json')

          // Assert
          expect(response.status).toBe(200)
          expect(response.body.data.pokemons.items[0].id).toStrictEqual(
            String(pokemonToSearch.id)
          )
        })
      })

      describe.todo('when isFavorite query provided', () => {
        it.todo(
          'should return a list of pokemons that match the isFavorite query',
          // eslint-disable-next-line
          async () => {}
        )
      })

      describe('when multiple params are provided', () => {
        it('should return a list of pokemons that match the params', async () => {
          // Arrange
          const pokemon0 = await testingEntityService.createTestPokemon({
            name: '123pokemon1',
            types: ['type0', 'type1'],
          })
          await testingEntityService.createTestPokemon({
            name: '123pokemon2',
            types: ['type1', 'type2'],
          })
          await testingEntityService.createTestPokemon({
            name: '123pokemon3',
            types: ['type2', 'type3'],
          })
          const pokemonToSearch = pokemon0.pokemon
          const pokemonNameToSearch = '23pokemon'
          const pokemonTypeToSearch = 'type0'

          const queryVariables = {
            query: {
              limit: 10,
              offset: 0,
              search: pokemonNameToSearch,
              type: pokemonTypeToSearch,
            },
          }

          // Act
          const server = app.getHttpServer()
          const response = await request(server)
            .post('/graphql')
            .send({
              query: POKEMONS_QUERY,
              variables: queryVariables,
            })
            .set('Content-Type', 'application/json')

          // Assert
          expect(response.status).toBe(200)
          expect(response.body.data.pokemons.items[0].id).toStrictEqual(
            String(pokemonToSearch.id)
          )
          expect(response.body.data.pokemons.items[0].name).toStrictEqual(
            pokemonToSearch.name
          )
        })
      })
    })

    describe('[resolver] pokemonById', () => {
      it('should return a pokemon by ID', async () => {
        // Arrange
        const result = await testingEntityService.createTestPokemon()
        const pokemonId = result.pokemon.id
        const pokemonName = result.pokemon.name

        const POKEMON_BY_ID_QUERY = `
      query pokemonById($id: ID!) {
        pokemonById(id: $id) {
          id
          number
          name
          classification
          types
          resistant
          weaknesses
          weightRange {
            minimum
            maximum
          }
          heightRange {
            minimum
            maximum
          }
          fleeRate
          maxCP
          maxHP
          attacks {
            id
            name
            type
            category
            damage
          }
          evolutionRequirements {
            id
            amount
            name
          }
        }
      }
    `

        // Act
        const server = app.getHttpServer()
        const response = await request(server)
          .post('/graphql')
          .send({
            query: POKEMON_BY_ID_QUERY,
            variables: { id: pokemonId },
          })
          .set('Content-Type', 'application/json')

        // Assert
        expect(response.status).toBe(200)
        expect(response.body.data.pokemonById.id).toStrictEqual(
          String(pokemonId)
        )
        expect(response.body.data.pokemonById.name).toStrictEqual(pokemonName)
      })
    })

    describe('[resolver] pokemonByName', () => {
      it('should return a pokemon by name', async () => {
        // Arrange
        const result = await testingEntityService.createTestPokemon()
        const pokemonId = result.pokemon.id
        const pokemonName = result.pokemon.name

        const POKEMON_BY_NAME_QUERY = `
        query pokemonByName($name: String!) {
          pokemonByName(name: $name) {
            id
            number
            name
            classification
            types
            resistant
            weaknesses
            weightRange {
              minimum
              maximum
            }
            heightRange {
              minimum
              maximum
            }
            fleeRate
            maxCP
            maxHP
            attacks {
              id
              name
              type
              category
              damage
            }
            evolutionRequirements {
              id
              amount
              name
            }
          }
        }
      `

        // Act
        const server = app.getHttpServer()
        const response = await request(server)
          .post('/graphql')
          .send({
            query: POKEMON_BY_NAME_QUERY,
            variables: { name: pokemonName },
          })
          .set('Content-Type', 'application/json')

        // Assert
        expect(response.status).toBe(200)
        expect(response.body.data.pokemonByName.id).toStrictEqual(
          String(pokemonId)
        )
        expect(response.body.data.pokemonByName.name).toStrictEqual(pokemonName)
      })
    })

    describe('[resolver] pokemonTypes', () => {
      it('should return a pokemon types', async () => {
        // Arrange
        // create 2 test pokemons to create some types
        await testingEntityService.createTestPokemonCount(2)

        const POKEMON_TYPES_QUERY = `
        query {
          pokemonTypes
        }
      `

        // Act
        const server = app.getHttpServer()
        const response = await request(server)
          .post('/graphql')
          .send({
            query: POKEMON_TYPES_QUERY,
          })
          .set('Content-Type', 'application/json')

        // Assert
        expect(response.status).toBe(200)
        expect(response.body.data.pokemonTypes).toBeInstanceOf(Array)
      })
    })
  })

  describe.todo('Mutations', () => {
    describe.todo('[resolver] addFavorite', () => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      it.todo('should add a pokemon to favorites', async () => {})
    })

    describe.todo('[resolver] removeFavorite', () => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      it.todo('should remove a pokemon from favorites', async () => {})
    })
  })

  beforeAll(async () => {
    app = await bootstrap({
      imports: [PokemonModule, AuthModule],
    })

    databaseService = app.get(TestingDatabaseService)
    testingEntityService = app.get(PokemonTestingService)
  })

  beforeEach(async () => {
    await databaseService.clearDb()
  })

  afterAll(async () => {
    await app.close()
  })
})
