import type { Meta, StoryObj } from '@storybook/angular';
import { PokemonPageComponent } from 'src/app/pokemon-page/pokemon-page.component';

const pokemonPageMeta: Meta<PokemonPageComponent> = {
  title: 'Components/PokemonPage',
  component: PokemonPageComponent,
  tags: ['autodocs'],
};

export default pokemonPageMeta;
type Story = StoryObj<PokemonPageComponent>;

export const Default: Story = {
  args: {},
};

export const Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        component: `
          This component represents a page for displaying Pokémon details.
          It allows users to view details of a specific Pokémon by ID or name,
          as well as load a random Pokémon.
        `,
      },
    },
  },
};
