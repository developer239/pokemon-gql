/* eslint-disable @typescript-eslint/no-unused-vars */
import { ArgumentsHost, Catch } from '@nestjs/common'
import { GqlExceptionFilter } from '@nestjs/graphql'

// TODO: make more robust
@Catch()
export class GqlErrorFilter implements GqlExceptionFilter {
  catch(exception: unknown, _: ArgumentsHost | null) {
    const castedException = exception as {
      extensions: {
        code?: string
        originalError:
          | {
              statusCode: number
              message: string
              error: string
            }
          | string
      }
    }

    if (typeof castedException.extensions?.originalError !== 'string') {
      if (castedException.extensions?.code === 'INTERNAL_SERVER_ERROR') {
        return {
          message: 'Internal Server Error',
        }
      }

      if (castedException.extensions?.code?.startsWith('GRAPHQL_')) {
        return castedException.extensions as unknown as {
          message: string
        }
      }

      return {
        message: castedException.extensions?.originalError?.message,
      }
    }

    return {
      message: 'Internal Server Error',
    }
  }
}
