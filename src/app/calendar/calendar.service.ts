import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Detail } from '../forecast/model/Detail';
import { environment } from 'src/environments/environment';
import { PersonAbsence } from './views/model/PersonAbsence';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor(private http:HttpClient) { }

  getUserDetails(year: string):Observable<Detail>{
    const url = `${environment.server}/person/?year=${year}`;
    return this.http.get<Detail>(url);
  }

  save(vacations: PersonAbsence[]):Observable<void>{
    return this.http.put<void>(environment.server + "/absence/",vacations);  
  }

  delete(vacationsToDelete: PersonAbsence[]):Observable<void>{
    const url = `${environment.server}/absence/${vacationsToDelete}`;
    return this.http.delete<void>(url);
  }
}
