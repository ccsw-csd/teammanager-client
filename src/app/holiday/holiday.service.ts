import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CenterWithFestives } from './model/CenterWithFestives';
import { environment } from 'src/environments/environment';
import { Festive } from './model/Festive';
import { MetadataDay } from './model/metadata-day';

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
    const url = `${environment.server}/festive/?center_id=${id}`;
    return this.http.get<Festive[]>(url);
  }

  save(festive:Festive):Observable<Festive>{

    return this.http.put<Festive>(environment.server + "/festive/",festive);

  }

  delete(idFestive:number):Observable<void>{
    const url = `${environment.server}/festive/${idFestive}`;
    return this.http.delete<void>(url);
  }

}
