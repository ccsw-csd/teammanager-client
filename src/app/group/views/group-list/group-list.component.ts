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
    {
      id: 1,
      name: 'Group 1',
      managers: 'Manager 1',
      members: 10,
      subgroups: 2,
      externalId: 'ext1'
    },
    {
      id: 2,
      name: 'Group 2',
      managers: 'Manager 2',
      members: 15,
      subgroups: 3,
      externalId: 'ext2'
    },
    {
      id: 3,
      name: 'Group 3',
      managers: 'Manager 3',
      members: 8,
      subgroups: 1,
      externalId: 'ext3'
    }];
    
  adminView: boolean = false;

  constructor(
    private ref: DynamicDialogRef,
    private dialogService: DialogService,
    private groupService: GroupService,
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

  onClose(): void {
    this.ref.onClose.subscribe(
      (results: any) => {
        this.ngOnInit();
      }
    )
  }
}
