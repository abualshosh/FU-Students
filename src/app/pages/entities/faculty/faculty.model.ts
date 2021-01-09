import { BaseEntity } from 'src/model/base-entity';
import { Project } from '../project/project.model';
import { Announcement } from '../announcement/announcement.model';
import { Supervisor } from '../supervisor/supervisor.model';
import { Student } from '../student/student.model';

export class Faculty implements BaseEntity {
  constructor(
    public id?: number,
    public name?: string,
    public code?: string,
    public students?: Student[],
    public projects?: Project[],
    public announcements?: Announcement[],
    public supervisors?: Supervisor[]
  ) { }
}
