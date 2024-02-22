export class DropdownEntry {
    code: string;
    name: string;
    year1: number;
    year2: number;
    month1: number;
    month2: number;
    day1: number;
    day2: number;

    public constructor(init?:Partial<DropdownEntry>) {
        Object.assign(this, init);
    }
}