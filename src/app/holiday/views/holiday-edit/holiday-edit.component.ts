import { Component, ViewChild, ElementRef, OnInit, Output, EventEmitter } from '@angular/core';
import { ScheduleType } from '../../model/schedule-type';
import { MetadataDay } from '../../model/metadata-day';
import { DropdownEntry } from '../../model/dropdown-entry';
import { Festive } from 'src/app/holiday/model/Festive';
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { HolidayService } from '../../holiday.service';

@Component({
  selector: 'app-holiday-editcalendar',
  templateUrl: './holiday-edit.component.html',
  styleUrls: ['./holiday-edit.component.scss'],
})
export class HolidayEditComponent{

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
  oldFestives: MetadataDay[] = [];
  newFestives: MetadataDay[] = [];
  selectedCenter: number;
  centerName: String;


  constructor(public dialogConf: DynamicDialogConfig,
              private holidayService: HolidayService, 
              public ref: DynamicDialogRef) {

  }

  ngOnInit(): void {

    this.centerName = this.dialogConf.data.centerName;
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
    const weekendDay = this.scheduleTypes[3];
    let idF = 0;
    if(this.dialogConf.data.festivesData != undefined){
      this.festives = this.dialogConf.data.festivesData;
      this.selectedCenter = this.festives[0].centerId;
    }

    for (let month = 0; month < 12; month++) {
      for (let day = 1; day <= 31; day++) {
        const date = new Date(parseInt(this.selectedYearAux.code), month, day);
        if (date.getMonth() == month) {
          const isWeekend = date.getDay() == 0 || date.getDay() == 6;

          let type = normalDay;
          let originalType = normalDay;

          const isFestive = this.festives.some(festive => {
            let date = String(festive.date).slice(-2);
            let festiveDay = parseInt(date, 10);
            if (festive.year === Number(this.selectedYearAux.code) &&
                festive.month === month + 1 &&
                festiveDay === day ){     
              idF = festive.id;         
              return true;
            }
          
            return false;
          });

          if (isWeekend) {
            type = this.scheduleTypes.find(
              (type) => type.name === 'Fin de semana'
            );

            originalType = type;
          }

          if (isFestive) {
            type = this.scheduleTypes.find(type => type.name === 'Festivo');
            originalType = type;
            if (isWeekend) {
              originalType = weekendDay;
            }
          }
          
          

          const metadata = new MetadataDay({
            day: day,
            month: month,
            year: parseInt(this.selectedYearAux.code),
            originalType: originalType,
            type: type,
            id: idF,
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
      const newDate = new Date();
      newDate.setDate(day.day);
      newDate.setMonth(day.month /*+1*/);
      newDate.setFullYear(day.year);

      if(isFestive){
        //day.originalType = day.type;
        if(day.originalType == this.scheduleTypes.find(type => type.name === 'Fin de semana')){
          day.type = this.scheduleTypes.find(type => type.name === 'Fin de semana');
        }else{
          day.type = this.scheduleTypes.find(type => type.name === 'Jornada normal (8h 25min)');
        }
        
        if(this.festives.some(festive => this.isSameDate(festive, newDate)) &&
          !this.oldFestives.includes(day)
        ){
          this.oldFestives.push(day);
        }else{
          //Comprobar que el nuevo dia festivo no esté en el array de nuevos dias festivos
          //Si lo está, se elimina
          if(this.newFestives.includes(day)){
            const index = this.newFestives.indexOf(day);
            this.newFestives.splice(index,1);
          }
        }
      }else{
        //day.originalType = day.type;
        
        day.type = this.scheduleTypes.find(type => type.name === 'Festivo');

        //Comprobar si es un dia festivo que ya existia pero se habia puesto en la cola de eliminación
        if(this.festives.some(festive => this.isSameDate(festive, newDate)) &&
          this.oldFestives.includes(day)
        ){
          //Quitar del array de eliminación el dia que ya estaba dado de alta en la BD
          const index = this.oldFestives.indexOf(day);
          this.oldFestives.splice(index,1);
        }else{
          if(!this.newFestives.includes(day)){
            this.newFestives.push(day);
          }
        }
      }

      this.clickEvent.emit(day);
    }
  }

  close(){
    this.ref.close();
  }

  update():void{
    if(this.newFestives.length > 0){
      const festive = new Festive();
      for (const md of this.newFestives) {
        festive.month = md.month+1;
        festive.year = md.year;
        festive.date = this.formatDate(md);
        festive.centerId = this.selectedCenter;
        this.holidayService.save(festive).subscribe();
      }
    }

    if(this.oldFestives.length > 0){
      const festive = new Festive();
      for (const md of this.oldFestives) {
        this.holidayService.delete(md.id).subscribe();
      }
    }

    this.ref.close();
  }

  formatDate(metadataDay:MetadataDay):Date{
    let date: Date;
    date = new Date(""+metadataDay.year+"-"+(metadataDay.month+1)+"-"+metadataDay.day);
    return date;
  }

  private isSameDate(festive: Festive, newDate: Date): boolean {
    let date = String(festive.date).slice(-2);
    let festiveDay = parseInt(date, 10);

    if (festive.year === newDate.getFullYear() &&
        festive.month -1 === newDate.getMonth() &&
        festiveDay === newDate.getDate() ){              
          return true;
    }

    return false;
  }
}
