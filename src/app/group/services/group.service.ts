import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';
import { Group } from '../models/Group';
import { Person } from '../models/Person';

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

  getGroup(id: number): Observable<Group>{
    return this.http.get<Group>(environment.server + "/group/"+ id);
  }

  searchGroup(filterName: string): Observable<Group[]> {
    return this.http.get<Group[]>(environment.server + "/group/find/"+filterName);
  }

  searchPerson(filterName: string): Observable<Person[]> {
    return this.http.get<Person[]>(environment.server + "/person/find/"+filterName);
  }

  save(group: Group):Observable<Group>{
    return this.http.put<Group>(environment.server + "/group/",group);
  }

}