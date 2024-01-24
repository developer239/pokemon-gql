import { InputType, Field, ObjectType } from '@nestjs/graphql'
import { User } from 'src/modules/auth/entities/user.entity'

@InputType()
export class LoginInput {
  @Field()
  email: string

  @Field({ nullable: true })
  password: string
}

@ObjectType()
export class LoginOutput {
  @Field()
  accessToken: string

  @Field(() => User)
  user: User
}

@InputType()
export class RegisterInput {
  @Field()
  email: string

  @Field({ nullable: true })
  password: string
}
