import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import DataLoader from 'dataloader'
import { Repository } from 'typeorm'
import { Attack } from 'src/modules/pokemon/entities/attack.entity'
import { Pokemon } from 'src/modules/pokemon/entities/pokemon.entity'

@Injectable()
export class LoaderService {
  constructor(
    @InjectRepository(Pokemon)
    private readonly pokemonRepository: Repository<Pokemon>,
    @InjectRepository(Attack)
    private readonly attackRepository: Repository<Attack>
  ) {}

  private readonly attackLoader = new DataLoader<number, Attack[]>((keys) =>
    this.findAttacksByPokemonIds(keys)
  )

  private readonly evolutionLoader = new DataLoader<number, Pokemon[]>((keys) =>
    this.findEvolutionsByPokemonIds(keys)
  )

  public getAttackLoader(): DataLoader<number, Attack[]> {
    return this.attackLoader
  }

  public getEvolutionLoader(): DataLoader<number, Pokemon[]> {
    return this.evolutionLoader
  }

  private async findAttacksByPokemonIds(
    pokemonIds: readonly number[]
  ): Promise<Attack[][]> {
    const attacks = await this.attackRepository
      .createQueryBuilder('attack')
      .innerJoinAndSelect('attack.pokemons', 'pokemon')
      .where('pokemon.id IN (:...pokemonIds)', { pokemonIds })
      .getMany()

    const pokemonToAttacks: Record<number, Attack[]> = {}

    attacks.forEach((attack) => {
      attack.pokemons.forEach((pokemon) => {
        if (pokemonToAttacks[pokemon.id]) {
          pokemonToAttacks[pokemon.id].push(attack)
        } else {
          pokemonToAttacks[pokemon.id] = [attack]
        }
      })
    })

    return pokemonIds.map((id) => pokemonToAttacks[`${id}`])
  }

  private async findEvolutionsByPokemonIds(
    pokemonIds: readonly number[]
  ): Promise<Pokemon[][]> {
    const evolutions = await this.pokemonRepository
      .createQueryBuilder('pokemon')
      .innerJoinAndSelect('pokemon.evolutions', 'evolution')
      .where('pokemon.id IN (:...pokemonIds)', { pokemonIds })
      .getMany()

    const pokemonToEvolutions: Record<number, Pokemon[]> = {}
    evolutions.forEach((pokemon) => {
      pokemonToEvolutions[pokemon.id] = pokemon.evolutions
    })

    return pokemonIds.map((id) => pokemonToEvolutions[`${id}`] || [])
  }
}
