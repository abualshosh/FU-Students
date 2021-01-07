import { BaseEntity } from 'src/model/base-entity';
import { Faculty } from '../../../../model/faculty.model';

export const enum AnnouncementType {
  'SUBMISSION',
  'DISCUSSIONS',
  'OBSERVATIONS',
  'OTHERS',
}

export class Announcement implements BaseEntity {
  constructor(
    public id?: number,
    public title?: string,
    public content?: any,
    public announcementType?: AnnouncementType,
    public startDate?: any,
    public endDate?: any,
    public open?: boolean,
    public faculty?: Faculty
  ) {
    this.open = false;
  }
}
