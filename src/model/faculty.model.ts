import { BaseEntity } from 'src/model/base-entity';
import { Student } from '../app/pages/entities/student/student.model';
import { Project } from '../app/pages/entities/project/project.model';
import { Announcement } from '../app/pages/entities/announcement/announcement.model';
import { Supervisor } from '../app/pages/entities/supervisor/supervisor.model';

export class Faculty implements BaseEntity {
  constructor(
    public id?: number,
    public name?: string,
    public code?: string,
    public students?: Student[],
    public projects?: Project[],
    public announcments?: Announcement[],
    public supervisors?: Supervisor[]
  ) {}
}
