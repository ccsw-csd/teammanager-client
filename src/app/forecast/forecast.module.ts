import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForecastListComponent } from './views/forecast-list/forecast-list.component';
import { ForecastDetailComponent } from './views/forecast-detail/forecast-detail.component';



@NgModule({
  declarations: [
    ForecastListComponent,
    ForecastDetailComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ForecastModule { }
