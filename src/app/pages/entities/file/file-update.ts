import { Component, OnInit } from '@angular/core';
import { JhiDataUtils } from 'ng-jhipster';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { File } from './file.model';
import { FileService } from './file.service';
import { Observation, ObservationService } from '../observation';
import { Project, ProjectService } from '../project';

@Component({
  selector: 'page-file-update',
  templateUrl: 'file-update.html',
})
export class FileUpdatePage implements OnInit {
  file: File;
  observations: Observation[];
  projects: Project[];
  uploadDate: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [],
    name: [null, []],
    file: [null, []],
    fileContentType: [null, []],
    uploadDate: [null, []],
    type: [null, []],
    project: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private dataUtils: JhiDataUtils,
    private observationService: ObservationService,
    private projectService: ProjectService,
    private fileService: FileService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.observationService.query().subscribe(
      (data) => {
        this.observations = data.body;
      },
      (error) => this.onError(error)
    );
    this.projectService.query().subscribe(
      (data) => {
        this.projects = data.body;
      },
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.file = response.data;
      this.isNew = this.file.id === null || this.file.id === undefined;
      this.updateForm(this.file);
    });
  }

  updateForm(file: File) {
    this.form.patchValue({
      id: file.id,
      name: file.name,
      file: file.file,
      fileContentType: file.fileContentType,
      uploadDate: this.isNew ? new Date().toISOString() : file.uploadDate,
      type: file.type,
      project: file.project,
    });
  }

  save() {
    this.isSaving = true;
    const file = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.fileService.update(file));
    } else {
      this.subscribeToSaveResponse(this.fileService.create(file));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<File>>) {
    result.subscribe(
      (res: HttpResponse<File>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `File ${action} successfully.`, duration: 2000, position: 'middle' });
    toast.present();
    this.navController.navigateBack('/tabs/entities/file');
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

  private createFromForm(): File {
    return {
      ...new File(),
      id: this.form.get(['id']).value,
      name: this.form.get(['name']).value,
      file: this.form.get(['file']).value,
      fileContentType: this.form.get(['fileContentType']).value,
      uploadDate: new Date(this.form.get(['uploadDate']).value),
      type: this.form.get(['type']).value,
      project: this.form.get(['project']).value,
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

  compareObservation(first: Observation, second: Observation): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackObservationById(index: number, item: Observation) {
    return item.id;
  }
  compareProject(first: Project, second: Project): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackProjectById(index: number, item: Project) {
    return item.id;
  }
}
