import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Relation,
  ManyToMany,
} from 'typeorm'
import { Pokemon } from 'src/modules/pokemon/entities/pokemon.entity'
import { BaseEntity } from 'src/utils/base.entity'

export enum AttackCategory {
  FAST = 'fast',
  SPECIAL = 'special',
}

registerEnumType(AttackCategory, {
  name: 'AttackCategory',
})

@ObjectType()
@Entity()
export class Attack extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column()
  name: string

  @Field()
  @Column()
  type: string

  @Field(() => AttackCategory)
  @Column({
    type: 'enum',
    enum: AttackCategory,
  })
  category: AttackCategory

  @Field()
  @Column()
  damage: number

  @ManyToMany(() => Pokemon, (pokemon) => pokemon.attacks)
  pokemons: Relation<Pokemon>[]
}
