import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from 'src/modules/auth/entities/user.entity'
import { ISeedService } from 'src/modules/database/seeds/services/seed.types'

@Injectable()
export class AuthSeedService implements ISeedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async run() {
    const email = 'michal@email.com'
    // TODO: init user Entity so that it hashes the password
    const password =
      '$2b$10$1XDVF7aBPMq3aPZAOqzYWukjYk7rtKDySXLo9KR5QhggIkL2PDRmq'
    await this.userRepository.save({
      email,
      password,
    })
    Logger.log(`Created user with email: ${email} and password: ${password}`)
  }
}
