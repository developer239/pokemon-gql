import { Resolver, Query, Args, Mutation } from '@nestjs/graphql'
import { Pokemon } from 'src/modules/pokemon/entities/pokemon.entity'
import { PokemonService } from 'src/modules/pokemon/pokemon.service'
import {
  PokemonList,
  PokemonsQueryInput,
} from 'src/modules/pokemon/pokemon.types'

@Resolver(() => Pokemon)
export class PokemonResolver {
  constructor(private readonly pokemonService: PokemonService) {}

  @Query(() => Pokemon)
  pokemonByName(@Args('name') name: string): Promise<Pokemon | undefined> {
    return this.pokemonService.findByName(name)
  }

  @Query(() => Pokemon)
  pokemonById(@Args('id') id: number): Promise<Pokemon | undefined> {
    return this.pokemonService.findById(id)
  }

  @Query(() => [String])
  pokemonTypes(): Promise<string[]> {
    return this.pokemonService.findAllTypes()
  }

  @Query(() => PokemonList)
  async pokemons(
    @Args('query') query: PokemonsQueryInput
  ): Promise<PokemonList> {
    const { pokemons, count } = await this.pokemonService.findAll(query)
    return {
      limit: query.limit,
      offset: query.offset,
      count,
      items: pokemons,
    }
  }

  @Mutation(() => Pokemon)
  addFavorite(@Args('id') id: number): Promise<Pokemon> {
    return this.pokemonService.addFavorite(id)
  }

  @Mutation(() => Pokemon)
  removeFavorite(@Args('id') id: number): Promise<Pokemon> {
    return this.pokemonService.removeFavorite(id)
  }
}
