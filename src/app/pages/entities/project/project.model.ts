import { BaseEntity } from 'src/model/base-entity';
import { File } from '../file/file.model';
import { Observation } from '../observation/observation.model';
import { Faculty } from '../faculty/faculty.model';
import { Supervisor } from '../supervisor/supervisor.model';
import { Batch } from '../batch/batch.model';
import { Student } from '../student/student.model';

export class Project implements BaseEntity {
  constructor(
    public id?: number,
    public name?: string,
    public details?: any,
    public objectives?: any,
    public problems?: any,
    public students?: Student[],
    public files?: File[],
    public observations?: Observation[],
    public faculty?: Faculty,
    public supervisor?: Supervisor,
    public batch?: Batch
  ) { }
}
