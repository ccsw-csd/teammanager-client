import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Center } from './model/Center';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HolidayService {

  constructor(private http:HttpClient) { }

  getAllCenters(): Observable<Center[]> {
    return this.http.get<Center[]>(environment.server+"/center/");
  }
}
