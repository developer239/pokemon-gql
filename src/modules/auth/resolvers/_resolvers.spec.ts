/* eslint-disable max-lines-per-function, max-lines */
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import request from 'supertest'
import { expect, beforeEach, describe, it, beforeAll, afterAll } from 'vitest'
import { AuthModule } from 'src/modules/auth/auth.module'
import { UserTestingService } from 'src/modules/auth/entities/user-testing.service'
import { PokemonModule } from 'src/modules/pokemon/pokemon.module'
import { TestingDatabaseService } from 'src/modules/testing/testing-database.service'
import { bootstrap } from 'src/modules/testing/utilities'

describe('Auth', () => {
  let app: INestApplication
  let databaseService: TestingDatabaseService
  let testingEntityService: UserTestingService
  let jwtService: JwtService

  describe('Queries', () => {
    describe('[resolver] me', () => {
      const ME_QUERY = `
      query {
        me {
          id
          email
        }
      }
    `

      it('should return a unauthorized', async () => {
        // Arrange

        // Act
        const server = app.getHttpServer()
        const response = await request(server)
          .post('/graphql')
          .send({
            query: ME_QUERY,
          })
          .set('Content-Type', 'application/json')

        // Assert
        expect(response.body).toMatchObject({
          errors: [
            {
              message: 'Unauthorized',
            },
          ],
          data: null,
        })
      })

      describe('when Bearer token provided', () => {
        it('should return a user', async () => {
          // Arrange
          const { user, accessToken } =
            await testingEntityService.createAuthenticatedUser(jwtService)

          // Act
          const server = app.getHttpServer()
          const response = await request(server)
            .post('/graphql')
            .send({
              query: ME_QUERY,
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`)

          // Assert
          expect(response.body).toStrictEqual({
            data: {
              me: {
                email: user.email,
                id: String(user.id),
              },
            },
          })
        })
      })
    })
  })

  describe.todo('Mutations', () => {
    describe.todo('[resolver] login', () => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      it.todo('should log user in', async () => {})
    })

    describe.todo('[resolver] removeFavorite', () => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      it.todo('should register user', async () => {})
    })
  })

  beforeAll(async () => {
    app = await bootstrap({
      imports: [PokemonModule, AuthModule],
    })

    databaseService = app.get(TestingDatabaseService)
    testingEntityService = app.get(UserTestingService)
    jwtService = app.get(JwtService)
  })

  beforeEach(async () => {
    await databaseService.clearDb()
  })

  afterAll(async () => {
    await app.close()
  })
})
