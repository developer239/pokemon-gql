import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import {
  Module,
} from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_GUARD } from '@nestjs/core'
import { GraphQLModule } from "@nestjs/graphql";
import * as Joi from 'joi'
import { appConfig, appConfigSchema } from 'src/config/app.config'
import {
  databaseConfig,
  databaseConfigSchema,
} from 'src/config/database.config'
import { DatabaseModule } from 'src/modules/database/database.module'
import { HomeModule } from 'src/modules/home/home.module'
import { PokemonModule } from "src/modules/pokemon/pokemon.module";
import { HttpExceptionFilter } from 'src/utils/filters/http-exception.filter'

@Module({
  imports: [
    // TODO: throttle
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig, databaseConfig],
      validationSchema: Joi.object({
        ...appConfigSchema,
        ...databaseConfigSchema,
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: true,
      introspection: true,
    }),
    DatabaseModule,
    HomeModule,
    PokemonModule,
  ],
  providers: [
    // TODO: is this redundant? make sure that server errors are not leaked
    {
      provide: APP_FILTER,
      useValue: HttpExceptionFilter,
    },
  ],
})
export class AppModule {
}
