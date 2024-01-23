import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Attack } from 'src/modules/pokemon/entities/attack.entity'
import { EvolutionRequirement } from 'src/modules/pokemon/entities/evolution-requirement.enity'
import { Pokemon } from 'src/modules/pokemon/entities/pokemon.entity'
import { PokemonResolver } from 'src/modules/pokemon/pokemon.resolver'
import { PokemonService } from 'src/modules/pokemon/pokemon.service'

@Module({
  imports: [TypeOrmModule.forFeature([Pokemon, Attack, EvolutionRequirement])],
  providers: [PokemonService, PokemonResolver],
  exports: [PokemonService, PokemonResolver],
})
export class PokemonModule {}
