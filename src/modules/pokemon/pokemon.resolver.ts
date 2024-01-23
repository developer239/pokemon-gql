import { Resolver, Query, Field, ObjectType } from '@nestjs/graphql'
import { PokemonService } from 'src/modules/pokemon/pokemon.service'

@ObjectType()
class Pokemon {
  @Field()
  name: string
}

@Resolver(() => Pokemon)
export class PokemonResolver {
  constructor(private readonly pokemonService: PokemonService) {}

  @Query(() => [Pokemon])
  events() {
    return this.pokemonService.findAll()
  }
}
