import { Component, ViewChild, ElementRef, OnInit, Output, EventEmitter } from '@angular/core';
import { ScheduleType } from '../model/schedule-type';
import { MetadataDay } from '../model/metadata-day';
import { DropdownEntry } from '../model/dropdown-entry';
import { Festive } from 'src/app/holiday/model/Festive';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-edit-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  providers: [DynamicDialogRef, ConfirmationService],
})
export class CalendarComponent{
  @ViewChild('calendarsDiv') calendarsDiv: ElementRef;


  @Output() clickEvent = new EventEmitter<MetadataDay>();
  //ATRIBUTOS

 
  scheduleTypes: ScheduleType[];
  selectedType: ScheduleType;
  selectedYear: DropdownEntry;
  selectedYearAux: DropdownEntry;
  selectedCalendar: Map<String, MetadataDay>;

  years: DropdownEntry[] = [];
  calendars: Map<String, Map<String, MetadataDay>>;
  festives: Festive[];


  constructor(public dialogConf: DynamicDialogConfig) {
    this.calendars = new Map();
    

    /*
    const actualYear = new Date().getFullYear() + 1;
    for (let i = actualYear + 1; i >= 2022; i--) {
      this.years.push(
        new DropdownEntry({ code: i.toString(), name: i.toString() })
      );
    }

    */

    const actualYear = new Date().getFullYear() ;
    for (let i = actualYear -2; i <= actualYear + 2; i++) {
      this.years.push(
        new DropdownEntry({ code: i.toString(), name: i.toString() })
      );
    }

    this.selectedYearAux = {
      code: actualYear.toString(),
      name: actualYear.toString(),
    };

    this.scheduleTypes = [
      new ScheduleType({
        id: 1,
        name: 'Festivo',
        absence: true,
        color: '#aae3ff',
      }),
      new ScheduleType({
        id: 2,
        name: 'Jornada normal (8h 25min)',
        absence: false,
        color: 'transparent',
        hours: 8,
        minutes: 25,
      }),
      new ScheduleType({
        id: 3,
        name: 'Jornada intensiva (7h)',
        absence: false,
        color: '#ffaaaa',
        hours: 7,
        minutes: 0,
      }),
      new ScheduleType({
        name: 'Fin de semana',
        absence: true,
        color: '#c2c2cc',
        id: 9,
      }),
    ];

    this.selectedType = this.scheduleTypes[0];
    this.selectedCalendar = this.generateDefaultCalendar();
  }

  onChangeYear(): void {
    this.selectedCalendar = this.generateDefaultCalendar();
  }

  selectType(type: ScheduleType): void {
    this.selectedType = type;
  }

  private generateDefaultCalendar(): Map<String, MetadataDay> {
    const metadataDay = new Map<String, MetadataDay>();
    const normalDay = this.scheduleTypes[1];

    if(this.dialogConf.data.festivesData != undefined){
      this.festives = this.dialogConf.data.festivesData;
    }

    for (let month = 0; month < 12; month++) {
      for (let day = 1; day <= 31; day++) {
        const date = new Date(parseInt(this.selectedYearAux.code), month, day);
        if (date.getMonth() == month) {
          const isWeekend = date.getDay() == 0 || date.getDay() == 6;

          let type = normalDay;

          const isFestive = this.festives.some(festive => {
            let date = String(festive.date).slice(-2);
            let festiveDay = parseInt(date, 10);
            if (festive.year === Number(this.selectedYearAux.code) &&
                festive.month === month + 1 &&
                festiveDay === day ){              
              return true;
            }
          
            return false;
          });

          if (isFestive) {
            type = this.scheduleTypes.find(type => type.name === 'Festivo');
          }
          
          if (isWeekend) {
            type = this.scheduleTypes.find(
              (type) => type.name === 'Fin de semana'
            );
          }

          const metadata = new MetadataDay({
            day: day,
            month: month,
            year: parseInt(this.selectedYearAux.code),
            originalType: type,
            type: type,
          });

          const key = month + '_' + day;
          metadataDay.set(key, metadata);
        }
      }
    }

    return metadataDay;
  }

  selectDate(day:MetadataDay){

    if(day){
      const isFestive = day.type.name === "Festivo";

      if(isFestive){
        day.originalType = day.type;
        day.type = this.scheduleTypes.find(type => type.name === 'Jornada normal (8h 25min)');
      }else{
        day.originalType = day.type;
        day.type = this.scheduleTypes.find(type => type.name === 'Festivo');
      }

      this.clickEvent.emit(day);
    }
  }
}
