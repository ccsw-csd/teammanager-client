import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Group } from 'src/app/group/models/Group';
import { DropdownEntry } from '../../model/dropdown-entry';
import { NavigatorService } from 'src/app/core/services/navigator.service';
import { MetadataDay } from '../../model/metadata-day';
import { ScheduleType } from '../../model/schedule-type';
import { GroupMember } from '../../model/GroupMember';
import { ForecastService } from '../../forecast.service';
import { Person } from '../../model/Person';
import { Detail } from '../../model/Detail';
import { PersonAbsence } from '../../model/PersonAbsence';

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
    'December'
  ];

  group: Group;
  selectedMonth: DropdownEntry;
  monthsList: DropdownEntry[] = [];
  monthDays: Map<String, MetadataDay>;
  monthDaysList: any[];
  details: Detail[] = [];
  absences: PersonAbsence[] = [];
  groupMembers: GroupMember[];

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
    ];

    const actualYear = new Date().getFullYear();
    const actualMonth = new Date().getMonth();

    let name;
    let year;
    let month;
    for (let i = 0; i < 13; i++) {
      
      year = actualYear + Math.floor((actualMonth + i) / 12);
      month = (actualMonth+i) % 12;
      name = this.month[month] + " " + year;
      this.monthsList.push(
        new DropdownEntry({ code: name, name: name, year: year, month: month })
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
    let month = Number(this.selectedMonth.month) +1;
    let year = Number(this.selectedMonth.year)
    let date = new Date(year,month, 0);
    let lastDay = date.getDate();

    const normalDay = this.scheduleTypes[1];
    

    for(let day = 1; day <= lastDay; day++){

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
        month: Number(this.selectedMonth.month),
        year: year,
        type: type,
        
      });          

      const key = month + '_' + day;
      metadataDay.set(key, metadata);
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
    
    this.forecastService.getMembersDetails(id, firstDay, lastDay).subscribe({
      next: (res: Detail[]) => {
        this.details = res;
      },
    });   
  }

}
