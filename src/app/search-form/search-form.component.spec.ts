import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { SearchFormComponent } from './search-form.component';
import { PokemonService } from '../service/pokemon.service';
import { Pokemon } from '../model/Pokemon';

describe('SearchFormComponent', () => {
  let component: SearchFormComponent;
  let fixture: ComponentFixture<SearchFormComponent>;
  let router: Router;
  let pokemonService: jasmine.SpyObj<PokemonService>;

  beforeEach(async () => {
    const pokemonServiceSpy = jasmine.createSpyObj('PokemonService', ['getPokemonByIdOrName', 'getRandomPokemon']);

    await TestBed.configureTestingModule({
      declarations: [ SearchFormComponent ],
      imports: [ RouterTestingModule ],
      providers: [
        { provide: PokemonService, useValue: pokemonServiceSpy }
      ]
    })
    .compileComponents();

    pokemonService = TestBed.inject(PokemonService) as jasmine.SpyObj<PokemonService>;
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call pokemonService.getPokemonByIdOrName and navigate on valid search', () => {
    const pokemon: Pokemon = {
      id: 1,
      name: 'Pikachu',
      image: 'pikachu.png',
      types: [{ name: 'Electric', color: '#F7D02C' }],
      description: 'A cute electric Pokémon!',
      stats: [{ name: 'HP', value: 35 }, { name: 'Attack', value: 55 }],
      evolutions: [{ name: 'Raichu', image: 'raichu.png' }],
      moves: [{ name: 'Thunderbolt', level: '1' }]
    };
    component.searchTerm = 'pikachu';
    pokemonService.getPokemonByIdOrName.and.returnValue(of(pokemon));

    component.onSearch();

    expect(pokemonService.getPokemonByIdOrName).toHaveBeenCalledWith('pikachu');
    expect(router.navigate).toHaveBeenCalledWith(['/page-pokemon', pokemon.id]);
  });

  it('should handle error and navigate to not-found on invalid search', () => {
    component.searchTerm = 'invalidpokemon';
    pokemonService.getPokemonByIdOrName.and.returnValue(throwError('Error'));

    component.onSearch();

    expect(component.error).toBeTrue();
    expect(router.navigate).toHaveBeenCalledWith(['/not-found']);
  });

  it('should call pokemonService.getRandomPokemon and navigate on random search', () => {
    const pokemon: Pokemon = {
      id: 25,
      name: 'Pikachu',
      image: 'pikachu.png',
      types: [{ name: 'Electric', color: '#F7D02C' }],
      description: 'A cute electric Pokémon!',
      stats: [{ name: 'HP', value: 35 }, { name: 'Attack', value: 55 }],
      evolutions: [{ name: 'Raichu', image: 'raichu.png' }],
      moves: [{ name: 'Thunderbolt', level: '1' }]
    };
    pokemonService.getRandomPokemon.and.returnValue(of(pokemon));

    component.onRandom();

    expect(router.navigate).toHaveBeenCalledWith(['/page-pokemon', pokemon.id], { state: { random: true } });
  });
});
