import { Field, ID, ObjectType } from '@nestjs/graphql'
import * as bcrypt from 'bcrypt'
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  JoinTable,
  ManyToMany,
  Relation,
} from 'typeorm'
import { Pokemon } from 'src/modules/pokemon/entities/pokemon.entity'
import { BaseEntity } from 'src/utils/base.entity'

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column({ unique: true })
  email: string

  @Column() password: string

  @ManyToMany(() => Pokemon, (pokemon) => pokemon.favoritedBy, {
    cascade: true,
  })
  @JoinTable()
  favoritePokemons: Relation<Pokemon>[]

  @BeforeInsert()
  @BeforeUpdate()
  async setPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt()
      this.password = await bcrypt.hash(this.password, salt)
    }
  }
}
