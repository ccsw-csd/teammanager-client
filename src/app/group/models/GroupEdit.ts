import { Group } from './Group';
import { Person } from './Person';

export class GroupEdit{
    id:number;
    name:string;
    managers: any;
    members: any;
    subgroups: any;
    externalId: string;
}