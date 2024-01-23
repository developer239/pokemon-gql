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

@Entity()
export class EvolutionRequirement extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  amount: number

  @Column()
  name: string

  @OneToOne(() => Pokemon, (pokemon) => pokemon.evolutionRequirements)
  @JoinColumn()
  pokemon: Relation<Pokemon>
}
