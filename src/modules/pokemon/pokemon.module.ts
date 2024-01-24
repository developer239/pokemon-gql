import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Attack } from 'src/modules/pokemon/entities/attack.entity'
import { EvolutionRequirement } from 'src/modules/pokemon/entities/evolution-requirement.enity'
import { Pokemon } from 'src/modules/pokemon/entities/pokemon.entity'
import { MutationsResolver } from 'src/modules/pokemon/resolvers/mutations.resolver'
import { QueriesResolver } from 'src/modules/pokemon/resolvers/queries.resolver'
import { LoaderService } from 'src/modules/pokemon/services/loader.service'
import { PokemonService } from 'src/modules/pokemon/services/pokemon.service'

@Module({
  imports: [TypeOrmModule.forFeature([Pokemon, Attack, EvolutionRequirement])],
  providers: [
    PokemonService,
    QueriesResolver,
    MutationsResolver,
    LoaderService,
  ],
  exports: [PokemonService, QueriesResolver, MutationsResolver, LoaderService],
})
export class PokemonModule {}
