import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { JhiDataUtils } from 'ng-jhipster';
import { File } from './file.model';
import { FileService } from './file.service';
import { Announcement, AnnouncementService } from '../announcement';
import { Project } from '../project';

@Component({
  selector: 'page-file',
  templateUrl: 'file.html',
})
export class FilePage {
  files: File[];
  announcement: Announcement;

  // todo: add pagination

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private fileService: FileService,
    private toastCtrl: ToastController,
    public plt: Platform
    , public ann: AnnouncementService
  ) {
    this.files = [];
  }

  ionViewWillEnter() {
    this.loadAll();
    this.loadAnn();
    console.log(this.checkAnnouncement());

  }

  async loadAll(refresher?) {
    const project: Project = JSON.parse(localStorage.getItem("project"))
    this.fileService
      .query({ "projectId.equals": project.id })
      .pipe(
        filter((res: HttpResponse<File[]>) => res.ok),
        map((res: HttpResponse<File[]>) => res.body)
      )
      .subscribe(
        (response: File[]) => {
          this.files = response;
          if (typeof refresher !== 'undefined') {
            setTimeout(() => {
              refresher.target.complete();
            }, 750);
          }
        },
        async (error) => {
          console.error(error);
          const toast = await this.toastCtrl.create({ message: 'Failed to load data', duration: 2000, position: 'middle' });
          toast.present();
        }
      );
  }

  trackId(index: number, item: File) {
    return item.id;
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  new() {
    this.navController.navigateForward('/tabs/entities/file/new');
  }

  edit(item: IonItemSliding, file: File) {
    this.navController.navigateForward('/tabs/entities/file/' + file.id + '/edit');
    item.close();
  }

  async delete(file) {
    this.fileService.delete(file.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'File deleted successfully.', duration: 3000, position: 'middle' });
        toast.present();
        this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  view(file: File) {
    this.navController.navigateForward('/tabs/entities/file/' + file.id + '/view');
  }
  loadAnn() {
    const project: Project = JSON.parse(localStorage.getItem("project"))

    this.ann.query({
      "announcementType.in": ['SUBMISSION'], "facultyId.equals": project.id, "oen.equals": true
    }).subscribe(res => {
      this.announcement = res.body[0]
      console.log(res.body[0]);

    })
  }
  checkAnnouncement(): boolean {

    if (this.announcement) {
      return true;
    }
    return false
  }
}
