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

  getGroupMembers(filterGroup: string): Observable<GroupMember[]> {
    const url = `${environment.server}/v_group_members_all/?group_id=${filterGroup}`;
    return this.http.get<GroupMember[]>(url);
    
  }

  getPersonData(personId: number): Observable<Person> {
    const url = `${environment.server}/person/?id=${personId}`;
    return this.http.get<Person>(url);
  }

  getPersonAbsences(id:number, year: number, month: number): Observable<PersonAbsence[]>{
    const url = `${environment.server}/v_person_absence/?person_id=${id}&year=${year}&month=${month+1}`;
    return this.http.get<PersonAbsence[]>(url);
  }

  getMembersDetails(filterGroup: string, startDate: Date, endDate: Date): Observable<Detail[]> {
    const requestBody = {
      group_id: filterGroup,
      startDate: startDate,
      endDate: endDate,
    };
    const url = `${environment.server}/v_group_members_all/?group_id=${filterGroup}`;
    //const url = `${environment.server}/v_group_members_all/`;
    return this.http.get<Detail[]>(url);
    //return this.http.post<Detail[]>(url, requestBody);
    
  }

}