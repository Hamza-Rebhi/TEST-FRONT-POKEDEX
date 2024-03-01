import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApolloTestingModule, ApolloTestingController } from 'apollo-angular/testing';
import { PokemonService } from './pokemon.service';
import { Pokemon } from '../model/Pokemon'; // Assurez-vous d'importer le modèle Pokemon

describe('PokemonService', () => {
  let service: PokemonService;
  let httpMock: HttpTestingController;
  let apolloMock: ApolloTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ApolloTestingModule],
      providers: [PokemonService]
    });
    service = TestBed.inject(PokemonService);
    httpMock = TestBed.inject(HttpTestingController);
    apolloMock = TestBed.inject(ApolloTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    apolloMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get random Pokemon', () => {
    const mockPokemon: Pokemon = { id: 25, name: 'pikachu', image: '', types: [], description: '', stats: [], evolutions: [], moves: [] };
    service.getRandomPokemon().subscribe((pokemon: Pokemon) => {
      expect(pokemon).toEqual(mockPokemon);
    });

    const req = httpMock.expectOne(req => req.url.includes('https://pokeapi.co/api/v2/pokemon/'));
    expect(req.request.method).toBe('GET');
    req.flush(mockPokemon);
  });

  it('should get Pokemon by id or name', () => {
    const mockPokemon: Pokemon = { id: 1, name: 'bulbasaur', image: '', types: [], description: '', stats: [], evolutions: [], moves: [] };
    service.getPokemonByIdOrName('bulbasaur').subscribe((pokemon: Pokemon) => {
      expect(pokemon).toEqual(mockPokemon);
    });

    const req = httpMock.expectOne(req => req.url.includes('https://pokeapi.co/api/v2/pokemon/bulbasaur'));
    expect(req.request.method).toBe('GET');
    req.flush(mockPokemon);
  });

  it('should get Pokemon details with GraphQL', () => {
    const mockPokemon: Pokemon = { id: 1, name: 'bulbasaur', image: '', types: [], description: '', stats: [], evolutions: [], moves: [] };
    service.getPokemonDetailsWithGraphQL('bulbasaur').subscribe((pokemon: Pokemon) => {
      expect(pokemon).toEqual(mockPokemon);
    });

    const op = apolloMock.expectOne('GetPokemon');
    op.flush({ data: { pokemon: mockPokemon } });
  });

  it('should get Pokemon details with GraphQL', () => {
    const mockPokemonDetails = { description: 'A strange seed was planted on its back at birth.', moves: [], evolutions: [] };
    service.getPokemonDetailsGraphQL('bulbasaur').subscribe((details) => {
      expect(details).toEqual(mockPokemonDetails);
    });

    const op = apolloMock.expectOne('GetPokemonDetails');
    op.flush({ data: { pokemon: mockPokemonDetails } });
  });

  // Ajoutez d'autres tests pour les autres méthodes de service, si nécessaire

});
