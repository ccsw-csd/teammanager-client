import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, SortEvent } from 'primeng/api';
import { NavigatorService } from 'src/app/core/services/navigator.service';
import { Group } from 'src/app/group/models/Group';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { GroupService } from 'src/app/group/services/group.service';
import { Table } from 'primeng/table';
import { ForecastDetailComponent } from '../forecast-detail/forecast-detail.component';
import { Router } from '@angular/router';

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

  constructor(
    
    private ref: DynamicDialogRef,
    private dialogService: DialogService,
    private groupService: GroupService,
    private confirmationService: ConfirmationService,
    private navigatorService: NavigatorService,
    private router: Router
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
    this.router.navigate(['../forecast-detail', { group: JSON.stringify(group) }]);
  }

  viewGroup(group: Group, mode: 'visualizar') {
    this.openModal('Visualice Group', group, mode);
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
}
