import { MigrationInterface, QueryRunner } from 'typeorm'

export class Initial1705979032466 implements MigrationInterface {
  name = 'Initial1705979032466'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "pokemon_attack" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "type" character varying NOT NULL, "damage" integer NOT NULL, "pokemonId" integer, CONSTRAINT "PK_d569f4732ab656318858e4d7e08" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "pokemon" ("id" SERIAL NOT NULL, "number" integer NOT NULL, "name" character varying NOT NULL, "classification" character varying NOT NULL, "types" text NOT NULL, "resistant" text NOT NULL, "weaknesses" text NOT NULL, "weightRange" numrange NOT NULL, "heightRange" numrange NOT NULL, "fleeRate" double precision NOT NULL, "maxCP" integer NOT NULL, "maxHP" integer NOT NULL, "isFavorite" boolean NOT NULL, "evolutionRequirementsId" integer, CONSTRAINT "UQ_ed13cab42a9c7f966c48588e5f0" UNIQUE ("number"), CONSTRAINT "REL_d6213d2993617967df5b1ec45c" UNIQUE ("evolutionRequirementsId"), CONSTRAINT "PK_0b503db1369f46c43f8da0a6a0a" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_1cb8fc72a68e5a601312c642c8" ON "pokemon" ("name") `
    )
    await queryRunner.query(
      `CREATE TABLE "evolution_requirement" ("id" SERIAL NOT NULL, "amount" integer NOT NULL, "name" character varying NOT NULL, "pokemonId" integer, CONSTRAINT "REL_eb54d6af84755df0a6cdbed921" UNIQUE ("pokemonId"), CONSTRAINT "PK_d787a478c051421cdded8ba5581" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "pokemon_evolutions_pokemon" ("pokemonId_1" integer NOT NULL, "pokemonId_2" integer NOT NULL, CONSTRAINT "PK_ee051c029dd1b3cb9276317e08e" PRIMARY KEY ("pokemonId_1", "pokemonId_2"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_4aabae52d81ac07b00bbd1e57f" ON "pokemon_evolutions_pokemon" ("pokemonId_1") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_4a97c942e2f6c1b7a66eb68f5f" ON "pokemon_evolutions_pokemon" ("pokemonId_2") `
    )
    await queryRunner.query(
      `ALTER TABLE "pokemon_attack" ADD CONSTRAINT "FK_24cdce319724e35c7990d2be9b8" FOREIGN KEY ("pokemonId") REFERENCES "pokemon"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "pokemon" ADD CONSTRAINT "FK_d6213d2993617967df5b1ec45cf" FOREIGN KEY ("evolutionRequirementsId") REFERENCES "evolution_requirement"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "evolution_requirement" ADD CONSTRAINT "FK_eb54d6af84755df0a6cdbed9218" FOREIGN KEY ("pokemonId") REFERENCES "pokemon"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "pokemon_evolutions_pokemon" ADD CONSTRAINT "FK_4aabae52d81ac07b00bbd1e57f2" FOREIGN KEY ("pokemonId_1") REFERENCES "pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "pokemon_evolutions_pokemon" ADD CONSTRAINT "FK_4a97c942e2f6c1b7a66eb68f5fe" FOREIGN KEY ("pokemonId_2") REFERENCES "pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pokemon_evolutions_pokemon" DROP CONSTRAINT "FK_4a97c942e2f6c1b7a66eb68f5fe"`
    )
    await queryRunner.query(
      `ALTER TABLE "pokemon_evolutions_pokemon" DROP CONSTRAINT "FK_4aabae52d81ac07b00bbd1e57f2"`
    )
    await queryRunner.query(
      `ALTER TABLE "evolution_requirement" DROP CONSTRAINT "FK_eb54d6af84755df0a6cdbed9218"`
    )
    await queryRunner.query(
      `ALTER TABLE "pokemon" DROP CONSTRAINT "FK_d6213d2993617967df5b1ec45cf"`
    )
    await queryRunner.query(
      `ALTER TABLE "pokemon_attack" DROP CONSTRAINT "FK_24cdce319724e35c7990d2be9b8"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4a97c942e2f6c1b7a66eb68f5f"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4aabae52d81ac07b00bbd1e57f"`
    )
    await queryRunner.query(`DROP TABLE "pokemon_evolutions_pokemon"`)
    await queryRunner.query(`DROP TABLE "evolution_requirement"`)
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1cb8fc72a68e5a601312c642c8"`
    )
    await queryRunner.query(`DROP TABLE "pokemon"`)
    await queryRunner.query(`DROP TABLE "pokemon_attack"`)
  }
}
