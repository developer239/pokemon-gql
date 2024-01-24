import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { authConfig, AuthConfigType } from 'src/config/auth.config'
import { User } from 'src/modules/auth/entities/user.entity'
import { AuthGqlGuard } from 'src/modules/auth/guards/auth-gql.guard'
import { MutationsResolver } from 'src/modules/auth/resolvers/mutations.resolver'
import { QueriesResolver } from 'src/modules/auth/resolvers/queries.resolver'
import { AuthService } from 'src/modules/auth/services/auth.service'
import { JwtStrategy } from 'src/modules/auth/strategies/jwt.strategy'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [authConfig.KEY],
      useFactory: (config: AuthConfigType) => ({
        secret: config.secret,
        signOptions: {
          expiresIn: config.expires,
        },
      }),
    }),
  ],
  controllers: [],
  providers: [
    AuthGqlGuard,
    AuthService,
    JwtStrategy,
    QueriesResolver,
    MutationsResolver,
  ],
  exports: [AuthService, QueriesResolver, MutationsResolver],
})
export class AuthModule {}
