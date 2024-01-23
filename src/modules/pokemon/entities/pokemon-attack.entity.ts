import { Field, ID, ObjectType } from '@nestjs/graphql'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Relation,
} from 'typeorm'
import { Pokemon } from 'src/modules/pokemon/entities/pokemon.entity'
import { BaseEntity } from 'src/utils/base.entity'

@ObjectType()
@Entity()
export class PokemonAttack extends BaseEntity {
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
