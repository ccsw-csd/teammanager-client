import { MetadataDay } from "src/app/holiday/model/metadata-day";
import { Person } from "./Person";

export class Detail{
    person: Person;
    workingDays: number;
    festives: number;
    vacations: number;
    others: number;
    fullName: string;
}