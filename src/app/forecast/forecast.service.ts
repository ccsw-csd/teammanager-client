import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';
import { Group } from './model/Group';
import { Person } from './model/Person';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

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

}