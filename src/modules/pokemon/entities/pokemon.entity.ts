import { Field, ObjectType } from '@nestjs/graphql'
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  ValueTransformer,
} from 'typeorm'
import { EvolutionRequirement } from 'src/modules/pokemon/entities/evolution-requirement.enity'
import { PokemonAttack } from 'src/modules/pokemon/entities/pokemon-attack.entity'
import { EntityHelper } from 'src/utils/entity-helper'

// TODO: move to separate file
export class RangeTransformer implements ValueTransformer {
  from(value: string): { minimum: number; maximum: number } {
    const regex = /\[(.*),(.*)\)/u
    const match = regex.exec(value)

    if (!match?.[1] || !match?.[2]) {
      throw new Error('Invalid range format')
    }

    return {
      minimum: parseFloat(match[1]),
      maximum: parseFloat(match[2]),
    }
  }

  to(value: { minimum: number; maximum: number }): string {
    return `[${value.minimum},${value.maximum})`
  }
}

// TODO: move to separate file
@ObjectType()
class Dimension {
  @Field()
  minimum: number

  @Field()
  maximum: number
}

@Entity()
@ObjectType()
export class Pokemon extends EntityHelper {
  @Field()
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
  @JoinColumn()
  evolutionRequirements: Relation<EvolutionRequirement>

  @Field(() => [Pokemon])
  @ManyToMany(() => Pokemon, { cascade: true })
  @JoinTable()
  evolutions: Relation<Pokemon>[]
}
