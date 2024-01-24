import { ParseIntPipe } from '@nestjs/common'
import {
  Resolver,
  Query,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql'
import { Attack } from 'src/modules/pokemon/entities/attack.entity'
import { EvolutionRequirement } from 'src/modules/pokemon/entities/evolution-requirement.enity'
import { Pokemon } from 'src/modules/pokemon/entities/pokemon.entity'
import {
  PokemonList,
  PokemonsQueryInput,
} from 'src/modules/pokemon/pokemon.types'
import { LoaderService } from 'src/modules/pokemon/services/loader.service'
import { PokemonService } from 'src/modules/pokemon/services/pokemon.service'

@Resolver(() => Pokemon)
export class QueriesResolver {
  constructor(
    private readonly pokemonService: PokemonService,
    private readonly pokemonLoaderService: LoaderService
  ) {}

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

  @ResolveField(() => [Attack])
  attacks(@Parent() pokemon: Pokemon): Promise<Attack[]> {
    return this.pokemonLoaderService.getAttackLoader().load(pokemon.id)
  }

  @ResolveField(() => EvolutionRequirement)
  evolutionRequirements(
    @Parent() pokemon: Pokemon
  ): Promise<EvolutionRequirement> {
    return this.pokemonService.findEvolutionRequirementsByPokemonId(pokemon.id)
  }

  // TODO: write test for recursive query
  @ResolveField(() => [Pokemon])
  evolutions(@Parent() pokemon: Pokemon): Promise<Pokemon[]> {
    return this.pokemonLoaderService.getEvolutionLoader().load(pokemon.id)
  }
}
