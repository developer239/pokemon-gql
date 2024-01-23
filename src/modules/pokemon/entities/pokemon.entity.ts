import { Field, ID, ObjectType } from '@nestjs/graphql'
import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm'
import { EvolutionRequirement } from 'src/modules/pokemon/entities/evolution-requirement.enity'
import { PokemonAttack } from 'src/modules/pokemon/entities/pokemon-attack.entity'
import { Dimension, Evolution } from 'src/modules/pokemon/pokemon.types'
import { BaseEntity } from 'src/utils/base.entity'
import { RangeTransformer } from 'src/utils/range.transformer'

@Entity()
@ObjectType()
export class Pokemon extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column({
    unique: true,
  })
  number: number

  @Field()
  @Index()
  @Column()
  name: string

  @Field()
  @Column()
  classification: string

  @Field(() => [String])
  @Column('simple-array')
  types: string[]

  @Field(() => [String])
  @Column('simple-array')
  resistant: string[]

  @Field(() => [String])
  @Column('simple-array')
  weaknesses: string[]

  @Field(() => Dimension)
  @Column('numrange', {
    transformer: new RangeTransformer(),
  })
  weightRange: { minimum: number; maximum: number }

  @Field(() => Dimension)
  @Column('numrange', {
    transformer: new RangeTransformer(),
  })
  heightRange: { minimum: number; maximum: number }

  @Field()
  @Column('float')
  fleeRate: number

  @Field()
  @Column()
  maxCP: number

  @Field()
  @Column()
  maxHP: number

  @Field()
  @Column('boolean')
  isFavorite: boolean

  @Field(() => [PokemonAttack])
  @OneToMany(() => PokemonAttack, (attack) => attack.pokemon, { cascade: true })
  attacks: Relation<PokemonAttack>[]

  @Field(() => EvolutionRequirement)
  @OneToOne(
    () => EvolutionRequirement,
    (evolutionRequirement) => evolutionRequirement.pokemon,
    { cascade: true }
  )
  evolutionRequirements: Relation<EvolutionRequirement>

  @Field(() => [Evolution])
  @ManyToMany(() => Pokemon, { cascade: true })
  @JoinTable()
  evolutions: Pokemon[]
}
