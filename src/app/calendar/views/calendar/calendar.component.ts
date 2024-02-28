import { Component, ViewChild, ElementRef, OnInit, Output, EventEmitter } from '@angular/core';
import { ScheduleType } from '../model/schedule-type';
import { MetadataDay } from '../model/metadata-day';
import { DropdownEntry } from '../model/dropdown-entry';

import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { AuthService } from 'src/app/core/services/auth.service';

import { CalendarService } from '../../calendar.service';
import { finalize } from 'rxjs';
import { Detail } from '../model/Detail';
import { PersonAbsence } from '../model/PersonAbsence';
import { Person } from '../model/Person';



@Component({
  selector: 'app-edit-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  providers: [DynamicDialogRef, ConfirmationService],
})
export class CalendarComponent {
  @ViewChild('calendarsDiv') calendarsDiv: ElementRef;

  @Output() clickEvent = new EventEmitter<MetadataDay>();

  //ATRIBUTOS

 
  scheduleTypes: ScheduleType[];
  selectedType: ScheduleType;
  selectedYear: DropdownEntry;
  selectedYearAux: DropdownEntry;
  selectedCalendar: Map<String, MetadataDay>;
  detail: Detail;
  withPon: boolean;

  years: DropdownEntry[] = [];
  workingDaysPerMonth: Number[] = [];
  calendars: Map<String, Map<String, MetadataDay>>;

  oldVacations: MetadataDay[] = [];
  newVacations: MetadataDay[] = [];

  constructor(private authService: AuthService,
    private calendarService: CalendarService,
    ) {
    this.calendars = new Map();
    
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
    this.calendarService.getUserDetails(this.selectedYearAux.code).pipe(
      finalize(() => {
        this.withPon = this.detail.person.withPON;
        this.selectedCalendar = this.generateDefaultCalendar();
      })
      ).subscribe({
      next: (res: Detail) => {
        this.detail = res;     
      },
    });   
  }

  isButtonDisabled(): boolean{
    let buttonDisabled = true;

    if((this.oldVacations.length != 0) || (this.newVacations.length != 0)){
      buttonDisabled = false;
    }
    return buttonDisabled;
  }

  isWithPonActive(): boolean{
    let active = true;

    if(this.withPon == false){
      active = false;
    }
    return active;
  }

  selectDate(day:MetadataDay){

    if(day){
      const isVacation = day.type.name === "Vacation";
      const newDate = new Date();
      newDate.setDate(day.day);
      newDate.setMonth(day.month);
      newDate.setFullYear(day.year);

      if(isVacation){
        if(day.originalType == this.scheduleTypes.find(type => type.name === 'Fin de semana')){
          day.type = this.scheduleTypes.find(type => type.name === 'Fin de semana');
        }else{
          day.type = this.scheduleTypes.find(type => type.name === 'Jornada normal (8h 25min)');
        }
        
        if(this.detail.absences.some(vacation => this.isSameDate(vacation, newDate)) &&
          !this.oldVacations.includes(day)
        ){
          this.oldVacations.push(day);
        }else{
          //Comprobar que el nuevo dia de vacaciones no esté en el array de nuevos dias de vacaciones
          //Si lo está, se elimina
          if(this.newVacations.includes(day)){
            const index = this.newVacations.indexOf(day);
            this.newVacations.splice(index,1);
          }
        }
      }else{
        
        day.type = this.scheduleTypes.find(type => type.name === 'Vacation');

        //Comprobar si es un dia de vacaciones que ya existia pero se habia puesto en la cola de eliminación
        if(this.detail.absences.some(vacation => this.isSameDate(vacation, newDate)) &&
          this.oldVacations.includes(day)
        ){
          //Quitar del array de eliminación el dia que ya estaba dado de alta en la BD
          const index = this.oldVacations.indexOf(day);
          this.oldVacations.splice(index,1);
        }else{
          if(!this.newVacations.includes(day)){
            this.newVacations.push(day);
          }
        }
      }

      this.clickEvent.emit(day);
    }
  }

  save():void{
    if(this.newVacations.length > 0){
      const vacation = new PersonAbsence();
      let vacations: PersonAbsence[] = [];
      for (const md of this.newVacations) {
        vacation.id = '_P_' + this.detail.person.id.toString();
        vacation.person = this.detail.person;
        vacation.year = md.year;
        vacation.month = md.month;
        vacation.date = this.formatDate(md);
        vacation.type = 'P';
        vacation.absence_type = 'VAC';
        vacations.push(vacation);    
      }

      this.calendarService.save(vacations).subscribe();
    }

    if(this.oldVacations.length > 0){
      for (const md of this.oldVacations) {
        let id = this.formatDate(md).toString() + '_P_' + this.detail.person.id.toString();
        this.calendarService.delete(id).subscribe();
      }
    }

    setTimeout(() => {
      this.loadUserDetails();
    }, 100);
    
  }

  formatDate(metadataDay:MetadataDay):Date{
    let date: Date;
    date = new Date(""+metadataDay.year+"-"+(metadataDay.month+1)+"-"+metadataDay.day);
    return date;
  }

  private isSameDate(absence: PersonAbsence, newDate: Date): boolean {
    let date = String(absence.date).slice(-2);
    let vacationDay = parseInt(date, 10);

    if (absence.year === newDate.getFullYear() &&
        absence.month -1 === newDate.getMonth() &&
        vacationDay === newDate.getDate() ){              
          return true;
    }

    return false;
  }
}