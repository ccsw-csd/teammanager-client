import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, filter } from "rxjs";
import { Group } from './model/Group';
import { Person } from './model/Person';
import { GroupMember } from './model/GroupMember';
import { environment } from 'src/environments/environment';
import { PersonAbsence } from './model/PersonAbsence';
import { Detail } from './model/Detail';

@Injectable({
  providedIn: 'root'
})
export class ForecastService {

  constructor(private http:HttpClient) { }

  getAllGroupsAdmin():Observable<Group[]>{
    return this.http.get<Group[]>(environment.server+"/group/?adminView=true");
  }

  getAllGroups():Observable<Group[]>{
    return this.http.get<Group[]>(environment.server+"/group/");
  }

  searchGroup(filterName: string): Observable<Group[]> {
    return this.http.get<Group[]>(environment.server + "/group/find/"+filterName);
  }

  searchPerson(filterName: string): Observable<Person[]> {
    return this.http.get<Person[]>(environment.server + "/person/find/"+filterName);
  }

  getMembersDetails(filterGroup: string, startDate: Date, endDate: Date): Observable<Detail[]> {
    const url = `${environment.server}/group_members/?group_id=${filterGroup}&start_date=${startDate.toISOString()}&end_date=${endDate.toISOString()}`;
    return this.http.get<Detail[]>(url);  
  }

}