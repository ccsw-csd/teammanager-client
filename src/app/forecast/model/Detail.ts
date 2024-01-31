import { MetadataDay } from "src/app/holiday/model/metadata-day";
import { Person } from "./Person";
import { PersonAbsence } from "./PersonAbsence";

export class Detail{
    person: Person;
    workingDays: number;
    festives: number;
    vacations: number;
    others: number;
    absences: PersonAbsence;
    fullname: string;
}