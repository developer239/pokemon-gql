import { Field, ID, ObjectType } from '@nestjs/graphql'
import * as bcrypt from 'bcrypt'
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm'
import { BaseEntity } from 'src/utils/base.entity'

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column({ unique: true, nullable: true })
  email: string

  @Column({ nullable: true }) password: string

  @BeforeInsert()
  @BeforeUpdate()
  async setPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt()
      this.password = await bcrypt.hash(this.password, salt)
    }
  }
}
