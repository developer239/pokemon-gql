import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from 'src/app.module'
import { appConfig, AppConfigType } from 'src/config/app.config'

import 'src/modules/database/seeds/run-seed'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })

  const appConfigValues = app.get<AppConfigType>(appConfig.KEY)

  app.enableShutdownHooks()

  await app.listen(appConfigValues.port)
  Logger.log(
    `\x1b[34m Running on: http://localhost:${appConfigValues.port}/graphql \x1b[34m`,
    'NestApplication'
  )
}

void bootstrap()
