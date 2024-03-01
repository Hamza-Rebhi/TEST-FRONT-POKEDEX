import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SearchFormComponent } from './search-form/search-form.component';
import { HttpClientModule } from '@angular/common/http';
import { PokemonPageComponent } from './pokemon-page/pokemon-page.component';
import { FormsModule } from '@angular/forms';
import { StatFormatPipe } from './pipes/stat-format.pipe';
import { GraphQLModule } from './graphql.module';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    SearchFormComponent,
    PokemonPageComponent,
    StatFormatPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    GraphQLModule,
    FormsModule

  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
