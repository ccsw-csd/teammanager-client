import { Component, OnInit } from '@angular/core';
import { Group } from 'src/app/group/models/Group';
import { GroupService } from 'src/app/group/services/group.service';
import { ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { NavigatorService } from 'src/app/core/services/navigator.service';
import { Forecast } from '../../model/forecast';
import { FilterService, PrimeNGConfig, SortEvent } from 'primeng/api';

@Component({
  selector: 'app-forecast-list',
  templateUrl: './forecast-list.component.html',
  styleUrls: ['./forecast-list.component.scss'],
  providers: [DialogService, DynamicDialogRef, DynamicDialogConfig, ConfirmationService]
})
export class ForecastListComponent implements OnInit {
  groups: Group[] = [];
  columnNames: any[];
  selectedColumnNames : any[];
  adminView: boolean = false;
  tableWidth: string;
  forecast: Forecast[];
  defaultFilters: any = { };
  
  constructor(
    private ref: DynamicDialogRef,
    private dialogService: DialogService,
    private groupService: GroupService,
    private confirmationService: ConfirmationService,
    private navigatorService: NavigatorService,
  ) { }
  


  ngOnInit(): void {
    this.adminView = false;
    this.resizeTable();
    this.navigatorService.getNavivagorChangeEmitter().subscribe(menuVisible => {
      if (menuVisible) this.tableWidth = 'calc(100vw - 255px)';
      else this.tableWidth = 'calc(100vw - 55px)';
    });
    this.columnNames = [
      { header: 'Group Name', composeField: 'name',field: 'name', filterType: 'input' },
      { header: 'Administrators', composeField: 'manager',field: 'manager', filterType: 'input' },
      { header: 'Members', composeField: 'members',field: 'members', filterType: 'input' },
      { header: 'Subgroups', composeField: 'manager',field: 'manager', filterType: 'input' }
    ];

    this.selectedColumnNames = this.loadSelected();
    this.loadData();
  }

  onColReorder(event): void {
    this.saveSelected(this.selectedColumnNames);
  }

  saveSelected(selectedColumnNames: any[]) {
    localStorage.setItem('internListColumns', JSON.stringify(selectedColumnNames.map(e => e.header)));
  }

  loadData() : void {
    if (this.adminView) {
      this.getAllGroupsAdmin();
    } else {
      this.getAllGroups();
    }
  }

  loadSelected(): any[] {
    let selectedColumnNames: any = localStorage.getItem('internListColumns');
    if (selectedColumnNames == null) return this.columnNames;

    selectedColumnNames = JSON.parse(selectedColumnNames);

    let columns : any[] = [];
    selectedColumnNames.forEach(item => {
      let filterColumn = this.columnNames.filter(column => column.header == item);
      columns = columns.concat(filterColumn);
    });

    return columns;
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

  resizeTable(){
    if(document.getElementById("p-slideMenu")){
      this.tableWidth = 'calc(100vw - 255px)';
    }else{
      this.tableWidth = 'calc(100vw - 55px)';
    }
  }

  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
        let value1 = data1[event.field];
        let value2 = data2[event.field];
        let result = null;

        if (value1 == null && value2 != null) result = -1;
        else if (value1 != null && value2 == null) result = 1;
        else if (value1 == null && value2 == null) result = 0;
        else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2);
        else if (Array.isArray(value1) && Array.isArray(value2)){
          result = value1.sort((a, b) => a.name.localeCompare(b.name)).map((t) => t.name).join(', ').localeCompare(value2.sort((a, b) => a.name.localeCompare(b.name)).map((t) => t.name).join(', '));
        } 
        else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

        return event.order * result;
    });
  }

}
