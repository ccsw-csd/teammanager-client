import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';
import { Group } from '../models/Group';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private http:HttpClient) { }

  getAllGroupsAdmin():Observable<Group[]>{
    return this.http.get<Group[]>(environment.server+"/grouplist/?adminView=true");
  }

  getAllGroups():Observable<Group[]>{
    return this.http.get<Group[]>(environment.server+"/grouplist/");
  }

  getGroup(id: number): Observable<Group>{
    return this.http.get<Group>(environment.server + "/grouplist/editgroup/"+ id);
  }
  
}