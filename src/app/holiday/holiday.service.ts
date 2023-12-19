import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CenterWithFestives } from './model/CenterWithFestives';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HolidayService {

  constructor(private http:HttpClient) { }

  getAllCenters(): Observable<CenterWithFestives[]> {
    return this.http.get<CenterWithFestives[]>(environment.server+"/v_center_with_festives/");
  }
}
