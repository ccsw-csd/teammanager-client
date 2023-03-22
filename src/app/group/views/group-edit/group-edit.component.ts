import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";

@Component({
  selector: 'app-group-edit',
  templateUrl: './group-edit.component.html',
  styleUrls: ['./group-edit.component.scss'],
  providers: [DialogService, DynamicDialogRef, DynamicDialogConfig,ConfirmationService]
})
export class GroupEditComponent implements OnInit {

  constructor(
    private ref: DynamicDialogRef,
    private confirmationService:ConfirmationService,
    private dialogService: DialogService
  ) { }

  ngOnInit(): void {
  }

  delete(id:number){

    this.confirmationService.confirm({
      message:'¿Deseas borrar este grupo?',
      accept:()=>{
        this.confirmationService.close();
      },
      reject:()=>{
        this.confirmationService.close();
      }
    });
    
  }
}
