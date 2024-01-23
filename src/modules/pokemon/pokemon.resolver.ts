import { Resolver, Query } from '@nestjs/graphql'
import { Pokemon } from 'src/modules/pokemon/entities/pokemon.entity'
import { PokemonService } from 'src/modules/pokemon/pokemon.service'

@Resolver(() => Pokemon)
export class PokemonResolver {
  constructor(private readonly pokemonService: PokemonService) {}

  @Query(() => [Pokemon])
  pokemons() {
    return this.pokemonService.findAll()
  }
}
