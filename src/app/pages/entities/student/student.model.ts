import { User } from "src/app/services/user/user.model";
import { Faculty } from "../faculty";
import { Project } from "../project";


export class Student {
    constructor(
        public id?: number,
        public index?: string,
        public fullNameArabic?: string,
        public phone?: string,
        public user?: User,
        public faculty?: Faculty,
        public project?: Project
    ) { }
}
