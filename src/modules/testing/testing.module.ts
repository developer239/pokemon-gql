import { Module } from '@nestjs/common'
import { UserTestingService } from 'src/modules/auth/entities/user-testing.service'
import { PokemonTestingService } from 'src/modules/pokemon/entities/pokemon-testing.service'
import { TestingDatabaseService } from 'src/modules/testing/testing-database.service'
import { TestingEntityService } from 'src/modules/testing/testing-entity.service'

@Module({
  imports: [],
  providers: [
    TestingEntityService,
    TestingDatabaseService,
    PokemonTestingService,
    UserTestingService,
  ],
  exports: [TestingEntityService, TestingDatabaseService, UserTestingService],
})
export class TestingModule {}
