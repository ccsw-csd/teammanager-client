import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { GroupEditComponent } from 'src/app/group/views/group-edit/group-edit.component';
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
      this.adminView = true;
      this.getAllGroupsAdmin();
     }else{
      this.getAllGroups(); 
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

  editGroup(groupEdit:Group){
    this.ref = this.dialogService.open(GroupEditComponent,{
      height:"630px",
      width:"1200px",
      data:{
        group: groupEdit
      },
      closable:false
    });
    this.onClose();
  }

  onClose():void{
    this.ref.onClose.subscribe(
      (results:any) => {
        this.ngOnInit();
      }
    )
  }
}
