import { Component, Input, OnInit, Inject} from '@angular/core';
import { SelectItemGroup } from "primeng/api";
import { ConfirmationService} from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { Group } from 'src/app/group/models/Group';
import { Person } from 'src/app/group/models/Person';
import { GroupService } from 'src/app/group/services/group.service';

@Component({
  selector: 'app-group-edit',
  templateUrl: './group-edit.component.html',
  styleUrls: ['./group-edit.component.scss']
})
export class GroupEditComponent implements OnInit {
  group: Group;
  groups: Group[];
  person: Person;
  persons: Person[];
  selectedGroup: Group;
  groupPerson: any[] = [];  
  groupSubgroup: any[] = []; 
  selectedPerson;
  selectedSubgroup;
  selectedPersonList = [];
  selectedGroupList = [];
  members: Person[]=[];
  managers: Person[]=[];
  subgroups: Group[]=[];
  constructor(
    public ref: DynamicDialogRef,
    public dialogConf: DynamicDialogConfig,
    private groupService: GroupService
  ) 
  {
    this.group=this.dialogConf.data.group;
  }

  ngOnInit(): void {
    if(this.group.id != undefined){
      this.getGroupById(this.group.id);  
    }
    this.selectedPersonList = this.mappingPerson(
      this.persons.map((item) => item)
    );

    this.selectedGroupList = this.mappingGroup(
      this.subgroups.map((item) => item)
    );
  }

  getGroupById(id: number){
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

  searchPerson($event) {
    if ($event.query != null) {
      this.groupService.searchPerson($event.query).subscribe({
        next: (res: Person[]) => {
          this.groupPerson = this.mappingPerson(res);
        },
        error: () => {},
        complete: () => {},
      });
    }
  }

  assignMember() {
    if (
      !this.selectedPersonList.some(
        (item) => item.value.id == this.selectedPerson.value.id
      )
    ) {
      this.persons.push(this.selectedPerson.value);
      this.selectedPersonList = [
        ...this.selectedPersonList,
        this.selectedPerson,
      ];
    }
    this.selectedPerson = '';
  }

  assignManager() {
    if (
      !this.selectedPersonList.some(
        (item) => item.value.id == this.selectedPerson.value.id
      )
    ) {
      this.persons.push(this.selectedPerson.value);
      this.selectedPersonList = [
        ...this.selectedPersonList,
        this.selectedPerson,
      ];
    }
    this.selectedPerson = '';
  }

  mappingGroup(groups: Group[]): any {
    return groups.map(function (group) {
      return {
        field: group.name,
        value: group,
      };
    });
  }

  searchSubgroup($event) {
    if ($event.query != null) {
      this.groupService.searchGroup($event.query).subscribe({
        next: (res: Group[]) => {
          this.groupSubgroup = this.mappingGroup(res);
        },
        error: () => {},
        complete: () => {},
      });
    }
  }

  assignSubgroup() {
    if (
      !this.selectedGroupList.some(
        (item) => item.value.id == this.selectedSubgroup.value.id
      )
    ) {
      this.subgroups.push(this.selectedSubgroup.value);
      this.selectedGroupList = [
        ...this.selectedGroupList,
        this.selectedGroup,
      ];
    }
    this.selectedSubgroup = '';
  }
  
  deleteMember(member: Person){
    if (this.members.indexOf(member) !== -1){
      this.members.splice(this.members.indexOf(member), 1);
    }
  }

  deleteManager(manager: Person){
    if (this.managers.indexOf(manager) !== -1){
      this.managers.splice(this.managers.indexOf(manager), 1);
    }
   }

  deleteSubGroup(group: Group){
    if (this.subgroups.indexOf(group) !== -1){
      this.subgroups.splice(this.subgroups.indexOf(group), 1);
    }
  }


  onClose(){
    this.ref.close();
  }
}
