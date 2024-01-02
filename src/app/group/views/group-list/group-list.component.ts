import { Component, OnInit } from '@angular/core';
import { ConfirmationService, Header } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { GroupEditComponent } from 'src/app/group/views/group-edit/group-edit.component';
import { Group } from 'src/app/group/models/Group';
import { GroupService } from 'src/app/group/services/group.service';
import { NavigatorService } from 'src/app/core/services/navigator.service';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss'],
  providers: [DialogService, DynamicDialogRef, DynamicDialogConfig, ConfirmationService]
})
export class GroupListComponent implements OnInit {

  groups: Group[] = [];

  adminView: boolean = false;
  tableWidth: string;

  constructor(
    private ref: DynamicDialogRef,
    private dialogService: DialogService,
    private groupService: GroupService,
    private confirmationService: ConfirmationService,
    private navigatorService: NavigatorService,
  ) { }

  ngOnInit(): void {
    this.adminView = false;
    this.getAllGroups();
    this.resizeTable();
    this.groups = [
      { id:1, name: 'Grupo de Prueba', managers: 'Manager de Prueba', members: 5, subgroups: 1,externalId:'prueba'},
      { id:2, name: 'Grupo de Prueba2', managers: 'Manager de Prueba2', members: 55, subgroups: 1,externalId:null}
      
    ];
    this.navigatorService.getNavivagorChangeEmitter().subscribe((menuVisible) => {
      if (menuVisible) this.tableWidth = 'calc(100vw - 255px)';
      else this.tableWidth = 'calc(100vw - 55px)';
    }); 
  }

  clickAdminView(e) {
    const adminView = e.checked;
    if (adminView) {
      this.getAllGroupsAdmin();
    } else {
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

  createGroup() {
    let header = 'New Group'
    this.ref = this.dialogService.open(GroupEditComponent, {
      width: '800px',
      contentStyle: { overflow: 'auto' },
      data: {
        group: new Group(),
        //isReadOnly: false
      },
      closable: false,
      header: header,
    });

    this.onClose(); // Podrías decidir si quieres recargar la lista después de cerrar la ventana de edición
  }

  editGroup(groupEdit: Group) {
    let header = 'Edit Group'
    this.ref = this.dialogService.open(GroupEditComponent, {
      width: '800px',
      data: {
        group: groupEdit,
        //isReadOnly: false
      },
      closable: false,
      showHeader: true,
      header: header,
      
    
    });
    this.onClose();
  }

  viewGroup(group: Group) {
    let header = 'View Group'
    this.ref = this.dialogService.open(GroupEditComponent, {
      width: '800px',
      contentStyle: { overflow: 'auto' },
      data: {
        group: group,
        //isReadOnly: true
      
      },
      closable: false,
      header: header,
    });
    this.onClose();
  }

  resizeTable() {
    if (document.getElementById('p-slideMenu')) {
      this.tableWidth = 'calc(100vw - 255px)';
    } else {
      this.tableWidth = 'calc(100vw - 55px)';
    }
  }

  deleteGroup(group: Group) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the group?',
      header: 'Confirmation',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        this.groupService.deleteGroup(group.id).subscribe({
          next: () => {
            this.getAllGroups();
          },
          error: () => {
          }
        });
      },
      reject: () => {
      }
    });

  }

  onClose(): void {
    this.ref.onClose.subscribe(
      (results: any) => {
        this.ngOnInit();
      }
    )
  }
}
