import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CenterWithFestives } from './model/CenterWithFestives';
import { environment } from 'src/environments/environment';
import { Center } from './model/Center';
import { Festive } from './model/Festive';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HolidayService {

  constructor(private http:HttpClient) { }

  getAllCenters(): Observable<CenterWithFestives[]> {
    return this.http.get<CenterWithFestives[]>(environment.server+"/v_center_with_festives/");
  }

  getCenterFestives(center: CenterWithFestives): Observable<Festive[]> {
    let id = center.id;
    //return this.http.get<Festive[]>(environment.server+"/festive/");
    const url = `${environment.server}/festive/?center_id=${id}`;
    return this.http.get<Festive[]>(url);
  }
}
