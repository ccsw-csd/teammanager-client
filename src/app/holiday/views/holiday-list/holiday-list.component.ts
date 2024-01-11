import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CenterWithFestives } from 'src/app/holiday/model/CenterWithFestives';
import { Festive } from 'src/app/holiday/model/Festive';
import { HolidayService } from '../../holiday.service';
import { HolidayEditComponent } from '../holiday-edit/holiday-edit.component';

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
          this.getAllCenters();
        });
      },
    });
  }

}
