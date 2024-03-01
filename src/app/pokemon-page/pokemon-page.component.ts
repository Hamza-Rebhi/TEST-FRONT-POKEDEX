import { Component, Input, OnInit, importProvidersFrom } from '@angular/core';
import { Pokemon } from '../model/Pokemon';
import { PokemonService } from '../service/pokemon.service';
import { ActivatedRoute } from '@angular/router';
import { catchError, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-pokemon-page',
  templateUrl: './pokemon-page.component.html',
  styleUrls: ['./pokemon-page.component.css']
})
export class PokemonPageComponent implements OnInit{
  
  showStatsSection: boolean = false;
  showEvolutionsSection: boolean = false;
  showMovesSection: boolean = false;

  pokemon!: Pokemon;  
  error: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private pokemonService: PokemonService
  ) {
    const isRandom = this.route.snapshot.paramMap.get('random');

    if (isRandom) {
      // Charger un Pokémon aléatoire
      this.pokemonService.getRandomPokemon().subscribe(
        (pokemon: Pokemon) => {
          this.pokemon = pokemon;
          console.log("the pokemon is",pokemon);
        },
       
      );
    } 
    const pokemonId: string|null = this.route.snapshot.paramMap.get('id');
    
    if(pokemonId) {
      this.searchPokemon(pokemonId);
        }
  }
  
  ngOnInit(): void {

      }
       /**
   * Recherche un Pokémon par son ID ou son nom.
   * @param searchTerm Le terme de recherche (ID ou nom du Pokémon).
   * @returns void
   */
      searchPokemon(searchTerm: string): void {
        
        this.error = false;

    this.pokemonService.getPokemonByIdOrName(searchTerm).subscribe({
      next: (pokemon: Pokemon) => {
            this.pokemon = pokemon;
            console.log(this.pokemon);
        },
        error: (error) => {
          this.error = true;
          console.error('Error fetching  Pokemon:', error);
        },
        complete: () => console.log(' Pokemon loading completed')

      });
  }
       /**
   * Charge un Pokémon aléatoire.
   * @returns void
   */

  loadRandomPokemon(): void {
    this.pokemonService.getRandomPokemon().subscribe({
      next: (pokemon: Pokemon) => {
        this.pokemon = pokemon;
      },
      error: (error) => {
        this.error = true;
        console.error('Error fetching random Pokemon:', error);
      },
      complete: () => console.log('Random Pokemon loading completed')
    });
  }
  

  /**
   * Affiche la section des statistiques du Pokémon si on clique sur le bouton stats.
   * @returns void
   */

  showStats(): void {
    this.showStatsSection = true;
    this.showEvolutionsSection = false;
    this.showMovesSection = false;

  }
  /**
   * Affiche la section des évolutions du Pokémon si on clique sur le bouton Evolution.
   * @returns void
   */

  showEvolutions(): void {
    this.showStatsSection = false;
    this.showEvolutionsSection = true;
    this.showMovesSection = false;
  }
 /**
   * Affiche la section des mouvements du Pokémon si on clique sur moves.
   * @returns void
   */
  showMoves(): void {
    this.showStatsSection = false;
    this.showEvolutionsSection = false;
    this.showMovesSection = true;
  }
}