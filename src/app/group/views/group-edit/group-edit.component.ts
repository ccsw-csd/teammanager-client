import { Component, OnInit} from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { GroupEdit } from 'src/app/group/models/GroupEdit';
import { Group } from 'src/app/group/models/Group';
import { Person } from 'src/app/group/models/Person';
import { GroupService } from 'src/app/group/services/group.service';

@Component({
  selector: 'app-group-edit',
  templateUrl: './group-edit.component.html',
  styleUrls: ['./group-edit.component.scss']
})
export class GroupEditComponent implements OnInit {
  isReadOnly: boolean;
  mode: 'editar' | 'crear' | 'visualizar';
  group: GroupEdit = new GroupEdit();
  groupPerson: any[] = [];
  groupSubgroup: any[] = [];
  selectedMember;
  selectedManager;
  selectedSubgroup;
  

  constructor(
    public ref: DynamicDialogRef,
    public dialogConf: DynamicDialogConfig,
    private groupService: GroupService,
    public config: DynamicDialogConfig
  ) {
    this.group = this.config.data.group;
    this.mode = this.config.data.mode;
    this.isReadOnly = this.mode === 'visualizar';
  }

  

  ngOnInit(): void {
    const groupId = this.dialogConf.data.group?.id;
    
    this.group = new GroupEdit();
    this.group.members = [];
    this.group.managers = [];
    this.group.subgroups = [];

    if (groupId) {      
      this.getGroupById(groupId);
    } else {
      this.group = new GroupEdit();
    }
  }

  getGroupById(id: number) {
    this.groupService.getGroup(id).subscribe({
      next: (res) => {
        this.group = res;
      }
    });
  }

  mappingPerson(persons: Person[]): any {
    return persons.map(function (person) {
      return {
        field: person.name + ' ' + person.lastname,
        value: person,
      };
    });
  }

  mappingGroup(groups: Group[]): any {
    return groups.map(function (group) {
      return {
        field: group.name,
        value: group,
      };
    });
  }

  searchPerson($event) {
    if ($event.query != null) {
      this.groupService.searchPerson($event.query).subscribe({
        next: (res: Person[]) => {
          this.groupPerson = this.mappingPerson(res);
        },
        error: () => { },
        complete: () => { },
      });
    }
  }

  searchSubgroup($event) {
    if ($event.query != null) {
      this.groupService.searchGroup($event.query).subscribe({
        next: (res: Group[]) => {
          this.groupSubgroup = this.mappingGroup(res);
        },
        error: () => { },
        complete: () => { },
      });
    }
  }

  assignMember() {
    this.group.members = [
      ...this.group.members,
      this.selectedMember.value,
    ];
    this.selectedMember = '';
  }

  assignManager() {
    this.group.managers = [
      ...this.group.managers,
      this.selectedManager.value,
    ];
    this.selectedManager = '';
  }

  assignSubgroup() {
    this.group.subgroups = [
      ...this.group.subgroups,
      this.selectedSubgroup.value,
    ];
    this.selectedSubgroup = '';
  }

  deleteMember(member: Person) {
    if (this.group.members.indexOf(member) !== -1) {
      this.group.members.splice(this.group.members.indexOf(member), 1);
    }
  }

  deleteManager(manager: Person) {
    if (this.group.managers.indexOf(manager) !== -1) {
      this.group.managers.splice(this.group.managers.indexOf(manager), 1);
    }
  }

  deleteSubGroup(group: Group) {
    if (this.group.subgroups.indexOf(group) !== -1) {
      this.group.subgroups.splice(this.group.subgroups.indexOf(group), 1);
    }
  }

  save(group: Group) {
    this.groupService.save(group).subscribe({
      next: () => {
        this.onClose(true);
      },
      error: () => {
      }
    })
  }

  isFormValid(): boolean {
    return !!this.group.name;
  }

  onClose(isChange: boolean) {
    this.ref.close(isChange);
  }
}
