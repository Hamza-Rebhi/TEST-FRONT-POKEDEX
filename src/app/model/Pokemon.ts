import { PokemonEvolution } from "./PokemonEvolution";
import { PokemonMoves } from "./PokemonMoves";
import { PokemonStat } from "./PokemonStat";
import { PokemonType } from "./PokemonType";
export interface Pokemon {
    id: number;
    name: string;
    image: string;
    types: PokemonType[];
    description: string;
    stats: PokemonStat[];
    evolutions: PokemonEvolution[];
    moves: PokemonMoves[]; // Détails des mouvements
    
  }