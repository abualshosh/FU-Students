import { Component, OnInit } from '@angular/core';
import { JhiDataUtils } from 'ng-jhipster';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Announcement } from './announcement.model';
import { AnnouncementService } from './announcement.service';
import { Faculty, FacultyService } from '../faculty';

@Component({
  selector: 'page-announcement-update',
  templateUrl: 'announcement-update.html',
})
export class AnnouncementUpdatePage implements OnInit {
  announcement: Announcement;
  faculties: Faculty[];
  startDateDp: any;
  endDateDp: any;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [],
    title: [null, []],
    content: [null, []],
    announcementType: [null, []],
    startDate: [null, []],
    endDate: [null, []],
    open: ['false', []],
    faculty: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private dataUtils: JhiDataUtils,
    private facultyService: FacultyService,
    private announcementService: AnnouncementService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.facultyService.query().subscribe(
      (data) => {
        this.faculties = data.body;
      },
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.announcement = response.data;
      this.isNew = this.announcement.id === null || this.announcement.id === undefined;
      this.updateForm(this.announcement);
    });
  }

  updateForm(announcement: Announcement) {
    this.form.patchValue({
      id: announcement.id,
      title: announcement.title,
      content: announcement.content,
      announcementType: announcement.announcementType,
      startDate: this.isNew ? new Date().toISOString().split('T')[0] : announcement.startDate,
      endDate: this.isNew ? new Date().toISOString().split('T')[0] : announcement.endDate,
      open: announcement.open,
      faculty: announcement.faculty,
    });
  }

  save() {
    this.isSaving = true;
    const announcement = this.createFromForm();
    announcement.startDate = new Date(announcement.startDate).toISOString().split('T')[0];
    announcement.endDate = new Date(announcement.endDate).toISOString().split('T')[0];
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.announcementService.update(announcement));
    } else {
      this.subscribeToSaveResponse(this.announcementService.create(announcement));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Announcement>>) {
    result.subscribe(
      (res: HttpResponse<Announcement>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Announcement ${action} successfully.`, duration: 2000, position: 'middle' });
    toast.present();
    this.navController.navigateBack('/tabs/entities/announcement');
  }

  previousState() {
    window.history.back();
  }

  async onError(error) {
    this.isSaving = false;
    console.error(error);
    const toast = await this.toastCtrl.create({ message: 'Failed to load data', duration: 2000, position: 'middle' });
    toast.present();
  }

  private createFromForm(): Announcement {
    return {
      ...new Announcement(),
      id: this.form.get(['id']).value,
      title: this.form.get(['title']).value,
      content: this.form.get(['content']).value,
      announcementType: this.form.get(['announcementType']).value,
      startDate: this.form.get(['startDate']).value,
      endDate: this.form.get(['endDate']).value,
      open: this.form.get(['open']).value,
      faculty: this.form.get(['faculty']).value,
    };
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  setFileData(event, field, isImage) {
    this.dataUtils.loadFileToForm(event, this.form, field, isImage).subscribe();
  }

  compareFaculty(first: Faculty, second: Faculty): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackFacultyById(index: number, item: Faculty) {
    return item.id;
  }
}
