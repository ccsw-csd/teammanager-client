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
  providers: [DialogService, DynamicDialogRef, DynamicDialogConfig, ConfirmationService]
})
export class GroupListComponent implements OnInit {

  groups: Group[] = [
    { id: 1, name: 'Grupo 1', managers: 'LDAP', members: 25, subgroups: 3, externalId: 'ext1' },
    { id: 2, name: 'Grupo 2', managers: 'Admins', members: 15, subgroups: 2, externalId: null },
    { id: 3, name: 'Grupo 3', managers: 'LDAP', members: 20, subgroups: 1, externalId: 'ext2' },
    { id: 4, name: 'Grupo 4', managers: 'Admins', members: 18, subgroups: 5, externalId: null },
    { id: 5, name: 'Grupo 5', managers: 'LDAP', members: 30, subgroups: 4, externalId: 'ext3' },
    { id: 6, name: 'Grupo 6', managers: 'Admins', members: 22, subgroups: 2, externalId: null },
    { id: 7, name: 'Grupo 7', managers: 'LDAP', members: 17, subgroups: 3, externalId: 'ext4' },
    { id: 8, name: 'Grupo 8', managers: 'Admins', members: 28, subgroups: 6, externalId: null },
    { id: 9, name: 'Grupo 9', managers: 'LDAP', members: 23, subgroups: 2, externalId: 'ext5' },
    { id: 10, name: 'Grupo 10', managers: 'Admins', members: 16, subgroups: 4, externalId: null },
  ];

  adminView: boolean = false;

  constructor(
    private ref: DynamicDialogRef,
    private dialogService: DialogService,
    private groupService: GroupService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.adminView = false;
    this.getAllGroups();
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
