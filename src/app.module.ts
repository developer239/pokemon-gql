import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import * as Joi from 'joi'
import { appConfig, appConfigSchema } from 'src/config/app.config'
import {
  databaseConfig,
  databaseConfigSchema,
} from 'src/config/database.config'
import { DatabaseModule } from 'src/modules/database/database.module'
import { HomeModule } from 'src/modules/home/home.module'
import { PokemonModule } from 'src/modules/pokemon/pokemon.module'
import { ApolloComplexityPlugin } from 'src/utils/apollo-complexity.plugin'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig, databaseConfig],
      validationSchema: Joi.object({
        ...appConfigSchema,
        ...databaseConfigSchema,
      }),
    }),
    // TODO: throttle
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: true,
      introspection: true,
      plugins: [new ApolloComplexityPlugin(50)],
    }),
    DatabaseModule,
    HomeModule,
    PokemonModule,
  ],
})
export class AppModule {}
