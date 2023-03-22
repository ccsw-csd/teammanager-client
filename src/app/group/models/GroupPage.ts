import { Pageable } from "src/app/core/models/page/Pageable";
import { Group } from "./Group";

export class GroupPage {
    content: Group[];
    pageable: Pageable;
    totalElements: number;
}