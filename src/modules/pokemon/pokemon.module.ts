import { Module } from '@nestjs/common'
import { PokemonResolver } from 'src/modules/pokemon/pokemon.resolver'
import { PokemonService } from 'src/modules/pokemon/pokemon.service'

@Module({
  providers: [PokemonService, PokemonResolver],
  exports: [PokemonService, PokemonResolver],
})
export class PokemonModule {}
