import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CenterWithFestives } from 'src/app/holiday/model/CenterWithFestives';
import { Center } from 'src/app/holiday/model/Center';
import { Festive } from 'src/app/holiday/model/Festive';
import { HolidayService } from '../../holiday.service';
import { CalendarComponent } from 'src/app/calendar/views/calendar/calendar.component';

@Component({
  selector: 'app-holiday-list',
  templateUrl: './holiday-list.component.html',
  styleUrls: ['./holiday-list.component.scss'],
  providers: [DialogService, DynamicDialogRef, DynamicDialogConfig,ConfirmationService]
})
export class HolidayListComponent implements OnInit {

  centers: CenterWithFestives[];
  festives: Festive[];
  constructor(
    private ref: DynamicDialogRef,
    private dialogService: DialogService,
    private holidayService: HolidayService,
  ) { }

  ngOnInit(): void {
    this.getAllCenters();
  }

  getAllCenters() {
    this.holidayService.getAllCenters().subscribe({
      next: (res: CenterWithFestives[]) => {
        this.centers = res;
      },
    });

  }

  editCenter(center:CenterWithFestives){
    
    this.holidayService.getCenterFestives(center).subscribe({
      next: (res: Festive[]) => {
        this.festives = res;
      },
    });

    this.ref = this.dialogService.open(CalendarComponent,{
      height:'calc(100vh - 1px)',
      width:'1200px',
      baseZIndex: 10000,
      contentStyle: { overflow: 'auto' },
      data:{
        festivesData: this.festives
      },
      closable:true
    });
  }

}
