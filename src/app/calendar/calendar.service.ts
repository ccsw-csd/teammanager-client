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

  save(vacations: PersonAbsence[]):Observable<PersonAbsence[]>{
    return this.http.put<PersonAbsence[]>(environment.server + "/person_absence/",vacations);  
  }

  delete(idVacation: string):Observable<void>{
    const url = `${environment.server}/person_absence/${idVacation}`;
    return this.http.delete<void>(url);
  }
}
