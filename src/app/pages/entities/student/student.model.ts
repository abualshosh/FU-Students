import { BaseEntity } from 'src/model/base-entity';
import { User } from '../../../services/user/user.model';
import { Faculty } from '../../../../model/faculty.model';
import { Project } from '../project/project.model';

export class Student implements BaseEntity {
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
