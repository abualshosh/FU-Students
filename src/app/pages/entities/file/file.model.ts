import { BaseEntity } from 'src/model/base-entity';
import { Observation } from '../observation/observation.model';
import { Project } from '../project/project.model';

export class File implements BaseEntity {
  constructor(
    public id?: number,
    public name?: string,
    public fileContentType?: string,
    public file?: any,
    public uploadDate?: any,
    public type?: string,
    public observation?: Observation,
    public project?: Project
  ) {}
}
