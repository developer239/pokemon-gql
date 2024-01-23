import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { beforeEach, describe, it, expect, beforeAll, afterAll } from 'vitest'
import { PokemonTestingService } from 'src/modules/pokemon/entities/pokemon-testing.service'
import { PokemonModule } from 'src/modules/pokemon/pokemon.module'
import { TestingDatabaseService } from 'src/modules/testing/testing-database.service'
import { bootstrap } from 'src/modules/testing/utilities'

describe('[GraphQL] PokemonResolver', () => {
  let app: INestApplication
  let databaseService: TestingDatabaseService
  let testingEntityService: PokemonTestingService

  describe('pokemonById', () => {
    it('should return a pokemon by ID', async () => {
      // Arrange
      const result = await testingEntityService.createTestPokemon()
      const pokemonId = result.pokemon.id
      const pokemonName = result.pokemon.name

      const POKEMON_BY_ID_QUERY = `
      query pokemonById($id: ID!) {
        pokemonById(id: $id) {
          id
          name
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
      expect(response.body.data.pokemonById.id).toStrictEqual(String(pokemonId))
      expect(response.body.data.pokemonById.name).toStrictEqual(pokemonName)
    })
  })

  beforeAll(async () => {
    app = await bootstrap({
      imports: [PokemonModule],
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
