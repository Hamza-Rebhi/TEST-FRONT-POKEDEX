import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Pokemon } from '../model/Pokemon';
import { Apollo, gql } from 'apollo-angular';
import { PokemonEvolution } from '../model/PokemonEvolution';
// Déclare le service comme injectable, permettant son utilisation dans d'autres parties de l'application Angular.

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  // URL de base de l'API REST PokeAPI.

  private restApiUrl = 'https://pokeapi.co/api/v2';
  
 /**
   * Crée une instance du service PokemonService.
   * @param http Le service HttpClient pour effectuer des requêtes HTTP.
   * @param apollo Le service Apollo pour effectuer des requêtes GraphQL.
   */
  constructor(private http: HttpClient,
             private apollo:Apollo) { }

 /**
   * Récupère un Pokémon par son ID ou nom en utilisant l'API REST.
   * @param identifier L'ID ou le nom du Pokémon à récupérer.
   * @returns Un Observable contenant les données du Pokémon.
   */
  getPokemonByIdOrName(identifier: string): Observable<Pokemon> {
    return this.http.get<any>(`${this.restApiUrl}/pokemon/${identifier}`).pipe(
      switchMap(pokemonData =>
        // Après avoir obtenu les données de base du Pokémon, fait une autre requête pour obtenir les données de son espèce.

        // Obtenir les données de l'espèce pour la description et l'ID de la chaîne d'évolution
        this.http.get<any>(`${this.restApiUrl}/pokemon-species/${pokemonData.id}`).pipe(
          switchMap(speciesData => {
              // Trouve la description en anglais dans les données de l'espèce.

            const description = speciesData.flavor_text_entries.find((entry: { language: { name: string}, version:{name:string} ; }) => entry.language.name === 'en' && entry.version.name === 'ruby').flavor_text;
            pokemonData.description = description;
  
            // Extrait l'ID de la chaîne d'évolution à partir de l'URL fournie.
            const evolutionChainId = speciesData.evolution_chain.url.split('/').slice(-2, -1)[0];
           let  id=pokemonData.id;
            // Effectuer une requête pour récupérer les données de la chaîne d'évolution
            return this.http.get<any>(`${this.restApiUrl}/evolution-chain/${evolutionChainId}`).pipe(
              map(evolutionData => {
                // Mise à jour des évolutions dans pokemonData
                const evolutions = this.extractEvolutions(evolutionData.chain,id);
                pokemonData.evolutions = evolutions;
               
                  
  
  
                // Retourner l'objet Pokémon complet avec toutes les informations
                return this.mapPokemon(pokemonData);
              })
            );
          })
        )
      )
    );
  }
/**
   * Extrait les informations d'évolution à partir de la chaîne d'évolution.
   * @param chain La chaîne d'évolution du Pokémon.
   * @param startId L'ID de départ du Pokémon.
   * @returns Un tableau d'objets PokemonEvolution représentant les évolutions du Pokémon.
   */
  private extractEvolutions(chain: any,startId: number):  PokemonEvolution[] {
    const evolutions: PokemonEvolution[] = [];
    let currentId = startId;
    // Fonction récursive pour parcourir la chaîne d'évolution.

    const extract = (node: any) => {
      const evolutionDetails = node.evolution_details[0]; // Prenez le premier détail d'évolution pour simplifier
      evolutions.push({
        name: node.species.name,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${currentId++}.png`,
        // trigger: evolutionDetails ? evolutionDetails.trigger.name : null, // Si vous avez besoin de détails sur le déclencheur, vous pouvez les ajouter ici
      });
      if (node.evolves_to.length > 0) {
        node.evolves_to.forEach((nextNode: any) => extract(nextNode),
        
        );
      }
    };
  
    extract(chain);
  
    return evolutions;
  }
    
 

 
  private handleError(error: Error, errorValue: any) {
    console.error(error);
    return of(errorValue);
  }
   /**
   * Génère un ID aléatoire pour un Pokémon.
   * @returns Un ID aléatoire pour un Pokémon.
   */
  getRandomPokemon(): Observable<Pokemon> {
    const randomId = Math.floor(Math.random() * 898) + 1; // Supposons qu'il y ait 898 Pokémon dans l'API
    return this.getPokemonByIdOrName(randomId.toString());
  }
/**
   * Récupère les détails d'un Pokémon en utilisant GraphQL.
   * @param name Le nom du Pokémon à rechercher.
   * @returns Un Observable contenant les détails du Pokémon.
   */
  getPokemonDetailsWithGraphQL(identifier: string): Observable<Pokemon> {
    const query = gql`
      query GetPokemon($name: String!) {
        pokemon(name: $name) {
          id
          name
          height
          weight
          sprites {
            front_default
          }
          types {
            type {
              name
            }
          }
          stats {
            base_stat
            stat {
              name
            }
          }
          evolutions {
            name
            image
          }
          moves {
            move {
              name
              level
            }
          }
          species {
            flavor_text_entries {
              flavor_text
              language {
                name
              }
            }
          }
        }
      }
    `;
  
    return this.apollo.query<any>({ query, variables: { name: identifier } }).pipe(
      map(data => this.mapPokemon(data?.data?.pokemon))
    );
  }
/**
   * Mapper les données du Pokémon pour les normaliser en fonction de l'interface Pokemon.
   * @param data Les données brutes du Pokémon.
   * @returns Un objet Pokemon avec les données mappées.
   */
    private mapPokemon(data: any): Pokemon {
    return {
      id: data.id,
      name: data.name,
      image: data.sprites.front_default,
      types: data.types.map((type: any) => ({
        name: type.type.name,
        color: this.getTypeColor(type.type.name) 
      })),
      description: data.description || "", 
      stats: data.stats.map((stat: any) => ({
        name: stat.stat.name,
        value: stat.base_stat
      })),
      evolutions: data.evolutions ? data.evolutions.map((evolution: any) => ({
        name: evolution.name,
        image: evolution.image 
      })) : [], 
      moves: data.moves.map((move: any) => ({
        name: move.move.name,
        level: move.version_group_details[0].level_learned_at // Mapping du niveau du mouvement
      }))
    };
  }
  
  
  
  getPokemonDetailsGraphQL(name: string): Observable<any> {
    const query = gql`
      query GetPokemonDetails($name: String!) {
        pokemon(name: $name) {
          description
          moves(limit: 3) {
            move {
              name
              level
            }
          }
          evolutions {
            name
            image
          }
        }
      }
    `;

    return this.apollo.query<any>({
      query,
      variables: { name }
    }).pipe(
      map(response => response.data.pokemon),
      catchError(error => {
        console.error('Error fetching Pokemon details:', error);
        return of(null);
      })
    );
  }
/**Extrait et retourne la description en anglais à partir des données de l'espèce.
   *@param speciesData Les données de l'espèce du Pokémon.
  *@returns La description en anglais du Pokémon.
  */
  private getDescriptionFromGraphQL(speciesData: any): string {
    if (speciesData && speciesData.flavor_text_entries && speciesData.flavor_text_entries.length > 0) {
      // Parcourir les entrées de texte de saveur pour trouver la première description en anglais
      for (const entry of speciesData.flavor_text_entries) {
          return entry.flavor_text;
        
      }
    }
    return 'chaine vide'; // Retourner une chaîne vide si aucune description en anglais n'est trouvée
  }
      
/**
   * Retourne la couleur associée à un type de Pokémon.
   * @param type Le type du Pokémon.
   * @returns La couleur associée au type.
   */ 
   private getTypeColor(type: string): string {
    switch (type) {
      case 'grass':
        return '#88BE5D';
      case 'fire':
        return '#EE803B';
      case 'water':
        return 'blue';
      case 'electric':
        return '#F7CF43';
      case 'ICE':
        return '#9AD8D8';
      case 'FIGHT':
        return '#BE322';
      case 'poison':
        return '#B563CE';
      case 'ground':
        return '#DFBF6E';
      case 'flight':
        return '#A893ED';
      case 'psychic':
        return '#EC5C89';
      case 'bug':
        return '#A8B732';
      case 'ROCK':
        return '#B89F41';
      case 'ghost':
        return '#705A97';
      case 'DARK':
        return '#705849';
      case 'DRAGON':
        return '#7043F4';
      case 'street':
        return '#B8B9CF';
      case 'fairy':
        return '#EFB7BD';

      default:
        return 'gray';
    }
  }
}
