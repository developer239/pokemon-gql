import { Field, ID, ObjectType } from '@nestjs/graphql'
import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm'
import { User } from 'src/modules/auth/entities/user.entity'
import { Attack } from 'src/modules/pokemon/entities/attack.entity'
import { EvolutionRequirement } from 'src/modules/pokemon/entities/evolution-requirement.enity'
import { Dimension } from 'src/modules/pokemon/pokemon.types'
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

  @ManyToMany(() => User, (user) => user.favoritePokemons)
  favoritedBy: Relation<User>[]

  @ManyToMany(() => Attack, (attack) => attack.pokemons, { cascade: true })
  @JoinTable()
  attacks: Relation<Attack>[]

  @Field(() => EvolutionRequirement)
  @OneToOne(
    () => EvolutionRequirement,
    (evolutionRequirement) => evolutionRequirement.pokemon,
    { cascade: true }
  )
  evolutionRequirements: Relation<EvolutionRequirement>

  @Field(() => [Pokemon])
  @ManyToMany(() => Pokemon, { cascade: true })
  @JoinTable()
  evolutions: Relation<Pokemon>[]
}
