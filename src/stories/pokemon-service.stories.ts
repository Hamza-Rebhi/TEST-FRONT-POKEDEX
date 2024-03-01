import type { Meta, StoryObj } from '@storybook/angular';
import { PokemonService } from 'src/app/service/pokemon.service';

const pokemonServiceMeta: Meta<PokemonService> = {
  title: 'Services/PokemonService',
  component: PokemonService,
  tags: ['autodocs'],
};

export default pokemonServiceMeta;
type Story = StoryObj<PokemonService>;

export const GetPokemonByIdOrName: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        component: `
          This story demonstrates the retrieval of a Pokémon by its ID or name using the PokemonService.
        `,
      },
    },
  },
};
