import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Group } from 'src/app/group/models/Group';
import { DropdownEntry } from '../../model/dropdown-entry';
import { NavigatorService } from 'src/app/core/services/navigator.service';
import { MetadataDay } from '../../model/metadata-day';
import { ScheduleType } from '../../model/schedule-type';
import { GroupMember } from '../../model/GroupMember';
import { ForecastService } from '../../forecast.service';
import { Detail } from '../../model/Detail';
import { PersonAbsence } from '../../model/PersonAbsence';
import { finalize } from 'rxjs';
import * as XLSX from 'xlsx-js-style';



@Component({
  selector: 'app-forecast-detail',
  templateUrl: './forecast-detail.component.html',
  styleUrls: ['./forecast-detail.component.scss']
})
export class ForecastDetailComponent implements OnInit {

  tableWidth: string;

  scheduleTypes: ScheduleType[];
  month: string[] = [
    'January', 
    'February',
    'March',
    'April', 
    'May', 
    'June', 
    'July', 
    'August', 
    'September', 
    'October', 
    'November', 
    'December',
  ];

  absenceTypes: string[][] = [
    ['Public Holidays', 'aae3ff'],
    ['Vacation', 'ffffaa'],
    ['Weekend', 'c2c2cc' ],
    ['Other', 'f7bd46']
  ]

  group: Group;
  selectedMonth: DropdownEntry;
  monthsList: DropdownEntry[] = [];
  monthDays: Map<String, MetadataDay>;
  monthDaysList: any[];
  details: Detail[] = [];
  absences: PersonAbsence[] = [];
  groupMembers: GroupMember[];
  memberDays: any[] = [];
  rangeDates: Date[] = [];
  checked: boolean = false;
  visible: boolean = false;
  mode: string = null;
  letra: string[] = Array.from({length: 26}, (_, i) => String.fromCharCode('A'.charCodeAt(0) + i));

  constructor(
    private route: ActivatedRoute,
    private navigatorService: NavigatorService,
    private forecastService: ForecastService,
  ) { }

  ngOnInit(): void {
    this.resizeTable();
    this.route.params.subscribe((params) => {
      this.group = JSON.parse(params['group']);
    });

    this.navigatorService.getNavivagorChangeEmitter().subscribe((menuVisible) => {
      if (menuVisible) this.tableWidth = 'calc(100vw - 250px)';
      else this.tableWidth = 'calc(100vw - 50px)';
    });

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

    const actualYear = new Date().getFullYear();
    const actualMonth = new Date().getMonth();

    let name;
    let year;
    let month;
    let monthAux;
    for (let i = 0; i < 13; i++) {
      
      year = actualYear + Math.floor((actualMonth + i) / 12);
      month = (actualMonth+i) % 12;
      monthAux = month + 1;
      name = this.month[month] + " " + year;
      let date = new Date(year,monthAux, 0);

      this.monthsList.push(
        new DropdownEntry({ 
          code: name, 
          name: name, 
          year1: year, 
          year2: year, 
          month1: month, 
          month2: month,
          day1: 1,
          day2: date.getDate() })
      );

      
    }

    this.selectedMonth = this.monthsList[0];

    this.monthDays = this.generateDays();
    this.monthDaysList = Array.from(this.monthDays);

    this.loadMembersDetails();
  }

  onChangeMonth(event): void {
    this.monthDays = this.generateDays();
    this.monthDaysList = Array.from(this.monthDays);  

    this.loadMembersDetails();
  }

  previousMonth():void{
    const pos = this.monthsList.indexOf(this.selectedMonth);
    this.selectedMonth = this.monthsList[pos-1];
    this.monthDays = this.generateDays();
    this.monthDaysList = Array.from(this.monthDays);

    this.loadMembersDetails();
  }

  nextMonth():void{
    const pos = this.monthsList.indexOf(this.selectedMonth);
    this.selectedMonth = this.monthsList[pos+1];
    this.monthDays = this.generateDays();
    this.monthDaysList = Array.from(this.monthDays);

    this.loadMembersDetails();
  }

  generateDays(): Map<String, MetadataDay>{

    const metadataDay = new Map<String, MetadataDay>();
    let month = 0;
    let year = 0;
    let lastDay = 0;
    let firstDay = 1;
    const normalDay = this.scheduleTypes[1];
    
    if(this.selectedMonth.month1 == this.selectedMonth.month2){
      month = Number(this.selectedMonth.month1) +1;
      year = Number(this.selectedMonth.year1);
      firstDay = this.selectedMonth.day1;
      lastDay = this.selectedMonth.day2;


      for(let day = firstDay; day <= lastDay; day++){

        const dateAux = new Date(year, month-1, day);
        let type = normalDay;
        const isWeekend = dateAux.getDay() == 0 || dateAux.getDay() == 6;
        
        if (isWeekend) {
          type = this.scheduleTypes.find(
            (type) => type.name === 'Fin de semana'
          );
        }
  
        const metadata = new MetadataDay({
          day: day,
          month: Number(this.selectedMonth.month1),
          year: year,
          type: type,
          originalType: type,
          
        });          
  
        const key = month + '_' + day;
        metadataDay.set(key, metadata);
      }
    
    }else{
      let firstdate = new Date(
        this.selectedMonth.year1,
        this.selectedMonth.month1, 
        this.selectedMonth.day1
      );

      let lastDate = new Date(
        this.selectedMonth.year2,
        this.selectedMonth.month2, 
        this.selectedMonth.day2
      );

      const dif = Math.abs(lastDate.getTime() - firstdate.getTime());
      const daysBetween = Math.ceil(dif / (1000 * 3600 * 24));
      let dateAux = new Date(firstdate.getFullYear(), firstdate.getMonth(), firstdate.getDate());
      dateAux.setDate(dateAux.getDate() -1);

      for(let i = 0; i <= daysBetween; i++){

        dateAux.setDate(dateAux.getDate() + 1);
        let type = normalDay;
        const isWeekend = dateAux.getDay() == 0 || dateAux.getDay() == 6;
        
        if (isWeekend) {
          type = this.scheduleTypes.find(
            (type) => type.name === 'Fin de semana'
          );
        }

        const metadata = new MetadataDay({
          day: dateAux.getDate(),
          month: dateAux.getMonth(),
          year: dateAux.getFullYear(),
          type: type,
          originalType: type,
          
        });          
  
        const key = (dateAux.getMonth() +1) + '_' + dateAux.getDate();
        metadataDay.set(key, metadata);
      }

    }

    return metadataDay;
  }

  isPreviousMonthDisabled():boolean{
    if (this.monthsList.indexOf(this.selectedMonth) === 0) {
      return true;
    } else {
      return false;
    }
  }

  isNextMonthDisabled():boolean{
    if (this.monthsList.indexOf(this.selectedMonth) === (this.monthsList.length -1)) {
      return true;
    } else {
      return false;
    }
  }

  resizeTable() {
    if (document.getElementById('p-slideMenu')) {
      this.tableWidth = 'calc(100vw - 255px)';
    } else {
      this.tableWidth = 'calc(100vw - 55px)';
    }
  }

  loadMembersDetails():void{
    let id = this.group.id.toString();
    
    let startDate = this.monthDaysList[0];
    let endDate = this.monthDaysList[this.monthDaysList.length -1];

    const firstDay = new Date(Date.UTC(startDate[1].year, startDate[1].month, startDate[1].day));
    const lastDay = new Date(Date.UTC(endDate[1].year, endDate[1].month, endDate[1].day));
    
    this.forecastService.getMembersDetails(id, firstDay, lastDay).pipe(
      finalize(() => {
        this.memberDays = [];
        for (let i = 0; i < this.details.length; i++) {
          this.memberDays.push([]);
        }
        this.generateMemberDays();
      })
      ).subscribe({
      next: (res: Detail[]) => {
        this.details = res;
      },
    });   
  }

  generateMemberDays(){

    let month = 0;
    let year = 0;
    let lastDay = 0;
    let firstDay = 1;
    const normalDay = this.scheduleTypes[1];

    if(this.selectedMonth.month1 == this.selectedMonth.month2){
      month = Number(this.selectedMonth.month1) +1;
      year = Number(this.selectedMonth.year1);
      firstDay = this.selectedMonth.day1;
      lastDay = this.selectedMonth.day2;


      for(let day = firstDay; day <= lastDay; day++){

        const dateAux = new Date(year, month-1, day);
        let type = normalDay;
        const isWeekend = dateAux.getDay() == 0 || dateAux.getDay() == 6;
        
        if (isWeekend) {
          type = this.scheduleTypes.find(
            (type) => type.name === 'Fin de semana'
          );
        }
    
        for(const detail of this.details){
          const metadata = new MetadataDay({
            day: day,
            month: Number(this.selectedMonth.month1),
            year: year,
            type: type,
            originalType: type,
          });

          if(isWeekend){
            detail.workingDays = detail.workingDays -1;
          }
          
          for(const absence of detail.absences){
            const day = new Date(absence.date);
  
            if(absence.year === metadata.year &&
               absence.month === (metadata.month+1) &&
               day.getDate() === metadata.day){
  
                  switch (absence.absence_type) {
                    case "VAC":
                      metadata.type = this.scheduleTypes.find(
                        (type) => type.name === 'Vacation'
                      );
                      break;
                    case "OTH":
                      metadata.type = this.scheduleTypes.find(
                        (type) => type.name === 'Other'
                      );
                      break;
                    default:
                      metadata.type = this.scheduleTypes.find(
                        (type) => type.name === 'Festivo'
                      );
                      break;
                  }
  
            }
            
          }
  
          this.memberDays[this.details.indexOf(detail)].push(metadata);
        }
      }
    
    }else{
      let firstdate = new Date(
        this.selectedMonth.year1,
        this.selectedMonth.month1, 
        this.selectedMonth.day1
      );

      let lastDate = new Date(
        this.selectedMonth.year2,
        this.selectedMonth.month2, 
        this.selectedMonth.day2
      );

      const dif = Math.abs(lastDate.getTime() - firstdate.getTime());
      const daysBetween = Math.ceil(dif / (1000 * 3600 * 24));
      let dateAux = new Date(firstdate.getFullYear(), firstdate.getMonth(), firstdate.getDate());
      dateAux.setDate(dateAux.getDate() -1);

      for(let i = 0; i <= daysBetween; i++){

        dateAux.setDate(dateAux.getDate() + 1);
        let type = normalDay;
        const isWeekend = dateAux.getDay() == 0 || dateAux.getDay() == 6;
        
        if (isWeekend) {
          type = this.scheduleTypes.find(
            (type) => type.name === 'Fin de semana'
          );
        }
    
        for(const detail of this.details){
          const metadata = new MetadataDay({
            day: dateAux.getDate(),
            month: dateAux.getMonth(),
            year: dateAux.getFullYear(),
            type: type,
            originalType: type,
          });

          if(isWeekend){
            detail.workingDays = detail.workingDays -1;
          }
          for(const absence of detail.absences){
            const day = new Date(absence.date);
  
            if(absence.year === metadata.year &&
               absence.month === (metadata.month+1) &&
               day.getDate() === metadata.day){
  
                  switch (absence.absence_type) {
                    case "VAC":
                      metadata.type = this.scheduleTypes.find(
                        (type) => type.name === 'Vacation'
                      );
                      break;
                    case "OTH":
                      metadata.type = this.scheduleTypes.find(
                        (type) => type.name === 'Other'
                      );
                      break;
                    default:
                      metadata.type = this.scheduleTypes.find(
                        (type) => type.name === 'Festivo'
                      );
                      break;
                  }
  
            }
            
          }
  
          this.memberDays[this.details.indexOf(detail)].push(metadata);
        }
      }

    }


    if(this.monthsList.length >= 13){
      this.selectedMonth = this.monthsList[0];
      this.monthsList.pop();
    }

  }

  handleRangeSelection(event) {
    if(this.rangeDates[1]!= null){
      this.addRangeToDropdown();
    }
    
  }

  addRangeToDropdown() {
    let startDate = this.rangeDates[0];
    let endDate = this.rangeDates[1];

    let formattedStartDate = this.formatDate(startDate);
    let formattedEndDate = this.formatDate(endDate);
    let name = formattedStartDate + " - " + formattedEndDate;

    this.monthsList.push(

      new DropdownEntry({ 
        code: name, 
        name: name, 
        year1: this.rangeDates[0].getFullYear(),
        year2: this.rangeDates[1].getFullYear(),  
        month1: this.rangeDates[0].getMonth(),
        month2: this.rangeDates[1].getMonth(),
        day1: this.rangeDates[0].getDate(),
        day2: this.rangeDates[1].getDate()
       })
    );

    this.selectedMonth = this.monthsList[this.monthsList.length -1];
    this.monthDays = this.generateDays();
    this.monthDaysList = Array.from(this.monthDays);  
    this.loadMembersDetails();
  }

  formatDate(date: Date): string {
    let day = date.getDate();
    let month = date.getMonth() + 1; 
    let year = date.getFullYear();

    let formattedDay = (day < 10) ? '0' + day : day.toString();
    let formattedMonth = (month < 10) ? '0' + month : month.toString();

    return formattedDay + '/' + formattedMonth + '/' + year;
  }

  calculateWidth(day: MetadataDay): string{
    const month = day.month;
    const numberOfDays = this.monthDaysList.filter(d => d[1].month === month);
    const calc = numberOfDays.length * 2;
    const tam = calc.toString()+'rem';
    return tam;
  }

  showDialog(){
    this.visible = true;
  }

  checkData(): boolean{
    if((this.monthDaysList[0][1].month == this.monthDaysList[this.monthDaysList.length -1][1].month)
    && (this.monthDaysList[0][1].year == this.monthDaysList[this.monthDaysList.length -1][1].year)
    ){
      return false;
    }else{
      return true;
    }
 
  }

  exportToExcel(){
    if(this.mode == 'PerMonth'){
      this.exportPerMonth();
    }else{
      this.exportAllInOne();
    }
    this.visible = false;
    this.mode = null;
  }

  closeDialog(){
    this.mode = null;
    this.visible = false;
  }

  exportPerMonth(){
    const wb = XLSX.utils.book_new();

    let ws = this.generateSummary();

    XLSX.utils.book_append_sheet(wb, ws, 'Summary');

    let lastMonth = this.monthDaysList[this.monthDaysList.length -1][1].month;
    let lastYear = this.monthDaysList[this.monthDaysList.length -1][1].year;

    for(let year = this.monthDaysList[0][1].year; year <= lastYear; year++){
      for (let month = this.monthDaysList[0][1].month; month <= lastMonth; month++){
        let daysMonth = this.monthDaysList.filter(([key, day]) => day.month === month && day.year === year);
        let memberDaysPerMonth = [];
        let memberDaysPerMonthAux = [];
        for(let i = 0; i < this.memberDays.length; i++){
          memberDaysPerMonthAux = this.memberDays[i].filter(day => {
            return day.month === month && day.year === year;
          });
          memberDaysPerMonth.push(memberDaysPerMonthAux);
        }
        let ws = this.generateMonth(daysMonth, memberDaysPerMonth);
        XLSX.utils.book_append_sheet(wb, ws, this.month[month] + " " + year);
      }
    }

    XLSX.writeFile(wb, 'exportPerMonth.xlsx');
  }

  generateSummary(): XLSX.WorkSheet{
    var wscols = [
      {width: 40, alignment: 'center'},
      {width: 15, alignment: 'center'},
      {width: 10, alignment: 'center'},
      {width: 10, alignment: 'center'},
      {width: 10, alignment: 'center'},
    ];

    let head = ['Detail', '', '', '', ''];
    let header = ['Person', 'Working Days', 'Festives', 'Vacations', 'Others'];

    const wsData = [head];
    wsData.push(header);
    this.details.map(detail => {
      const rowData = [detail.fullName, detail.workingDays.toString(), detail.festives.toString(), detail.vacations.toString(), detail.others.toString()];
      wsData.push(rowData);
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    ws["!cols"] = wscols;
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } },
      { s: { r: 0, c: 5 }, e: { r: 0, c: 6 } } 
    ];

    ws['A1'].s = {
      font: { bold: true },
      fill: { type: 'pattern', patternType: 'solid', fgColor: { rgb: "00EEEEEE" } },
      alignment: { horizontal: 'center' }
    };
    ws['A2'].s = {
      font: { bold: true },
      fill: { type: 'pattern', patternType: 'solid', fgColor: { rgb: "00EEEEEE" } },
      alignment: { horizontal: 'center' }
    };

    ws['B2'].s = {
      font: { bold: true },
      fill: { type: 'pattern', patternType: 'solid', fgColor: { rgb: "00EEEEEE" } },
      alignment: { horizontal: 'center' }
    };

    ws['C2'].s = {
      font: { bold: true },
      fill: { type: 'pattern', patternType: 'solid', fgColor: { rgb: "00EEEEEE" } },
      alignment: { horizontal: 'center' }
    };

    ws['D2'].s = {
      font: { bold: true },
      fill: { type: 'pattern', patternType: 'solid', fgColor: { rgb: "00EEEEEE" } },
      alignment: { horizontal: 'center' }
    };

    ws['E2'].s = {
      font: { bold: true },
      fill: { type: 'pattern', patternType: 'solid', fgColor: { rgb: "00EEEEEE" } },
      alignment: { horizontal: 'center' }
    };

    return ws;
  }

  generateMonth(daysMonth: any[], memberDaysPerMonth: any[]): XLSX.WorkSheet{
    let i = 0;
    var wscols = [
      {width: 40, alignment: 'center'},
      {width: 15, alignment: 'center'},
      {width: 10, alignment: 'center'},
      {width: 10, alignment: 'center'},
      {width: 10, alignment: 'center'},
    ];

    let currentMonth = this.month[daysMonth[0][1].month];
    let head = ['Detail', '', '', '', '', currentMonth];
    let header = ['Person', 'Working Days', 'Festives', 'Vacations', 'Others'];

    daysMonth.forEach(day => {
      wscols.push({width: 5, alignment: 'center'});
      header.push(day[1].day);
      head.push('');
    });

    const wsData = [head];
    wsData.push(header);

    let indexPerson = 0;
    this.details.map(detail => {
      let others = 0;
      let festives = 0;
      let vacations = 0;
      let workingDaysAux = daysMonth.length;
      memberDaysPerMonth[indexPerson].forEach(day => {
        switch(day.type.name){
          case 'Other':
            workingDaysAux--;
            others++
            break;
          
          case 'Fin de semana':
            workingDaysAux--;
            break;
        
          case 'Festivo':
            workingDaysAux--;
            festives++;
            break;
  
          case 'Vacation':
            workingDaysAux--;
            vacations++;
  
          default:
            break;
  
        }
      });
      const rowData = [detail.fullName, workingDaysAux.toString(), festives.toString(), vacations.toString(), others.toString()];
      daysMonth.forEach(day => {   
        rowData.push('');
        i++;
      });
      i = 0;
      wsData.push(rowData);
      indexPerson++;
    });

    wsData.push([]);
    wsData.push([]);

    //Generar leyenda de colores
    this.absenceTypes.forEach(([type, color]) => {
      const rowData = ['',type,''];
      wsData.push(rowData);
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // Formato de celdas

    ws["!cols"] = wscols;
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } },
      { s: { r: 0, c: 5 }, e: { r: 0, c: 6 } } 
    ];

    ws['A1'].s = {
      font: { bold: true },
      fill: { type: 'pattern', patternType: 'solid', fgColor: { rgb: "00EEEEEE" } },
      alignment: { horizontal: 'center' }
    };
    ws['A2'].s = {
      font: { bold: true },
      fill: { type: 'pattern', patternType: 'solid', fgColor: { rgb: "00EEEEEE" } },
      alignment: { horizontal: 'center' }
    };

    ws['B2'].s = {
      font: { bold: true },
      fill: { type: 'pattern', patternType: 'solid', fgColor: { rgb: "00EEEEEE" } },
      alignment: { horizontal: 'center' }
    };

    ws['C2'].s = {
      font: { bold: true },
      fill: { type: 'pattern', patternType: 'solid', fgColor: { rgb: "00EEEEEE" } },
      alignment: { horizontal: 'center' }
    };

    ws['D2'].s = {
      font: { bold: true },
      fill: { type: 'pattern', patternType: 'solid', fgColor: { rgb: "00EEEEEE" } },
      alignment: { horizontal: 'center' }
    };

    ws['E2'].s = {
      font: { bold: true },
      fill: { type: 'pattern', patternType: 'solid', fgColor: { rgb: "00EEEEEE" } },
      alignment: { horizontal: 'center' }
    };

    //Formato para las ausencias de cada persona

    let j = 3;
    let z = 0;

    for (let detailIndex = 0; detailIndex < this.details.length; detailIndex++) {
      let indexAux = 0;
      z = 0;
      for (let i = 0; i < daysMonth.length; i++) {
        let color = '00FFFFFF';

        if (memberDaysPerMonth[detailIndex][i]?.type.color !== "transparent") {
          color = memberDaysPerMonth[detailIndex][i]?.type.color.substring(1);
        }

        let style = {
          fill: {
            fgColor: { rgb: color },
          },
        };

        let cell = '';
        let headerCell = '';
        
        if (i < 21) {
          cell = this.letra[i + 5] + j;
          //Formato cabecera día y mes
          if( j == 3){
            headerCell = this.letra[i + 5] + (j - 1);
            ws[headerCell].s = {
              font: { bold: true },
              fill: { type: 'pattern', patternType: 'solid', fgColor: { rgb: "00EEEEEE" } },
              alignment: { horizontal: 'center' }
            };
            headerCell = this.letra[i + 5] + (j - 2);
            ws[headerCell].s = {
              font: { bold: true },
              fill: { type: 'pattern', patternType: 'solid', fgColor: { rgb: "00EEEEEE" } },
              alignment: { horizontal: 'center' }
            };
          }         
        } else {
          if ((i - 47) % 26 === 0 && i > 46) {
            z++;
            indexAux = 0;
          }
          cell = this.letra[z] + this.letra[indexAux] + j;
          //Formato cabecera día
          if( j == 3){
            headerCell = this.letra[z] + this.letra[indexAux] + (j - 1);
            ws[headerCell].s = {
              font: { bold: true },
              fill: { type: 'pattern', patternType: 'solid', fgColor: { rgb: "00EEEEEE" } },
              alignment: { horizontal: 'center' }
            };
            headerCell = this.letra[z] + this.letra[indexAux] + (j - 2);
            ws[headerCell].s = {
              font: { bold: true },
              fill: { type: 'pattern', patternType: 'solid', fgColor: { rgb: "00EEEEEE" } },
              alignment: { horizontal: 'center' }
            };
          }  
          indexAux++;
        }

        ws[cell].s = style;
      }

      j++;
    }

    j = j+2;


    //Color de la leyenda
    this.absenceTypes.forEach(([type, color]) => {
      let style = {
        fill: {
          fgColor: { rgb: color },
        },
      };
      let cell = 'C'+j;
      ws[cell].s = style;
      j++;

    });
    
    return ws;
  }

  exportAllInOne(){

    const wb = XLSX.utils.book_new();

    let i = 0;
    var wscols = [
      {width: 40, alignment: 'center'},
      {width: 15, alignment: 'center'},
      {width: 10, alignment: 'center'},
      {width: 10, alignment: 'center'},
      {width: 10, alignment: 'center'},
    ];

    let currentMonth = this.month[this.monthDaysList[0][1].month];
    let head = ['Detail', '', '', '', '', currentMonth];
    let header = ['Person', 'Working Days', 'Festives', 'Vacations', 'Others'];

    this.monthDaysList.forEach(day => {
      wscols.push({width: 5, alignment: 'center'});
      header.push(day[1].day);
      if(this.month[day[1].month] != currentMonth){
        currentMonth = this.month[day[1].month];
        head.push(currentMonth);
      }else{
        head.push('');
      }  
    });

    const wsData = [head];
    wsData.push(header);
    this.details.map(detail => {
      const rowData = [detail.fullName, detail.workingDays.toString(), detail.festives.toString(), detail.vacations.toString(), detail.others.toString()];
      this.monthDaysList.forEach(day => {   
        rowData.push('');
        i++;
      });
      i = 0;
      wsData.push(rowData);
    });

    wsData.push([]);
    wsData.push([]);

    //Generar leyenda de colores
    this.absenceTypes.forEach(([type, color]) => {
      const rowData = ['',type,''];
      wsData.push(rowData);
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // Formato de celdas

    ws["!cols"] = wscols;
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } },
      { s: { r: 0, c: 5 }, e: { r: 0, c: 6 } } 
    ];

    ws['A1'].s = {
      font: { bold: true },
      fill: { type: 'pattern', patternType: 'solid', fgColor: { rgb: "00EEEEEE" } },
      alignment: { horizontal: 'center' }
    };
    ws['A2'].s = {
      font: { bold: true },
      fill: { type: 'pattern', patternType: 'solid', fgColor: { rgb: "00EEEEEE" } },
      alignment: { horizontal: 'center' }
    };

    ws['B2'].s = {
      font: { bold: true },
      fill: { type: 'pattern', patternType: 'solid', fgColor: { rgb: "00EEEEEE" } },
      alignment: { horizontal: 'center' }
    };

    ws['C2'].s = {
      font: { bold: true },
      fill: { type: 'pattern', patternType: 'solid', fgColor: { rgb: "00EEEEEE" } },
      alignment: { horizontal: 'center' }
    };

    ws['D2'].s = {
      font: { bold: true },
      fill: { type: 'pattern', patternType: 'solid', fgColor: { rgb: "00EEEEEE" } },
      alignment: { horizontal: 'center' }
    };

    ws['E2'].s = {
      font: { bold: true },
      fill: { type: 'pattern', patternType: 'solid', fgColor: { rgb: "00EEEEEE" } },
      alignment: { horizontal: 'center' }
    };

    //Formato para las ausencias de cada persona

    let j = 3;
    let z = 0;

    for (let detailIndex = 0; detailIndex < this.details.length; detailIndex++) {
      let indexAux = 0;
      z = 0;
      for (let i = 0; i < this.monthDaysList.length; i++) {
        let color = '00FFFFFF';

        if (this.memberDays[detailIndex][i]?.type.color !== "transparent") {
          color = this.memberDays[detailIndex][i]?.type.color.substring(1);
        }

        let style = {
          fill: {
            fgColor: { rgb: color },
          },
        };

        let cell = '';
        let headerCell = '';
        
        if (i < 21) {
          cell = this.letra[i + 5] + j;
          //Formato cabecera día y mes
          if( j == 3){
            headerCell = this.letra[i + 5] + (j - 1);
            ws[headerCell].s = {
              font: { bold: true },
              fill: { type: 'pattern', patternType: 'solid', fgColor: { rgb: "00EEEEEE" } },
              alignment: { horizontal: 'center' }
            };
            headerCell = this.letra[i + 5] + (j - 2);
            ws[headerCell].s = {
              font: { bold: true },
              fill: { type: 'pattern', patternType: 'solid', fgColor: { rgb: "00EEEEEE" } },
              alignment: { horizontal: 'center' }
            };
          }         
        } else {
          if ((i - 47) % 26 === 0 && i > 46) {
            z++;
            indexAux = 0;
          }
          cell = this.letra[z] + this.letra[indexAux] + j;
          //Formato cabecera día
          if( j == 3){
            headerCell = this.letra[z] + this.letra[indexAux] + (j - 1);
            ws[headerCell].s = {
              font: { bold: true },
              fill: { type: 'pattern', patternType: 'solid', fgColor: { rgb: "00EEEEEE" } },
              alignment: { horizontal: 'center' }
            };
            headerCell = this.letra[z] + this.letra[indexAux] + (j - 2);
            ws[headerCell].s = {
              font: { bold: true },
              fill: { type: 'pattern', patternType: 'solid', fgColor: { rgb: "00EEEEEE" } },
              alignment: { horizontal: 'center' }
            };
          }  
          indexAux++;
        }

        ws[cell].s = style;
      }

      j++;
    }

    j = j+2;


    //Color de la leyenda
    this.absenceTypes.forEach(([type, color]) => {
      let style = {
        fill: {
          fgColor: { rgb: color },
        },
      };
      let cell = 'C'+j;
      ws[cell].s = style;
      j++;

    });


    XLSX.utils.book_append_sheet(wb, ws, 'AllData');

    XLSX.writeFile(wb, 'export.xlsx');

  }

}
