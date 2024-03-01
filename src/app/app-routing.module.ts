import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SearchFormComponent } from './search-form/search-form.component';
import { PokemonPageComponent } from './pokemon-page/pokemon-page.component';

const routes: Routes = [
  { path: 'search-form', component: SearchFormComponent },

   { path: 'not-found', component: PageNotFoundComponent },
   {path: "page-pokemon/:id", component: PokemonPageComponent},

   { path: 'page-pokemon', component: PokemonPageComponent },


{ path: '**', redirectTo: '/search-form' } // Redirection pour toutes les autres routes inexistantes];
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
