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

@Entity()
export class Pokemon extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    unique: true,
  })
  number: number

  @Index()
  @Column()
  name: string

  @Column()
  classification: string

  @Column('simple-array')
  types: string[]

  @Column('simple-array')
  resistant: string[]

  @Column('simple-array')
  weaknesses: string[]

  @Column('numrange', {
    transformer: new RangeTransformer(),
  })
  weightRange: { minimum: number; maximum: number }

  @Column('numrange', {
    transformer: new RangeTransformer(),
  })
  heightRange: { minimum: number; maximum: number }

  @Column('float')
  fleeRate: number

  @Column()
  maxCP: number

  @Column()
  maxHP: number

  @Column('boolean')
  isFavorite: boolean

  @OneToMany(() => PokemonAttack, (attack) => attack.pokemon, { cascade: true })
  attacks: Relation<PokemonAttack>[]

  @OneToOne(
    () => EvolutionRequirement,
    (evolutionRequirement) => evolutionRequirement.pokemon,
    { cascade: true }
  )
  @JoinColumn()
  evolutionRequirements: Relation<EvolutionRequirement>

  @ManyToMany(() => Pokemon, { cascade: true })
  @JoinTable()
  evolutions: Relation<Pokemon>[]
}
