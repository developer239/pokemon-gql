import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Pokemon } from 'src/modules/pokemon/entities/pokemon.entity'
import { PokemonsQueryInput } from 'src/modules/pokemon/pokemon.types'

@Injectable()
export class PokemonService {
  constructor(
    @InjectRepository(Pokemon)
    private readonly pokemonRepository: Repository<Pokemon>
  ) {}

  findByName(name: string): Promise<Pokemon> {
    return this.pokemonRepository.findOneOrFail({ where: { name } })
  }

  findById(id: number): Promise<Pokemon> {
    return this.pokemonRepository.findOneOrFail({ where: { id } })
  }

  async findAllTypes(): Promise<string[]> {
    const result = await this.pokemonRepository.query(`
      SELECT DISTINCT unnest(types) AS type
      FROM pokemon
    `)

    return result.map((row) => row.type)
  }

  async findAll(
    query: PokemonsQueryInput
  ): Promise<{ pokemons: Pokemon[]; count: number }> {
    const { limit, offset, search, type } = query

    const queryBuilder = this.pokemonRepository.createQueryBuilder('pokemon')

    if (search) {
      queryBuilder.andWhere('pokemon.name ILIKE :search', {
        search: `%${search}%`,
      })
    }

    if (type) {
      queryBuilder.andWhere(':type = ANY(pokemon.types)', { type })
    }

    const [result, total] = await queryBuilder
      .skip(offset)
      .take(limit)
      .getManyAndCount()

    return { pokemons: result, count: total }
  }
}
