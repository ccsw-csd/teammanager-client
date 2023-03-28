import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GroupListComponent } from './views/group-list/group-list.component';
import { GroupEditComponent } from './views/group-edit/group-edit.component';

import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ListboxModule } from 'primeng/listbox';
import { TableModule } from "primeng/table";
import { ToastModule } from "primeng/toast";
import { DynamicDialogModule } from "primeng/dynamicdialog";
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from "primeng/tooltip";
import { InputTextModule } from "primeng/inputtext";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { PaginatorModule } from "primeng/paginator";
import { TabViewModule } from 'primeng/tabview';
import { TreeModule } from 'primeng/tree';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FieldsetModule } from 'primeng/fieldset';
import { PanelModule } from 'primeng/panel';
import { SplitterModule } from "primeng/splitter";
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { PickListModule } from 'primeng/picklist';

@NgModule({
  declarations: [
    GroupListComponent,
    GroupEditComponent
  ],
  imports: [
    CommonModule,
    ListboxModule,
    MatDialogModule,
    TableModule,
    ToastModule,
    DynamicDialogModule,
    FormsModule,
    BrowserModule,
    ButtonModule,
    TooltipModule,
    ConfirmDialogModule,
    PaginatorModule,
    InputTextModule,
    TooltipModule,
    ToastModule,
    TabViewModule,
    TreeModule,
    VirtualScrollerModule,
    InputSwitchModule,
    FieldsetModule,
    PanelModule,
    SplitterModule,
    ScrollPanelModule,
    PickListModule,
    BrowserAnimationsModule,
  ],
  providers: [
    {
      provide: MAT_DIALOG_DATA,
      useValue: {},
    },
  ]
})
export class GroupModule { }
