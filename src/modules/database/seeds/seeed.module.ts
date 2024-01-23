import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { appConfig } from 'src/config/app.config'
import { databaseConfig } from 'src/config/database.config'
import { TypeOrmConfigService } from 'src/modules/database/typeorm-config.service'
import { EvolutionRequirement } from 'src/modules/pokemon/entities/evolution-requirement.enity'
import { PokemonAttack } from 'src/modules/pokemon/entities/pokemon-attack.entity'
import { Pokemon } from 'src/modules/pokemon/entities/pokemon.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Pokemon, PokemonAttack, EvolutionRequirement]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: (options) => {
        if (!options) {
          throw new Error('No options provided to TypeOrmModule.forRootAsync')
        }

        return new DataSource(options).initialize()
      },
    }),
  ],
})
export class SeedModule {}
