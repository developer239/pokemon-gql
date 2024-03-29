import { InputType, Field, Int, ObjectType } from '@nestjs/graphql'
import { Pokemon } from 'src/modules/pokemon/entities/pokemon.entity'

@ObjectType()
export class Dimension {
  @Field()
  minimum: number

  @Field()
  maximum: number
}

@InputType()
export class PokemonsQueryInput {
  @Field(() => Int, { defaultValue: 10 })
  limit: number

  @Field(() => Int, { defaultValue: 0 })
  offset: number

  @Field({ nullable: true })
  search: string

  @Field({ nullable: true })
  type: string

  @Field({ nullable: true })
  isFavorite: boolean
}

@ObjectType()
export class PokemonList {
  @Field(() => Int)
  limit: number

  @Field(() => Int)
  offset: number

  @Field(() => Int)
  count: number

  @Field(() => [Pokemon])
  items: Pokemon[]
}
