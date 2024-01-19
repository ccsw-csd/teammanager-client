export class DropdownEntry {
    code: string;
    name: string;
    year: string;
    month: string;

    public constructor(init?:Partial<DropdownEntry>) {
        Object.assign(this, init);
    }
}