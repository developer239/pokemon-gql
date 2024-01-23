import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EvolutionRequirement } from 'src/modules/pokemon/entities/evolution-requirement.enity'
import { PokemonAttack } from 'src/modules/pokemon/entities/pokemon-attack.entity'
import { Pokemon } from 'src/modules/pokemon/entities/pokemon.entity'
import { PokemonResolver } from 'src/modules/pokemon/pokemon.resolver'
import { PokemonService } from 'src/modules/pokemon/pokemon.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Pokemon, PokemonAttack, EvolutionRequirement]),
  ],
  providers: [PokemonService, PokemonResolver],
  exports: [PokemonService, PokemonResolver],
})
export class PokemonModule {}
