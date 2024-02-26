import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ScheduleType } from '../model/schedule-type';
import { MetadataDay } from '../model/metadata-day';
import { DropdownEntry } from '../model/dropdown-entry';

import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { AuthService } from 'src/app/core/services/auth.service';

import { CalendarService } from '../../calendar.service';
import { finalize } from 'rxjs';
import { Detail } from '../model/Detail';



@Component({
  selector: 'app-edit-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  providers: [DynamicDialogRef, ConfirmationService],
})
export class CalendarComponent {
  @ViewChild('calendarsDiv') calendarsDiv: ElementRef;

  //ATRIBUTOS

 
  scheduleTypes: ScheduleType[];
  selectedType: ScheduleType;
  selectedYear: DropdownEntry;
  selectedYearAux: DropdownEntry;
  selectedCalendar: Map<String, MetadataDay>;
  activeUser: string;
  detail: Detail;

  years: DropdownEntry[] = [];
  workingDaysPerMonth: Number[] = [];
  calendars: Map<String, Map<String, MetadataDay>>;

  constructor(private authService: AuthService,
    private calendarService: CalendarService,
    ) {
    this.calendars = new Map();

    this.activeUser = authService.getUserInfo().username;
    
    const actualYear = new Date().getFullYear() ;
    for (let i = actualYear; i <= actualYear + 1; i++) {
      this.years.push(
        new DropdownEntry({ code: i.toString(), name: i.toString() })
      );
    }

    this.selectedYearAux = {
      code: actualYear.toString(),
      name: actualYear.toString(),
    };

    this.loadUserDetails();

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
      new ScheduleType({
        name: 'Vacation',
        absence: true,
        color: '#ffffaa',
        id: 4,
      }),
      new ScheduleType({
        name: 'Other',
        absence: true,
        color: '#f7bd46',
        id: 5,
      })
    ];

    this.selectedType = this.scheduleTypes[0];
  }

  onChangeYear(event): void {
    this.loadUserDetails();
  }

  selectType(type: ScheduleType): void {
    this.selectedType = type;
  }

  private generateDefaultCalendar(): Map<String, MetadataDay> {
    const metadataDay = new Map<String, MetadataDay>();
    const normalDay = this.scheduleTypes[1];
    const weekendDay = this.scheduleTypes[3];
    let idAbsence = '0';

    this.workingDaysPerMonth = [];

    for (let month = 0; month < 12; month++) {
      const monthDays = new Date(Number(this.selectedYearAux.code), month + 1, 0).getDate();
      let workingDays = monthDays;
      for (let day = 1; day <= monthDays; day++) {
        const date = new Date(parseInt(this.selectedYearAux.code), month, day);
        if (date.getMonth() == month) {
          const isWeekend = date.getDay() == 0 || date.getDay() == 6;

          let type = normalDay;
          let originalType = normalDay;

          const isFestive = this.detail.absences.some(absence => {
            let date = String(absence.date);
            let dateAux = new Date(date);
            let absenceDay = dateAux.getDate();

            if (absence.year === Number(this.selectedYearAux.code) &&
                absence.month === month + 1 &&
                absenceDay === day &&
                absence.type == 'F'){ 
                  idAbsence = absence.id;      
              return true;
            }
          
            return false;
          });

          const isVacation = this.detail.absences.some(absence => {
            let date = String(absence.date);
            let dateAux = new Date(date);
            let absenceDay = dateAux.getDate();
            if (absence.year === Number(this.selectedYearAux.code) &&
                absence.month === month + 1 &&
                absenceDay === day &&
                absence.absence_type == 'VAC'){  
                  idAbsence = absence.id;         
              return true;
            }
          
            return false;
          });

          const isOther = this.detail.absences.some(absence => {
            let date = String(absence.date);
            let dateAux = new Date(date);
            let absenceDay = dateAux.getDate();
            if (absence.year === Number(this.selectedYearAux.code) &&
                absence.month === month + 1 &&
                absenceDay === day &&
                absence.absence_type == 'OTH'){ 
                  idAbsence = absence.id;         
              return true;
            }
          
            return false;
          });

          if (isWeekend) {
            type = this.scheduleTypes.find(
              (type) => type.name == 'Fin de semana'
            );
            
            workingDays--;
            originalType = type;
          }

          if (isVacation) {
            type = this.scheduleTypes.find(type => type.name === 'Vacation');
            originalType = type;
              
            
            if (isWeekend) {
              originalType = weekendDay;
            }else{
              workingDays--; 
            }
          }

          if (isOther) {
            type = this.scheduleTypes.find(type => type.name === 'Other');
            originalType = type;
  
            if (isWeekend) {
              originalType = weekendDay;
            }else{
              workingDays--; 
            }
          }

          if (isFestive) {
            type = this.scheduleTypes.find(type => type.name === 'Festivo');
            originalType = type;
 
            if (isWeekend) {
              originalType = weekendDay;
            }else{
              workingDays--; 
            }
          }

          const metadata = new MetadataDay({
            day: day,
            month: month+1,
            year: parseInt(this.selectedYearAux.code),
            originalType: type,
            type: type,
            id: parseInt(idAbsence)
          });

          const key = month + '_' + day;
          metadataDay.set(key, metadata);
        }
      }
      this.workingDaysPerMonth.push(workingDays);
    }
    
    return metadataDay;
  }

  loadUserDetails(){
    this.calendarService.getUserDetails(this.activeUser, this.selectedYearAux.code).pipe(
      finalize(() => {
        this.selectedCalendar = this.generateDefaultCalendar();
      })
      ).subscribe({
      next: (res: Detail) => {
        this.detail = res;
      },
    });   
  }
}