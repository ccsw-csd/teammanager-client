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
  groups: Group[];
  selectedGroup: Group;

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
  }

  getGroupById(id: number){
    this.groupService.getGroup(id).subscribe({
      next: (res) => {
        this.group = res;
      }
    });
  }

  onClose(){
    this.ref.close();
  }
}
