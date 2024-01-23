import { Module } from '@nestjs/common'
import { PokemonTestingService } from 'src/modules/pokemon/entities/pokemon-testing.service'
import { TestingDatabaseService } from 'src/modules/testing/testing-database.service'
import { TestingEntityService } from 'src/modules/testing/testing-entity.service'

@Module({
  imports: [],
  providers: [
    TestingEntityService,
    TestingDatabaseService,
    PokemonTestingService,
  ],
  exports: [TestingEntityService, TestingDatabaseService],
})
export class TestingModule {}
