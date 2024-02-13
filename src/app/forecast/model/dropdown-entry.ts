export class DropdownEntry {
    code: string;
    name: string;
    year1: string;
    year2: string;
    month1: string;
    month2: string;
    day1: string;
    day2: string;

    public constructor(init?:Partial<DropdownEntry>) {
        Object.assign(this, init);
    }
}