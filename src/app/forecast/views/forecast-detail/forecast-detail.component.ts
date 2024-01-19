import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Group } from 'src/app/group/models/Group';
import { DropdownEntry } from '../../model/dropdown-entry';

@Component({
  selector: 'app-forecast-detail',
  templateUrl: './forecast-detail.component.html',
  styleUrls: ['./forecast-detail.component.scss']
})
export class ForecastDetailComponent implements OnInit {
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

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.group = JSON.parse(params['group']);
    });

    const actualYear = new Date().getFullYear();
    const actualMonth = new Date().getMonth();

    let name;
    let year;
    let month;
    for (let i = 0; i < 13; i++) {
      
      year = actualYear + Math.floor((actualMonth + i) / 12);
      month = this.month[(actualMonth+i) % 12];
      name = month + " " + year;
      this.monthsList.push(
        new DropdownEntry({ code: name, name: name, year: year, month: month })
      );
    }
  }

  onChangeMonth(event): void {


  }

  previousMonth():void{

  }

  nextMonth():void{

  }

  isPreviousMonthDisabled():boolean{
    return true;
  }

  isNextMonthDisabled():boolean{
    return true;
  }
}
