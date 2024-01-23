import { INestApplication } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DataSource } from 'typeorm'
import { SeedModule } from 'src/modules/database/seeds/seeed.module'

const clearDatabase = async (app: INestApplication) => {
  const dataSource = app.get(DataSource)
  const entities = dataSource.entityMetadatas
  await Promise.all(
    entities.map(async (entity) => {
      const repository = dataSource.getRepository(entity.name)
      await repository.query(
        `TRUNCATE TABLE "${entity.tableName}" RESTART IDENTITY CASCADE`
      )
    })
  )
}

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule)

  await clearDatabase(app)

  await app.close()
}

void runSeed()
