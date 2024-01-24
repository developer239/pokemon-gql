import { Module } from '@nestjs/common'
import { UserTestingService } from 'src/modules/auth/services/user-testing.service'
import { PokemonTestingService } from 'src/modules/pokemon/services/pokemon-testing.service'
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
