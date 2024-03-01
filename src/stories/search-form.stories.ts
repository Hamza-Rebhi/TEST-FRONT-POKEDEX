import type { Meta, StoryObj } from '@storybook/angular';
import { SearchFormComponent } from 'src/app/search-form/search-form.component';

const searchFormMeta: Meta<SearchFormComponent> = {
  title: 'Components/SearchForm',
  component: SearchFormComponent,
  tags: ['autodocs'],
};

export default searchFormMeta;
type Story = StoryObj<SearchFormComponent>;

export const Default: Story = {
  args: {},
};

export const  Story = {
    args: {},
    parameters: {
      docs: {
        description: {
          component: `
            This component represents a search form for searching Pokémons.
            It allows users to search for a Pokémon by name or ID and also provides an option to search for a random Pokémon.
          `,
        },
      },
    },
  };
  
