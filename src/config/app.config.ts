import { ConfigType, registerAs } from '@nestjs/config'
import * as Joi from 'joi'

export const appConfigSchema = {
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  APP_NAME: Joi.string().required(),
  PORT: Joi.number().port().required(),
}

export const appConfig = registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV,
  name: process.env.APP_NAME,
  workingDirectory: process.env.PWD || process.cwd(),
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 8080,
}))

export type AppConfigType = ConfigType<typeof appConfig>
