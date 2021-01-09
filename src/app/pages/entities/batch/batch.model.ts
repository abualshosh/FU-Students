import { BaseEntity } from 'src/model/base-entity';
import { Project } from '../project/project.model';

export class Batch implements BaseEntity {
  constructor(public id?: number, public year?: string, public projects?: Project[]) {}
}
