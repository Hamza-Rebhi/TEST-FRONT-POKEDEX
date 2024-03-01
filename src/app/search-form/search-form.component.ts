import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Pokemon } from '../model/Pokemon';
import { PokemonService } from '../service/pokemon.service';
import { Observable, Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css']
})
export class SearchFormComponent implements OnInit {
  // Propriétés pour le champ de recherche et la gestion des erreurs
  searchTerm: string = '';
  error: boolean = false;

  constructor(
    private router: Router,
    private pokemonService: PokemonService
  ) {}

  ngOnInit(): void {
  }

  /**
   * Méthode déclenchée lors de la recherche d'un Pokémon.
   * Redirige vers la page de détails du Pokémon trouvé.
   * Gère les erreurs en cas de problème lors de la récupération du Pokémon.
   * @returns void
   */
    onSearch(): void {
    // Réinitialiser l'indicateur d'erreur
    this.error = false;
    // Vérifier si le terme de recherche n'est pas vide
    if (this.searchTerm.trim()) {
      // Appeler le service pour obtenir les détails du Pokémon par son nom ou son ID
      this.pokemonService.getPokemonByIdOrName(this.searchTerm.trim()).subscribe({
        next: (pokemon) => {
          // Rediriger vers la page de détails du Pokémon trouvé
          this.router.navigate(['/page-pokemon', pokemon.id]);
        },
        error: (err) => {
          // Gérer les erreurs en cas de problème lors de la récupération du Pokémon
          this.error = true;
          console.error(err);
          // Optionnellement, naviguer vers le composant NotFound si vous ne souhaitez pas gérer l'erreur dans ce composant
          this.router.navigate(['/not-found']);
        },
      });
    }
  }

/**
   * Méthode déclenchée lors de la recherche d'un Pokémon aléatoire.
   * Redirige vers la page de détails du Pokémon aléatoire avec l'indicateur 'random'.
   * @returns void
   */
    onRandom(): void {
    // Appeler le service pour obtenir un Pokémon aléatoire
    this.pokemonService.getRandomPokemon().subscribe(
      (pokemon) => {
        // Rediriger vers la page de détails du Pokémon aléatoire avec l'indicateur 'random'
        this.router.navigate(['/page-pokemon', pokemon.id], { state: { random: true } });
      },
    );
  }
}
