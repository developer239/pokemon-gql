import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Relation,
} from 'typeorm'
import { Pokemon } from 'src/modules/pokemon/entities/pokemon.entity'
import { EntityHelper } from 'src/utils/entity-helper'

@Entity()
export class PokemonAttack extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  type: string

  @Column()
  damage: number

  @ManyToOne(() => Pokemon, (pokemon) => pokemon.attacks)
  pokemon: Relation<Pokemon>
}
