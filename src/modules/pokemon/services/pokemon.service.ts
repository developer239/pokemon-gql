import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { EvolutionRequirement } from 'src/modules/pokemon/entities/evolution-requirement.enity'
import { Pokemon } from 'src/modules/pokemon/entities/pokemon.entity'
import { PokemonsQueryInput } from 'src/modules/pokemon/pokemon.types'
import { LoaderService } from 'src/modules/pokemon/services/loader.service'

@Injectable()
export class PokemonService {
  constructor(
    @InjectRepository(Pokemon)
    private readonly pokemonRepository: Repository<Pokemon>,
    @InjectRepository(EvolutionRequirement)
    private readonly evolutionRequirementRepository: Repository<EvolutionRequirement>,
    private readonly loaderService: LoaderService
  ) {}

  async addFavorite(id: number): Promise<Pokemon> {
    const pokemon = await this.pokemonRepository.findOne({
      where: { id },
    })

    if (!pokemon) {
      throw new NotFoundException('Pokemon not found')
    }

    pokemon.isFavorite = true

    const result = await this.pokemonRepository.save(pokemon)

    this.loaderService.invalidateEvolutions(id)

    return result
  }

  async removeFavorite(id: number): Promise<Pokemon> {
    const pokemon = await this.pokemonRepository.findOne({
      where: { id },
    })

    if (!pokemon) {
      throw new NotFoundException('Pokemon not found')
    }

    pokemon.isFavorite = false

    const result = this.pokemonRepository.save(pokemon)

    this.loaderService.invalidateEvolutions(id)

    return result
  }

  async findByName(name: string): Promise<Pokemon> {
    const result = await this.pokemonRepository.findOne({ where: { name } })

    if (!result) {
      throw new NotFoundException('Pokemon not found')
    }

    return result
  }

  async findById(id: number): Promise<Pokemon> {
    const result = await this.pokemonRepository.findOne({ where: { id } })
    if (!result) {
      throw new NotFoundException('Pokemon not found')
    }

    return result
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
    try {
      return this.evolutionRequirementRepository.findOneOrFail({
        where: { pokemon: { id } },
      })
    } catch (error) {
      throw new NotFoundException('Evolution requirements not found')
    }
  }
}
