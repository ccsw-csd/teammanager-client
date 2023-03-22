import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { Group } from 'src/app/group/models/Group';
import { GroupService } from 'src/app/group/services/group.service';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss'],
  providers: [DialogService, DynamicDialogRef, DynamicDialogConfig,ConfirmationService]
})
export class GroupListComponent implements OnInit {
  groups: Group[];
  adminView: boolean = false;
  constructor(
    private ref: DynamicDialogRef,
    private confirmationService:ConfirmationService,
    private dialogService: DialogService,
    private groupService: GroupService,
  ) { }

  ngOnInit(): void {  
    this.adminView=false;  
    this.getAllGroups();   
  }

  clickAdminView(e) {
    const adminView = e.checked;
     if (adminView) {
      console.log('jsdhck');
      this.adminView = true;
      this.getAllGroupsAdmin();
     }
  }

  getAllGroupsAdmin() {
    this.groupService.getAllGroupsAdmin().subscribe({
      next: (res: Group[]) => {
        this.groups = res;
      },
    });
  }
  
  getAllGroups() {
    this.groupService.getAllGroups().subscribe({
      next: (res: Group[]) => {
        this.groups = res;
      },
    });
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
