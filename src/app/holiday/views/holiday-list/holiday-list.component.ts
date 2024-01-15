import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CenterWithFestives } from '../../model/CenterWithFestives';
import { Festive } from '../../model/Festive';
import { HolidayService } from '../../holiday.service';
import { HolidayEditComponent } from '../holiday-edit/holiday-edit.component';
import { NavigatorService } from 'src/app/core/services/navigator.service';

@Component({
  selector: 'app-holiday-list',
  templateUrl: './holiday-list.component.html',
  styleUrls: ['./holiday-list.component.scss'],
  providers: [DialogService, DynamicDialogRef, DynamicDialogConfig,ConfirmationService]
})
export class HolidayListComponent implements OnInit {

  centers: CenterWithFestives[];
  festives: Festive[];
  tableWidth: string;
  constructor(
    private ref: DynamicDialogRef,
    private dialogService: DialogService,
    private holidayService: HolidayService,
    private navigatorService: NavigatorService,
  ) { }

  ngOnInit(): void {
    this.navigatorService.getNavivagorChangeEmitter().subscribe((menuVisible) => {
      if (menuVisible) this.tableWidth = 'calc(100vw - 255px)';
      else this.tableWidth = 'calc(100vw - 55px)';
    }); 
    this.getAllCenters();
    
  }

  getAllCenters() {
    this.holidayService.getAllCenters().subscribe({
      next: (res: CenterWithFestives[]) => {
        this.centers = res;
      },
    });

  }

  editCenter(center: CenterWithFestives) {
    this.holidayService.getCenterFestives(center).subscribe({
      next: (res: Festive[]) => {
        this.festives = res;

        const dialogRef = this.dialogService.open(HolidayEditComponent, {
          height: '100vh',
          width: '1200px',
          baseZIndex: 10000,
          contentStyle: { overflow: 'auto' },
          data: {
            festivesData: this.festives,
            centerName: center.name
          },
          closable: false
        });

        dialogRef.onClose.subscribe((result: any) => {
          if (result.toRefresh) {
            this.getAllCenters();
          }
        });
      },
    });
  }

}
