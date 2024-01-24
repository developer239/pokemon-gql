import { ParseIntPipe, UseGuards } from '@nestjs/common'
import { Resolver, Args, Mutation, ID } from '@nestjs/graphql'
import { GetUserPayload } from 'src/modules/auth/decorators/user.decorator'
import { User } from 'src/modules/auth/entities/user.entity'
import { AuthGqlGuard } from 'src/modules/auth/guards/auth-gql.guard'
import { Pokemon } from 'src/modules/pokemon/entities/pokemon.entity'
import { PokemonService } from 'src/modules/pokemon/services/pokemon.service'

@Resolver(() => Pokemon)
export class MutationsResolver {
  constructor(private readonly pokemonService: PokemonService) {}

  @UseGuards(AuthGqlGuard)
  @Mutation(() => Pokemon)
  addFavorite(
    @Args('id', { type: () => ID }, ParseIntPipe) id: number,
    @GetUserPayload() user?: User
  ) {
    return this.pokemonService.addFavorite(id, user)
  }

  @UseGuards(AuthGqlGuard)
  @Mutation(() => Pokemon)
  removeFavorite(
    @Args('id', { type: () => ID }, ParseIntPipe) id: number,
    @GetUserPayload() user?: User
  ) {
    return this.pokemonService.removeFavorite(id, user)
  }
}
