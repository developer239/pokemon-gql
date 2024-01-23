import { Field, ID, ObjectType } from '@nestjs/graphql'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Relation,
} from 'typeorm'
import { Pokemon } from 'src/modules/pokemon/entities/pokemon.entity'
import { EntityHelper } from 'src/utils/entity-helper'

@ObjectType()
@Entity()
export class PokemonAttack extends EntityHelper {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column()
  name: string

  @Field()
  @Column()
  type: string

  @Field()
  @Column()
  damage: number

  @Field(() => Pokemon)
  @ManyToOne(() => Pokemon, (pokemon) => pokemon.attacks)
  pokemon: Relation<Pokemon>
}
