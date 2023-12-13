import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditCalendarComponent } from './views/calendar/edit-calendar/edit-calendar.component';
import {  DropdownModule } from 'primeng/dropdown';
import { CalendarComponent } from './views/calendar/calendar.component';
import { CalendarModule } from 'primeng/calendar';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';






@NgModule({
  declarations: [
    EditCalendarComponent,
    CalendarComponent
  ],
  imports: [
    CommonModule,
    DropdownModule,
    CalendarModule,
    DynamicDialogModule,
    ConfirmDialogModule,
    ToastModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    ProgressSpinnerModule,

    

    
  ]
})
export class WorkCalendarModule { }
