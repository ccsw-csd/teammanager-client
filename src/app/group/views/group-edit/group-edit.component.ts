import { Component, OnInit, Inject} from '@angular/core';
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
  subgroup: Group;
  member: Person;
  manager: Person;
  groups: Group[];
  subgroups: Group[] = [];
  managers: Person[] = [];
  members: Person[] = [];
  selectedGroup: Group;
  selectedSubGroup: Group;
  selectedMember: Person;
  selectedManager: Person;

  constructor(
    public ref: DynamicDialogRef,
    public dialogConf: DynamicDialogConfig,
    private groupService: GroupService
  ) {
    this.group=this.dialogConf.data.group;
   }

  ngOnInit(): void {
    if(this.group.id != undefined){
      this.getGroupById(this.group.id);  
      this.getSubgroups(this.group.name); 
      this.getMembers(this.group.name);
      this.getManagers(this.group.name);
    }
  }

  getGroupById(id: number){
    this.groupService.getGroup(id).subscribe({
      next: (res) => {
        this.group = res;
      }
    });
  }

  getSubgroups(name: string){
    this.groupService.getSubgroups(name).subscribe({
      next: (res: Group[]) => {
        this.subgroups=res;
      }
    });
  }

  getMembers(name: string){
    this.groupService.getPersons(name).subscribe({
      next: (res: Person[]) => {
        this.members=res;
      }
    });
  }

  getManagers(name: string){
    this.groupService.getPersons(name).subscribe({
      next: (res: Person[]) => {
        this.managers=res;
      }
    });
  }
  onClose(){
    this.ref.close();
  }
}
