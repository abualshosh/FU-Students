import { BaseEntity } from 'src/model/base-entity';
import { Project } from '../project/project.model';
import { Faculty } from '../faculty/faculty.model';

export const enum Gender {
  'MALE',
  'FEMALE',
  'OTHER',
}

export class Supervisor implements BaseEntity {
  constructor(
    public id?: number,
    public fullName?: string,
    public role?: string,
    public gender?: Gender,
    public email?: string,
    public phoneNumber?: string,
    public projects?: Project[],
    public faculties?: Faculty[]
  ) { }
}
