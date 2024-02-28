

import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output
} from '@angular/core';
import { CalendarDay } from '../../model/calendar-day';
import { MetadataDay } from '../../model/metadata-day';

@Component({
  selector: 'app-component-calendar',
  templateUrl: './edit-calendar.component.html',
  styleUrls: ['./edit-calendar.component.scss'],
})
export class EditCalendarComponent implements OnChanges {
  @Input() year: number;
  @Input() month: number;
  @Input() metadataDay: Map<String, MetadataDay>;
  @Input() workingDaysPerMonth: Number[];
  @Input() withPon: boolean;


  @Output() clickEvent = new EventEmitter<MetadataDay>();

  MONTH_NAMES: string[] = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  data: CalendarDay[][] = [];

  ngOnChanges() {
    this.data = [];

    let date = new Date(this.year, this.month, 1);
    let dayOfWeek = date.getDay() - 1;
    
    if (dayOfWeek < 0) dayOfWeek += 7;
    
    date.setDate(-dayOfWeek + 1);
    
    let monthComplete = false;

    while (monthComplete == false) {
      let week = [];

      for (let i = 0; i < 7; i++) {
        let isActualMonth = date.getMonth() == this.month;
        let isActualYear = date.getFullYear() == this.year;

        let metadata: MetadataDay = null;

        if (isActualYear && this.metadataDay) {
          let key = date.getMonth() + '_' + date.getDate();
          metadata = this.metadataDay.get(key);
        }

        let infoDay = new CalendarDay({
          day: date.getDate(),
          month: date.getMonth(),
          year: date.getFullYear(),
          actualMonth: isActualMonth,
          metadata: metadata,
        });
  
        week.push(infoDay);
        date.setDate(date.getDate() + 1);
      }

      this.data.push(week);

      if (date.getMonth() != this.month) monthComplete = true;
    }

  }

  clickDate(day: CalendarDay): void {
    this.clickEvent.emit(day?.metadata);
  }
}