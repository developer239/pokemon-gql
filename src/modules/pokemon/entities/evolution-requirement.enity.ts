import { Field, ID, ObjectType } from '@nestjs/graphql'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Relation,
} from 'typeorm'
import { Pokemon } from 'src/modules/pokemon/entities/pokemon.entity'
import { BaseEntity } from 'src/utils/base.entity'

@ObjectType()
@Entity()
export class EvolutionRequirement extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column()
  amount: number

  @Field()
  @Column()
  name: string

  @OneToOne(() => Pokemon, (pokemon) => pokemon.evolutionRequirements)
  @JoinColumn()
  pokemon: Relation<Pokemon>
}
