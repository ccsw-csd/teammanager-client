import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForecastListComponent } from './views/forecast-list/forecast-list.component';
import { ForecastDetailComponent } from './views/forecast-detail/forecast-detail.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TableModule } from "primeng/table";
import { TabViewModule } from 'primeng/tabview';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';




@NgModule({
  declarations: [
    ForecastListComponent,
    ForecastDetailComponent
  ],
  imports: [
    CommonModule,
    TableModule,
    DynamicDialogModule,
    ButtonModule,
    ConfirmDialogModule,
    PaginatorModule,
    InputTextModule,
    TabViewModule,
    InputSwitchModule,
    ScrollPanelModule,
  ]
})
export class ForecastModule { }
