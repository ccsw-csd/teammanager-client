import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
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
    this.ref = this.dialogService.open(GroupEditComponent, {
      height: 'calc(100vh - 1px)',
      width: '1200px',
      baseZIndex: 10000,
      contentStyle: { overflow: 'auto' },
      data: {
        group: new Group()
      },
      closable: false
    });

    this.onClose(); // Podrías decidir si quieres recargar la lista después de cerrar la ventana de edición
  }

  editGroup(groupEdit: Group) {
    this.ref = this.dialogService.open(GroupEditComponent, {
      height: 'calc(100vh - 1px)',
      width: '1200px',
      baseZIndex: 10000,
      contentStyle: { overflow: 'auto' },
      data: {
        group: groupEdit
      },
      closable: false
    });
    this.onClose();
  }

  viewGroup(group: Group) {
    this.ref = this.dialogService.open(GroupEditComponent, {
      height: 'calc(100vh - 1px)',
      width: '1200px',
      baseZIndex: 10000,
      contentStyle: { overflow: 'auto' },
      data: {
        group: group,
        readonly: true
      },
      closable: false
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
