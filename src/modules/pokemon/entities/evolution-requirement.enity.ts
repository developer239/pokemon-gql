import { Field, ObjectType } from '@nestjs/graphql'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Relation,
} from 'typeorm'
import { Pokemon } from 'src/modules/pokemon/entities/pokemon.entity'
import { EntityHelper } from 'src/utils/entity-helper'

@ObjectType()
@Entity()
export class EvolutionRequirement extends EntityHelper {
  @Field()
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column()
  amount: number

  @Field()
  @Column()
  name: string

  @Field(() => Pokemon)
  @OneToOne(() => Pokemon, (pokemon) => pokemon.evolutionRequirements)
  @JoinColumn()
  pokemon: Relation<Pokemon>
}
