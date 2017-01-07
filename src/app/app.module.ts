import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router';
import { rootRouterConfig } from './app.routes';
import { ChartModule } from 'angular2-highcharts';
import { AppComponent } from './app.component';
import { GithubService } from './github/shared/github.service';
import { CourbePSService } from './series/courbePS.service';
import { OpenDataRteService } from './about/openDataRte.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { Courbe } from './series/courbe';

import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { SeriesComponent } from './series/series.component';
import { RepoBrowserComponent } from './github/repo-browser/repo-browser.component';
import { RepoListComponent } from './github/repo-list/repo-list.component';
import { RepoDetailComponent } from './github/repo-detail/repo-detail.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { ContactComponent } from './contact/contact.component';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    RepoBrowserComponent,
    RepoListComponent,
    RepoDetailComponent,
    HomeComponent,
    SeriesComponent,
    ContactComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    ChartModule,
    RouterModule.forRoot(rootRouterConfig, { useHash: true })
  ],
  providers: [
    GithubService,
    CourbePSService,
    OpenDataRteService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {

}
