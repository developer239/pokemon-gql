import { Resolver, Args, Mutation } from '@nestjs/graphql'
import {
  LoginInput,
  LoginOutput,
  RegisterInput,
} from 'src/modules/auth/auth.types'
import { User } from 'src/modules/auth/entities/user.entity'
import { AuthService } from 'src/modules/auth/services/auth.service'

@Resolver(() => User)
export class MutationsResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginOutput)
  login(@Args('input') input: LoginInput) {
    return this.authService.login(input)
  }

  @Mutation(() => User)
  register(@Args('input') input: RegisterInput) {
    return this.authService.register(input)
  }
}
