import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { EvolutionRequirement } from 'src/modules/pokemon/entities/evolution-requirement.enity'
import { Pokemon } from 'src/modules/pokemon/entities/pokemon.entity'
import { PokemonsQueryInput } from 'src/modules/pokemon/pokemon.types'

@Injectable()
export class PokemonService {
  constructor(
    @InjectRepository(Pokemon)
    private readonly pokemonRepository: Repository<Pokemon>,
    @InjectRepository(EvolutionRequirement)
    private readonly evolutionRequirementRepository: Repository<EvolutionRequirement>
  ) {}

  async addFavorite(id: number): Promise<Pokemon> {
    const pokemon = await this.pokemonRepository.findOneOrFail({
      where: { id },
    })

    pokemon.isFavorite = true

    return this.pokemonRepository.save(pokemon)
  }

  async removeFavorite(id: number): Promise<Pokemon> {
    const pokemon = await this.pokemonRepository.findOneOrFail({
      where: { id },
    })

    pokemon.isFavorite = false

    return this.pokemonRepository.save(pokemon)
  }

  findByName(name: string): Promise<Pokemon> {
    return this.pokemonRepository.findOneOrFail({ where: { name } })
  }

  findById(id: number): Promise<Pokemon> {
    return this.pokemonRepository.findOneOrFail({ where: { id } })
  }

  async findAllTypes(): Promise<string[]> {
    const result = await this.pokemonRepository.query(`
      SELECT DISTINCT unnest(string_to_array(types, ',')) AS type
      FROM pokemon;
    `)

    return result.map((row) => row.type)
  }

  async findAll(
    query: PokemonsQueryInput
  ): Promise<{ items: Pokemon[]; count: number }> {
    const { limit, offset, search, type } = query

    const queryBuilder = this.pokemonRepository.createQueryBuilder('pokemon')

    if (search) {
      queryBuilder.andWhere('pokemon.name ILIKE :search', {
        search: `%${search}%`,
      })
    }

    if (type) {
      queryBuilder.andWhere('pokemon.types ILIKE :type', { type: `%${type}%` })
    }

    const [result, total] = await queryBuilder
      .skip(offset)
      .take(limit)
      .getManyAndCount()

    return { items: result, count: total }
  }

  findEvolutionRequirementsByPokemonId(
    id: number
  ): Promise<EvolutionRequirement> {
    return this.evolutionRequirementRepository.findOneOrFail({
      where: { pokemon: { id } },
    })
  }
}
