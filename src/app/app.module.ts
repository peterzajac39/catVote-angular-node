import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { VotesComponent } from './votes/votes.component';
import { NgxLoadingModule } from 'ngx-loading';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {
  MatToolbarModule,
  MatTabsModule,
  MatButton, MatDividerModule, MatButtonToggleModule
} from '@angular/material';
import {MatCardModule} from '@angular/material/card';
import { StatsComponent } from './stats/stats.component';
import { TopComponent } from './top/top.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import {MatChipsModule} from '@angular/material/chips';

@NgModule({
  declarations: [
    AppComponent,
    VotesComponent,
    StatsComponent,
    TopComponent
  ],
  imports: [
    MatTabsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatChipsModule,
    BrowserModule,
    FlexLayoutModule,
    HttpClientModule,
    NgxLoadingModule.forRoot({}),
    MatCardModule,
    MatDividerModule,
    AngularFontAwesomeModule,
    MatButtonToggleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
