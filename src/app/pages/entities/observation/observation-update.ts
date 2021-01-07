import { Component, OnInit } from '@angular/core';
import { JhiDataUtils } from 'ng-jhipster';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Observation } from './observation.model';
import { ObservationService } from './observation.service';
import { File, FileService } from '../file';
import { Project, ProjectService } from '../project';

@Component({
  selector: 'page-observation-update',
  templateUrl: 'observation-update.html',
})
export class ObservationUpdatePage implements OnInit {
  observation: Observation;
  files: File[];
  projects: Project[];
  creationDate: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [],
    title: [null, []],
    detail: [null, []],
    creationDate: [null, []],
    file: [null, []],
    project: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private dataUtils: JhiDataUtils,
    private fileService: FileService,
    private projectService: ProjectService,
    private observationService: ObservationService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.fileService.query({ filter: 'observation-is-null' }).subscribe(
      (data) => {
        if (!this.observation.file || !this.observation.file.id) {
          this.files = data.body;
        } else {
          this.fileService.find(this.observation.file.id).subscribe(
            (subData: HttpResponse<File>) => {
              this.files = [subData.body].concat(subData.body);
            },
            (error) => this.onError(error)
          );
        }
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
      this.observation = response.data;
      this.isNew = this.observation.id === null || this.observation.id === undefined;
      this.updateForm(this.observation);
    });
  }

  updateForm(observation: Observation) {
    this.form.patchValue({
      id: observation.id,
      title: observation.title,
      detail: observation.detail,
      creationDate: this.isNew ? new Date().toISOString() : observation.creationDate,
      file: observation.file,
      project: observation.project,
    });
  }

  save() {
    this.isSaving = true;
    const observation = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.observationService.update(observation));
    } else {
      this.subscribeToSaveResponse(this.observationService.create(observation));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Observation>>) {
    result.subscribe(
      (res: HttpResponse<Observation>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Observation ${action} successfully.`, duration: 2000, position: 'middle' });
    toast.present();
    this.navController.navigateBack('/tabs/entities/observation');
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

  private createFromForm(): Observation {
    return {
      ...new Observation(),
      id: this.form.get(['id']).value,
      title: this.form.get(['title']).value,
      detail: this.form.get(['detail']).value,
      creationDate: new Date(this.form.get(['creationDate']).value),
      file: this.form.get(['file']).value,
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

  compareFile(first: File, second: File): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackFileById(index: number, item: File) {
    return item.id;
  }
  compareProject(first: Project, second: Project): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackProjectById(index: number, item: Project) {
    return item.id;
  }
}
