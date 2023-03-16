import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupListComponent } from './views/group-list/group-list.component';
import { GroupEditComponent } from './views/group-edit/group-edit.component';



@NgModule({
  declarations: [
    GroupListComponent,
    GroupEditComponent
  ],
  imports: [
    CommonModule
  ]
})
export class GroupModule { }
