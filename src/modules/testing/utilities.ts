import { VersioningType } from '@nestjs/common'
import { ModuleMetadata } from '@nestjs/common/interfaces'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Test } from '@nestjs/testing'
import * as Joi from 'joi'
import { appConfig, appConfigSchema } from 'src/config/app.config'
import {
  databaseConfig,
  databaseConfigSchema,
} from 'src/config/database.config'
import { DatabaseModule } from 'src/modules/database/database.module'
import { TestingModule } from 'src/modules/testing/testing.module'

export const bootstrap = async (metadata: ModuleMetadata) => {
  const app = (
    await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [databaseConfig, appConfig],
          envFilePath: ['.env.test', '.env'],
          validationSchema: Joi.object({
            ...appConfigSchema,
            ...databaseConfigSchema,
          }),
        }),
        DatabaseModule,
        TestingModule,
        ...(metadata.imports ? metadata.imports : []),
      ],
      controllers: [...(metadata?.controllers ?? [])],
      providers: [...(metadata?.providers ?? [])],
      exports: [...(metadata?.exports ?? [])],
    }).compile()
  ).createNestApplication()

  app.setGlobalPrefix(app.get(ConfigService).get('app.apiPrefix')!, {
    exclude: ['/'],
  })
  app.enableVersioning({
    type: VersioningType.URI,
  })

  await app.init()

  return app
}
