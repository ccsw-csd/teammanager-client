import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HolidayListComponent } from './views/holiday-list/holiday-list.component';
import { HolidayEditComponent } from './views/holiday-edit/holiday-edit.component';



@NgModule({
  declarations: [
    HolidayListComponent,
    HolidayEditComponent
  ],
  imports: [
    CommonModule
  ]
})
export class HolidayModule { }
