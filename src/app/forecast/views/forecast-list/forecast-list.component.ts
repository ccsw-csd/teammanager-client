import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, SortEvent } from 'primeng/api';
import { NavigatorService } from 'src/app/core/services/navigator.service';
import { Group } from 'src/app/group/models/Group';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { GroupService } from 'src/app/group/services/group.service';
import { Table } from 'primeng/table';
import { ForecastDetailComponent } from '../forecast-detail/forecast-detail.component';
import { Router } from '@angular/router';
import { Detail } from '../../model/Detail';
import { ForecastService } from '../../forecast.service';
import { GroupMember } from '../../model/GroupMember';
import { Person } from '../../model/Person';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-forecast-list',
  templateUrl: './forecast-list.component.html',
  styleUrls: ['./forecast-list.component.scss'],
  providers: [DialogService, DynamicDialogRef, DynamicDialogConfig, ConfirmationService]

})
export class ForecastListComponent implements OnInit {
  @ViewChild(Table) table: Table;
  groups: Group[] = [];
  adminView: boolean = false;
  tableWidth: string;
  defaultFilters: any = { };
  columnNames: any[];
  selectedColumnNames : any[];
  totalGroups: number;
  groupMembers: GroupMember[];
  details: Detail[] = [];

  constructor(
    
    private ref: DynamicDialogRef,
    private dialogService: DialogService,
    private groupService: GroupService,
    private confirmationService: ConfirmationService,
    private navigatorService: NavigatorService,
    private router: Router,
    private forecastService: ForecastService,
  ) { }

  ngOnInit(): void {
    this.adminView = false;
    this.resizeTable();
    
    this.navigatorService.getNavivagorChangeEmitter().subscribe((menuVisible) => {
      if (menuVisible) this.tableWidth = 'calc(100vw - 255px)';
      else this.tableWidth = 'calc(100vw - 55px)';
    }); 

    this.loadData();
  }

  loadData() : void {
    if (this.adminView) {
      this.getAllGroupsAdmin();
    } else {
      this.getAllGroups();
    }
  }

  clickAdminView(e) {
    this.adminView = e.checked;
    this.loadData();
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

  openModal(header: string, group: Group, mode: 'visualizar') {
    this.router.navigate(['../forecast-detail', { 
      group: JSON.stringify(group),
      details: JSON.stringify(this.details)
     }]);
  }

  viewGroup(group: Group, mode: 'visualizar') {
    this.loadGroupMembers(group);
  }

  resizeTable() {
    if (document.getElementById('p-slideMenu')) {
      this.tableWidth = 'calc(100vw - 255px)';
    } else {
      this.tableWidth = 'calc(100vw - 55px)';
    }
  }

  onClose(): void {
    this.ref.onClose.subscribe(
      (results: any) => {
        if (results)
        this.loadData();
      }
    )
  }

  loadGroupMembers(group: Group):void{
    let id = group.id.toString();
    this.forecastService.getGroupMembers(id).subscribe({
      next: (res: GroupMember[]) => {
        this.groupMembers = res;
        this.getPersonData(group); 

      },
    });   
  }

  getPersonData(group: Group): void {
    const observables = this.groupMembers.map(member => {
      return this.forecastService.getPersonData(member.person_id);
    });
  
    //TODO: Recoger valores de dias festivos y demás
    forkJoin(observables).subscribe(
      (people: Person[]) => {
        people.forEach(person => {
          const detail: Detail = {
            person: person,
            workingDays: 60,
            festives: 2,
            vacations: 3,
            others: 4,
            fullName: person.name + " " + person.lastname,
          };
          this.details.push(detail);
        });

        this.dataLoaded(group);
      },
      error => {
        console.error("Error recogiendo datos", error);
      }
    );
  }
  
  dataLoaded(group: Group): void {
    this.openModal('Visualice Group', group, 'visualizar');
  }
}
