import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import * as Joi from 'joi'
import { appConfig, appConfigSchema } from 'src/config/app.config'
import { authConfig, authConfigSchema } from 'src/config/auth.config'
import {
  databaseConfig,
  databaseConfigSchema,
} from 'src/config/database.config'
import { AuthModule } from 'src/modules/auth/auth.module'
import { DatabaseModule } from 'src/modules/database/database.module'
import { HomeModule } from 'src/modules/home/home.module'
import { PokemonModule } from 'src/modules/pokemon/pokemon.module'
import { ApolloComplexityPlugin } from 'src/utils/apollo-complexity.plugin'
import { GqlErrorFilter } from 'src/utils/gql-error.filter'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig, databaseConfig, authConfig],
      validationSchema: Joi.object({
        ...appConfigSchema,
        ...databaseConfigSchema,
        ...authConfigSchema,
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: true,
      introspection: true,
      plugins: [new ApolloComplexityPlugin(50)],
      formatError: (error) => {
        const gqlFilter = new GqlErrorFilter()
        return gqlFilter.catch(error, null)
      },
      context: ({ req, res }) => ({ req, res }),
    }),
    DatabaseModule,
    HomeModule,
    PokemonModule,
    AuthModule,
  ],
})
export class AppModule {}
