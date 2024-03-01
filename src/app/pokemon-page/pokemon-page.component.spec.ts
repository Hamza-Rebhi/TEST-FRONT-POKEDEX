import { PokemonPageComponent } from './pokemon-page.component';
import { PokemonService } from '../service/pokemon.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Pokemon } from '../model/Pokemon';

describe('PokemonPageComponent', () => {
  let component: PokemonPageComponent;
  let mockPokemonService: jasmine.SpyObj<PokemonService>;
  let mockActivatedRoute: { snapshot: { paramMap: { get: jasmine.Spy } } };

  beforeEach(() => {
    mockPokemonService = jasmine.createSpyObj('PokemonService', ['getPokemonByIdOrName', 'getRandomPokemon']);
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy()
        }
      }
    };

    component = new PokemonPageComponent(
      mockActivatedRoute as any,
      mockPokemonService
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load random pokemon on initialization if random param is provided', () => {
    // Arrange
    const mockRandomPokemon = createMockPokemon();
    mockActivatedRoute.snapshot.paramMap.get.and.returnValue('random');
    mockPokemonService.getRandomPokemon.and.returnValue(of(mockRandomPokemon));

    // Act
    component.ngOnInit();

    // Assert
    expect(mockPokemonService.getRandomPokemon).toHaveBeenCalled();
    expect(component.pokemon).toEqual(mockRandomPokemon);
  });

  it('should search for pokemon by id on initialization if id param is provided', () => {
    // Arrange
    const pokemonId = '25';
    const mockPokemon = createMockPokemon();
    mockActivatedRoute.snapshot.paramMap.get.and.returnValue(pokemonId);
    mockPokemonService.getPokemonByIdOrName.and.returnValue(of(mockPokemon));

    // Act
    component.ngOnInit();

    // Assert
    expect(mockPokemonService.getPokemonByIdOrName).toHaveBeenCalledWith(pokemonId);
    expect(component.pokemon).toEqual(mockPokemon);
  });

  it('should handle error when loading random pokemon', () => {
    // Arrange
    mockActivatedRoute.snapshot.paramMap.get.and.returnValue('random');
    const errorMessage = 'Failed to load random pokemon';
    mockPokemonService.getRandomPokemon.and.returnValue(throwError(errorMessage));

    // Act
    component.ngOnInit();

    // Assert
    expect(component.error).toBe(true);
    expect(console.error).toHaveBeenCalledWith('Error fetching random Pokemon:', errorMessage);
  });

  it('should handle error when searching for pokemon by id', () => {
    // Arrange
    const pokemonId = '25';
    const errorMessage = 'Failed to load pokemon by id';
    mockActivatedRoute.snapshot.paramMap.get.and.returnValue(pokemonId);
    mockPokemonService.getPokemonByIdOrName.and.returnValue(throwError(errorMessage));

    // Act
    component.ngOnInit();

    // Assert
    expect(component.error).toBe(true);
    expect(console.error).toHaveBeenCalledWith('Error fetching  Pokemon:', errorMessage);
  });

  it('should load random pokemon', () => {
    // Arrange
    const mockRandomPokemon = createMockPokemon();
    mockPokemonService.getRandomPokemon.and.returnValue(of(mockRandomPokemon));

    // Act
    component.loadRandomPokemon();

    // Assert
    expect(mockPokemonService.getRandomPokemon).toHaveBeenCalled();
    expect(component.pokemon).toEqual(mockRandomPokemon);
  });

  it('should show stats section', () => {
    // Act
    component.showStats();

    // Assert
    expect(component.showStatsSection).toBe(true);
    expect(component.showEvolutionsSection).toBe(false);
    expect(component.showMovesSection).toBe(false);
  });

  it('should show evolutions section', () => {
    // Act
    component.showEvolutions();

    // Assert
    expect(component.showStatsSection).toBe(false);
    expect(component.showEvolutionsSection).toBe(true);
    expect(component.showMovesSection).toBe(false);
  });

  it('should show moves section', () => {
    // Act
    component.showMoves();

    // Assert
    expect(component.showStatsSection).toBe(false);
    expect(component.showEvolutionsSection).toBe(false);
    expect(component.showMovesSection).toBe(true);
  });

  // Helper function to create a mock Pokemon
  function createMockPokemon(): Pokemon {
    return {
      id: 1,
      name: 'Pikachu',
      image: 'pikachu.png',
      types: [{ name: 'Electric', color: 'yellow' }],
      description: 'A cute and powerful electric mouse Pokémon.',
      stats: [{ name: 'HP', value: 100 }],
      evolutions: [{ name: 'Raichu', image: 'raichu.png' }],
      moves: [{ name: 'Thunderbolt', level: '1' }]
    };
  }
});
