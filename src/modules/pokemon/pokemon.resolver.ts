import { ParseIntPipe } from '@nestjs/common'
import {
  Resolver,
  Query,
  Args,
  Mutation,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql'
import { Attack } from 'src/modules/pokemon/entities/attack.entity'
import { EvolutionRequirement } from 'src/modules/pokemon/entities/evolution-requirement.enity'
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
  pokemonByName(@Args('name') name: string) {
    return this.pokemonService.findByName(name)
  }

  @Query(() => Pokemon)
  pokemonById(@Args('id', { type: () => ID }, ParseIntPipe) id: number) {
    return this.pokemonService.findById(id)
  }

  @Query(() => [String])
  pokemonTypes(): Promise<string[]> {
    return this.pokemonService.findAllTypes()
  }

  @Query(() => PokemonList)
  async pokemons(@Args('query') query: PokemonsQueryInput) {
    const { items, count } = await this.pokemonService.findAll(query)

    return {
      limit: query.limit,
      offset: query.offset,
      count,
      items,
    }
  }

  @Mutation(() => Pokemon)
  addFavorite(@Args('id') id: number) {
    return this.pokemonService.addFavorite(id)
  }

  @Mutation(() => Pokemon)
  removeFavorite(@Args('id') id: number) {
    return this.pokemonService.removeFavorite(id)
  }

  @ResolveField(() => [Attack])
  attacks(@Parent() pokemon: Pokemon): Promise<Attack[]> {
    return this.pokemonService.findAttacksByPokemonId(pokemon.id)
  }

  @ResolveField(() => EvolutionRequirement)
  evolutionRequirements(
    @Parent() pokemon: Pokemon
  ): Promise<EvolutionRequirement> {
    return this.pokemonService.findEvolutionRequirementsByPokemonId(pokemon.id)
  }
}
