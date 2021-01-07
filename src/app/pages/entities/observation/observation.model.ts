import { BaseEntity } from 'src/model/base-entity';
import { File } from '../file/file.model';
import { Project } from '../project/project.model';

export class Observation implements BaseEntity {
  constructor(
    public id?: number,
    public title?: string,
    public detail?: any,
    public creationDate?: any,
    public file?: File,
    public project?: Project
  ) {}
}
