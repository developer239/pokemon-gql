import { ParseIntPipe } from '@nestjs/common'
import { Resolver, Args, Mutation, ID } from '@nestjs/graphql'
import { Pokemon } from 'src/modules/pokemon/entities/pokemon.entity'
import { PokemonService } from 'src/modules/pokemon/services/pokemon.service'

@Resolver(() => Pokemon)
export class MutationsResolver {
  constructor(private readonly pokemonService: PokemonService) {}

  @Mutation(() => Pokemon)
  addFavorite(@Args('id', { type: () => ID }, ParseIntPipe) id: number) {
    return this.pokemonService.addFavorite(id)
  }

  @Mutation(() => Pokemon)
  removeFavorite(@Args('id', { type: () => ID }, ParseIntPipe) id: number) {
    return this.pokemonService.removeFavorite(id)
  }
}
