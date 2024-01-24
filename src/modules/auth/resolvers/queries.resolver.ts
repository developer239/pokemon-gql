import { UseGuards } from '@nestjs/common'
import { Resolver, Query } from '@nestjs/graphql'
import { User } from 'src/modules/auth/entities/user.entity'
import { AuthGqlGuard } from 'src/modules/auth/guards/auth-gql.guard'
import { AuthService } from 'src/modules/auth/services/auth.service'
import { GetUserPayload } from 'src/modules/auth/strategies/user.decorator'

@Resolver(() => User)
export class QueriesResolver {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGqlGuard)
  @Query(() => User)
  me(@GetUserPayload() user: User) {
    return this.authService.validateUserById(user.id)
  }
}
