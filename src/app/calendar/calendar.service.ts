import { Injectable } from '@angular/core';
import { MetadataDay } from './views/model/metadata-day';
import { Festive } from '../holiday/model/Festive';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor() { }


  update(festives:MetadataDay[]){

    if(festives.length > 0){

    }

  }

  delete(festives:MetadataDay[]){

    if(festives.length > 0){
      const element = new Festive();
      let date: Date;
      for (const metadataDay of festives) {
        element.month = metadataDay.month+1;
        element.year = metadataDay.year;
        if(element.month < 10){
          date = new Date(metadataDay.year+"-0"+element.month+"-"+metadataDay.day);
        }else{
          date = new Date(metadataDay.year+"-"+element.month+"-"+metadataDay.day);
        }
        
        element.date = date;

        
      }
    }
    


  }
}
