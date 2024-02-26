import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Detail } from '../forecast/model/Detail';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor(private http:HttpClient) { }

  getUserDetails(username: string, year: string):Observable<Detail>{
    const url = `${environment.server}/person/?username=${username}&year=${year}`;
    return this.http.get<Detail>(url);
  }
}
