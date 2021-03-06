import { CompileShallowModuleMetadata } from '@angular/compiler';
import { ThrowStmt, typeofExpr } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { ListadoGrupos } from 'src/app/listado-grupos/model/ListadoGrupos';
import { ForecastService } from '../services/forecast.service';
import { ForecastDetailExportDialogComponent } from './forecast-detail-export-dialog/forecast-detail-export-dialog.component';

@Component({
  selector: 'app-forecast-detail',
  templateUrl: './forecast-detail.component.html',
  styleUrls: ['./forecast-detail.component.scss']
})
export class ForecastDetailComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    public formBuilder: FormBuilder,
    private forecastService: ForecastService,
    public dialog: MatDialog,
    ) {this.form = this.formBuilder.group(this.formControl);}

  firstMonth = true;
  lastMonth = false;
  pageNumber = 0;
  pageSize = 20;
  groupName = "";
  totalElements = 0;
  actualDate = new Date();
  isloading = false;
  initDate = new Date();
  endDate = new Date();
  rangeInitDate = new Date();
  rangeEndDate = new Date();
  id?: string|null;
  selectedMonth = this.actualDate.getMonth();
  dataSource = new MatTableDataSource<any>();
  countDaysTotal?: number;
  getDaysInMonth = function(year: number, month: number) {
   return new Date(year, month, 0).getDate();
  };

  public form: FormGroup;

  columns: any[] = [
    'name',
    'countLab',
    'countF',
    'countA',
    'countO'
  ];

  months: any[] = [
    {name:"January", num: 0, year: 0},
    {name:"February", num: 1, year: 0},
    {name:"March", num: 2, year: 0},
    {name:"April", num: 3, year: 0},
    {name:"May", num: 4, year: 0},
    {name:"June", num: 5, year: 0},
    {name:"July", num: 6, year: 0},
    {name:"August", num: 7, year: 0},
    {name:"September", num: 8, year: 0},
    {name:"October", num: 9, year: 0},
    {name:"November", num: 10, year: 0},
    {name:"December", num: 11, year: 0}
  ];

  monthsInitial: any[] = [
    {name:"January", num: 0},
    {name:"February", num: 1},
    {name:"March", num: 2},
    {name:"April", num: 3},
    {name:"May", num: 4},
    {name:"June", num: 5},
    {name:"July", num: 6},
    {name:"August", num: 7},
    {name:"September", num: 8},
    {name:"October", num: 9},
    {name:"November", num: 10},
    {name:"December", num: 11}
  ];


  monthsHeaderExtraInfo: any[] = [
    {name:"Detail", num: 5},
    {name:"January", num: 0},
    {name:"February", num: 1},
    {name:"March", num: 2},
    {name:"April", num: 3},
    {name:"May", num: 4},
    {name:"June", num: 5},
    {name:"July", num: 6},
    {name:"August", num: 7},
    {name:"September", num: 8},
    {name:"October", num: 9},
    {name:"November", num: 10},
    {name:"December", num: 11}
  ];

  monthsHeader: any[] = [
    "Detail"
  ];

  monthsHeaderCopy: any[] = [
    "January",
    "February",
    "March", 
    "April",
    "May", 
    "June", 
    "July", 
    "August",
    "September",
    "October",
    "November",
    "December",    
  ];

  transcode: any = {};

  monthsDays: any[] = [
  ];

  myStyles = {

  }

  customer: FormControl = new FormControl();

  public formControl = {
    start: new FormControl(),
    end: new FormControl()
  };

  ngOnInit(): void {
    this.route.queryParams
    .subscribe((params) => {
      this.id = params.id;
      this.groupName = params.name;
    });

    var month = this.selectedMonth;
    var month_year = this.actualDate.getFullYear();
    for(var i = 0; i<12; i++) {
      if(month == 12) {
        month = 0;
        month_year = month_year+1;}

      this.months[i] = {name: this.monthsInitial[month].name, num: this.monthsInitial[month].num, year: month_year};
      month++;}

    this.getAbsences();
  }

  ngAfterViewInit() {
    this.form.valueChanges.pipe(
        debounceTime(200)
    ).subscribe(event => {
        if (event.start && event.end) {
            this.rangeInitDate= event.start;
            this.rangeEndDate = event.end;

            if(this.months.length > 12) this.months.pop();

            this.months.push(
              {name: this.convertDateToString(this.rangeInitDate) + "  -  " + this.convertDateToString(this.rangeEndDate), num: 12, year:''}
            );

            this.selectedMonth = 12;

            if(this.selectedMonth == 12)
              this.getAbsences();
        }
    });
  }


  private convertDateToString(date : Date) : string {
    
    let locale = 'en-EN';
    return date.toLocaleDateString(locale, {day:'2-digit'})+"/"
      +date.toLocaleDateString(locale, {month:'2-digit'})+"/"
      +date.toLocaleDateString(locale, {year:'numeric'});
  }


  private convertDateToServerString(date : Date) : string {
    
    let locale = 'en-EN';
    return date.toLocaleDateString(locale, {year:'numeric'})+"-"
      +date.toLocaleDateString(locale, {month:'2-digit'})+"-"
      +date.toLocaleDateString(locale, {day:'2-digit'});
  }  




  ngOnChanges() {
    this.getAbsences();
  }

  getAbsences(): void
  {

    if(this.selectedMonth == this.months[0].num)
      this.firstMonth = true;
    else
      this.firstMonth = false;
    
    if (this.selectedMonth == this.months[11].num || this.selectedMonth > 11)
      this.lastMonth = true;
    else 
      this.lastMonth = false;


    var month_year = this.actualDate.getFullYear();

    for(var i = 0; i< this.months.length; i++) {
      if(this.months[i].num == this.selectedMonth)
        month_year = this.months[i].year;
    }

    if(this.selectedMonth != 12){
      var lastDays = this.getDaysInMonth(new Date().getFullYear(), this.selectedMonth+1);
      this.initDate = new Date(month_year, this.selectedMonth);
      this.endDate = new Date(month_year, this.selectedMonth, lastDays, 5);
    }
    else{
      this.initDate = this.rangeInitDate;
      this.endDate = this.rangeEndDate;
    }

    var countA;
    var countAusenciaTotal = 0;
    var countO;
    var countOtrosTotal = 0;
    var countFestivoTotal = 0;
    var countLaboralTotal = 0;
    var countF;
    var countLabor;

    this.isloading = true;
    this.forecastService.getAbsences(Number(this.id), this.convertDateToServerString(this.initDate), this.convertDateToServerString(this.endDate)).subscribe(data => {
      var sourceArray: any[] = [];
      this.formatMonths();
      for (var i in data){        
        countA = this.countDays(data[i].absences, "A", "VAC");
        countO = this.countDays(data[i].absences, "A", "OTH");
        countF = this.countDays(data[i].absences, "F", "");
        countLabor = (this.countLaborDays(this.initDate, this.endDate) - (countA + countO + countF));
        var source = {
          name: {value: i, class: "name"},
          countLab: {value: countLabor, class: "count"},
          countF: {value: countF, class: "count"},
          countA: {value: countA, class: "count"},
          countO: {value: countO, class: "count"}
        }
        countAusenciaTotal += countA;
        countOtrosTotal += countO;
        countFestivoTotal += countF;
        countLaboralTotal += countLabor;
        source = this.formatDatasource(data[i].absences, source, data[i].visible);
        sourceArray.push(source);
      }

      sourceArray.sort((a,b) => { return a.name.value.localeCompare(b.name.value); });

      var sourceTotal = {
        name: {value: "Total", class: "total"},
        countLab: {value: countLaboralTotal, class: "total"},
        countF: {value: countFestivoTotal, class: "total"},
        countA: {value: countAusenciaTotal, class: "total"},
        countO: {value: countOtrosTotal, class: "total"}
      }
      var emptyArray: any[] = [];
      sourceTotal = this.formatDatasource(emptyArray, sourceTotal, true);
      sourceArray.push(sourceTotal);

      this.dataSource.data = sourceArray;
      this.isloading = false;
    });

  }

  isSticky(object: any): boolean{
    if(object == "Detail" || object == "Person" || object == "Working Days" || object == "Vacations" || object == "Festives" || object == "Others")
      return true;
    return false;  
  }

  formatMonths(): void
  {
    this.transcode = {};
    this.monthsDays = [];
    this.columns = [];
    this.monthsHeader = ['Detail',];

    this.transcode["name"] = "Person";
    this.transcode["countLab"] = "Working Days";
    this.transcode["countF"] = "Festives";
    this.transcode["countA"] = "Vacations";
    this.transcode["countO"] = "Others";

    this.columns.push('name');
    this.columns.push('countLab');
    this.columns.push('countF');
    this.columns.push('countA');
    this.columns.push('countO');

    this.calculateMonths();

    for(var l = 0; l < this.monthsDays.length; l++)
    {
      for(var o = this.monthsDays[l].init; o <= this.monthsDays[l].end; o++){
        this.columns.push(this.monthsDays[l].year + "/" +this.monthsDays[l].month + "/" + o);
        this.transcode[this.monthsDays[l].year + "/" +this.monthsDays[l].month + "/" + o] = o;
      }
    this.monthsHeader.push(this.monthsHeaderCopy[this.monthsDays[l].month -1]);
    this.monthsHeaderExtraInfo[this.monthsDays[l].month].num = this.monthsDays[l].number+1;
    
    }
  }

  calculateMonths(): void{
    if(this.initDate.getFullYear() == this.endDate.getFullYear()){
      if(this.initDate.getMonth()+1 == this.endDate.getMonth()+1)
        this.monthsDays.push({year: this.initDate.getFullYear(), month: this.initDate.getMonth()+1, number: this.endDate.getDate() - this.initDate.getDate(), init: this.initDate.getDate(), end:  this.endDate.getDate()}); 
      else{
        for(var i = this.initDate.getMonth()+1; i <= this.endDate.getMonth()+1; i++){
          if(i == this.initDate.getMonth()+1){
            this.monthsDays.push({year: this.initDate.getFullYear(), month: i, number: new Date(this.initDate.getFullYear(), i, 0).getDate() - (this.initDate.getDate()), init: this.initDate.getDate(), end:  new Date(this.initDate.getFullYear(), i, 0).getDate()}); 
          }
          else if(i == this.endDate.getMonth()+1){
            this.monthsDays.push({year: this.initDate.getFullYear(), month: i, number: this.endDate.getDate(), init: 1, end:  this.endDate.getDate()}); 
          }
          else
            this.monthsDays.push({year: this.initDate.getFullYear(), month: i, number: new Date(this.initDate.getFullYear(), i, 0).getDate(), init: 1, end: new Date(this.initDate.getFullYear(), i, 0).getDate()});  
       }
      }
    }
    else {
      for(var k = this.initDate.getFullYear(); k <= this.endDate.getFullYear(); k++){

        if(k == this.initDate.getFullYear()){
          for(var i = this.initDate.getMonth()+1; i <= 12; i++){
            if(i == this.initDate.getMonth()+1){
              this.monthsDays.push({year: this.initDate.getFullYear(), month: i, number: new Date(this.initDate.getFullYear(), i, 0).getDate() - (this.initDate.getDate()), init: this.initDate.getDate(), end:  new Date(this.initDate.getFullYear(), i, 0).getDate()}); 
            }
            else
              this.monthsDays.push({year: this.initDate.getFullYear(), month: i, number: new Date(this.initDate.getFullYear(), i, 0).getDate(), init: 1, end: new Date(this.initDate.getFullYear(), i, 0).getDate()});  
          }
        }
        else if(k == this.endDate.getFullYear()){
          for(var i = 1; i <= this.endDate.getMonth()+1; i++){
            if(i == this.endDate.getMonth()+1){
              this.monthsDays.push({year: this.endDate.getFullYear(), month: i, number: this.endDate.getDate(), init: 1, end:  this.endDate.getDate()}); 
            }
            else {
              this.monthsDays.push({year: this.endDate.getFullYear(), month: i, number: new Date(this.endDate.getFullYear(), i, 0).getDate(), init: 1, end: new Date(this.endDate.getFullYear(), i, 0).getDate()});  
            }
          }
        }
        else{
          for(var i = 1; i <= 12; i++){
              this.monthsDays.push({year: k, month: i, number: new Date(k, i, 0).getDate(), init: 1, end: new Date(k, i, 0).getDate()});  
          }
        }
      }
    }
  }
  getHeaderClass(object: any): string{
    if(object == "Person")
      return "name";
    if(object == "Working Days" || object == "Vacations" || object == "Festives" || object == "Others")
      return "count"; 
    return "day";
  }

  formatDatasource(person: any, source: any, visible: boolean): any{

    for(var l = 0; l < this.monthsDays.length; l++)
    {
      for(var o = this.monthsDays[l].init; o <= this.monthsDays[l].end; o++){
        if(visible)
          source[this.monthsDays[l].year + "/" +this.monthsDays[l].month + "/" + o] = {value: "", class: this.typeOfDay(o,this.monthsDays[l].month, this.monthsDays[l].year, person)};
        else
          source[this.monthsDays[l].year + "/" +this.monthsDays[l].month + "/" + o] = {value: "", class: "Blocked"};
      }
    }
    return source;
  }

  countDays(data: any, type: String, absenceType: String): number{
    let count = 0;

    if(type === "A" || type === "P"){
      if(absenceType === "VAC") {
        for (var i in data){
          if((data[i].absence_type === "VAC") && (this.isWeekend(data[i].date) == false))
            count++;
        }
      } else if(absenceType === "OTH"){
        for (var i in data){
          if((data[i].absence_type === "OTH") && (this.isWeekend(data[i].date) == false)){
            count++;
          }
        }
      }
    }
    else if(type === "F"){
      for (var i in data){
        if(data[i].type === "F" && (this.isWeekend(data[i].date) == false))
          count++;
      }
    }
    return count;
  }

  isWeekend(dateString: string): boolean{
    var date: Date = new Date(dateString);
    if((date.getDay() === 6) || (date.getDay() === 0))
      return true
    return false
  }

  countLaborDays(init: Date, end: Date): number
  {
    var workingdays = 0;
    var weekday     = new Array(7);
    weekday[0]="Sunday";
    weekday[1]="Monday";
    weekday[2]="Tuesday";
    weekday[3]="Wednesday";
    weekday[4]="Thursday";
    weekday[5]="Friday";
    weekday[6]="Saturday";

    while (init <= end) 
    {
        var day = weekday[init.getDay()];
        if(day != "Saturday" && day != "Sunday") 
        {
            workingdays++; 
        }

        init = new Date(init.getFullYear(), init.getMonth(), init.getDate() + 1); 
    }
    return workingdays;
  }

  typeOfDay(day: number, month: number, year: number, absences: any): string{
    var date = new Date(year, month-1, day);
    if((date.getDay() === 6) || (date.getDay() === 0))
      return "day Weekend";

    date = new Date(year, month-1, day+1);
    var isFestive = false;
    var isAbsence = false;
    var isOther = false;
    for(var i = 0; i < absences.length; i++){
      if((date.toISOString().substring(0, 10).localeCompare(absences[i].date)) == 0) {
        if(absences[i].absence_type == "VAC")
          isAbsence = true
        else if(absences[i].absence_type == "OTH") 
          isOther = true;
        else
          isFestive = true;
      }
    }
    

    if (isFestive) return "day Festivo";
    if (isAbsence) return "day Ausencia";
    if (isOther) return "day Otros";
    return "day Laboral";
  }

  exportForecast(): void{
    const dialogRef = this.dialog.open(ForecastDetailExportDialogComponent, {width: "500px", data: {
      groupId: Number(this.id),
      init: this.initDate,
      end: this.endDate
    }});
        dialogRef.afterClosed().subscribe(() => {
        });
   
  }

  nextMonth() {
    this.selectedMonth++;
    if(this.selectedMonth == 12)
      this.selectedMonth = 0;
    this.getAbsences();
  }

  previousMonth() {

    if(this.selectedMonth > 11) {
      this.selectedMonth = this.months[11].num;
    }
    else {
    this.selectedMonth--;
    if(this.selectedMonth == -1)
      this.selectedMonth = 11;
    }
    this.getAbsences();
  }
}
