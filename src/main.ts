import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from 'src/app.module'
import { appConfig, AppConfigType } from 'src/config/app.config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })

  const appConfigValues = app.get<AppConfigType>(appConfig.KEY)

  app.enableShutdownHooks()

  await app.listen(appConfigValues.port)
  Logger.log(`Running on port: ${appConfigValues.port}`, 'NestApplication')
}

void bootstrap()
