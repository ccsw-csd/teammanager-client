import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Detail } from '../forecast/model/Detail';
import { environment } from 'src/environments/environment';
import { AbsencesToUpdate } from './views/model/AbsencesToUpdate';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor(private http:HttpClient) { }

  getUserDetails(year: string):Observable<Detail>{
    const url = `${environment.server}/person/?year=${year}`;
    return this.http.get<Detail>(url);
  }

  update(updateAbsences: AbsencesToUpdate):Observable<boolean>{

    return this.http.put<boolean>(environment.server + "/absence",updateAbsences);
  }
}
