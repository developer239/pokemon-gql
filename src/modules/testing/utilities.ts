import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { INestApplication } from '@nestjs/common'
import { ModuleMetadata } from '@nestjs/common/interfaces'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { Test } from '@nestjs/testing'
import * as Joi from 'joi'
import { appConfig, appConfigSchema } from 'src/config/app.config'
import { authConfig, authConfigSchema } from 'src/config/auth.config'
import {
  databaseConfig,
  databaseConfigSchema,
} from 'src/config/database.config'
import { DatabaseModule } from 'src/modules/database/database.module'
import { TestingModule } from 'src/modules/testing/testing.module'

export const bootstrap = async (
  metadata: ModuleMetadata
): Promise<INestApplication> => {
  const module = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        load: [databaseConfig, appConfig, authConfig],
        envFilePath: ['.env.test', '.env'],
        validationSchema: Joi.object({
          ...appConfigSchema,
          ...databaseConfigSchema,
          ...authConfigSchema,
        }),
      }),
      GraphQLModule.forRoot<ApolloDriverConfig>({
        driver: ApolloDriver,
        autoSchemaFile: true,
        playground: true,
        introspection: true,
      }),
      DatabaseModule,
      TestingModule,
      ...(metadata.imports || []),
    ],
    controllers: metadata.controllers || [],
    providers: metadata.providers || [],
    exports: metadata.exports || [],
  }).compile()

  const app = module.createNestApplication()
  await app.init()

  return app
}
