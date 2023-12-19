import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CenterWithFestives } from 'src/app/holiday/model/CenterWithFestives';
import { HolidayService } from '../../holiday.service';

@Component({
  selector: 'app-holiday-list',
  templateUrl: './holiday-list.component.html',
  styleUrls: ['./holiday-list.component.scss'],
  providers: [DialogService, DynamicDialogRef, DynamicDialogConfig,ConfirmationService]
})
export class HolidayListComponent implements OnInit {

  centers: CenterWithFestives[];
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

}
