import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HolidayListComponent } from './views/holiday-list/holiday-list.component';
import { HolidayEditComponent } from './views/holiday-edit/holiday-edit.component';

import { AutoCompleteModule } from 'primeng/autocomplete';
import { DynamicDialogModule } from "primeng/dynamicdialog";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ListboxModule } from 'primeng/listbox';
import { TableModule } from "primeng/table";
import { ToastModule } from "primeng/toast";
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from "primeng/tooltip";
import { InputTextModule } from "primeng/inputtext";
import { PaginatorModule } from "primeng/paginator";
import { TabViewModule } from 'primeng/tabview';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { HolidayEditcalendarComponent } from './views/holiday-editcalendar/holiday-editcalendar.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CalendarModule } from 'primeng/calendar';
import {  DropdownModule } from 'primeng/dropdown';
@NgModule({
  declarations: [
    HolidayListComponent,
    HolidayEditComponent,
    HolidayEditcalendarComponent
  ],
  imports: [
    CommonModule,
    DropdownModule,
    AutoCompleteModule,
    ListboxModule,
    TableModule,
    ToastModule,
    DynamicDialogModule,
    ButtonModule,
    TooltipModule,
    ConfirmDialogModule,
    PaginatorModule,
    InputTextModule,
    TooltipModule,
    ToastModule,
    TabViewModule,
    InputSwitchModule,
    ScrollPanelModule,
    CalendarModule,
    FormsModule,
    ReactiveFormsModule,
    ProgressSpinnerModule,
  ]
})
export class HolidayModule { }
