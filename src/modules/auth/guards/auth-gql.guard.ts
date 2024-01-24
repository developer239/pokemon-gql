import { Injectable, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'
import { IS_PUBLIC_KEY } from 'src/modules/auth/decorators/public.decorator'

@Injectable()
export class AuthGqlGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super()
  }

  async canActivate(context: ExecutionContext) {
    try {
      // authorize user
      const result = await super.canActivate(context)
      return result
    } catch (error) {
      // if user is not authorized, check if the route is public
      const isPublic = this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [context.getHandler(), context.getClass()]
      )

      // authorize user
      if (isPublic) {
        return true as any
      }

      throw error
    }
  }

  getRequest(context: ExecutionContext) {
    return GqlExecutionContext.create(context).getContext().req
  }
}
