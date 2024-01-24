/* eslint-disable @typescript-eslint/no-unused-vars */
import { ArgumentsHost, Catch } from '@nestjs/common'
import { GqlExceptionFilter } from '@nestjs/graphql'

@Catch()
export class GqlErrorFilter implements GqlExceptionFilter {
  catch(exception: unknown, _: ArgumentsHost | null) {
    const castedException = exception as {
      extensions: {
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
      return {
        message: castedException.extensions?.originalError?.message,
      }
    }

    return {
      message: 'Internal Server Error',
    }
  }
}
