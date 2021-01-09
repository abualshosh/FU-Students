import { Component, OnInit } from '@angular/core';
import { JhiDataUtils } from 'ng-jhipster';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Project } from './project.model';
import { ProjectService } from './project.service';
import { Faculty, FacultyService } from '../faculty';
import { Supervisor, SupervisorService } from '../supervisor';
import { Batch, BatchService } from '../batch';

@Component({
  selector: 'page-project-update',
  templateUrl: 'project-update.html',
})
export class ProjectUpdatePage implements OnInit {
  project: Project;
  faculties: Faculty[];
  supervisors: Supervisor[];
  batches: Batch[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [],
    name: [null, []],
    details: [null, []],
    objectives: [null, []],
    problems: [null, []],
    faculty: [null, []],
    supervisor: [null, []],
    batch: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private dataUtils: JhiDataUtils,
    private facultyService: FacultyService,
    private supervisorService: SupervisorService,
    private batchService: BatchService,
    private projectService: ProjectService
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
    this.supervisorService.query().subscribe(
      (data) => {
        this.supervisors = data.body;
      },
      (error) => this.onError(error)
    );
    this.batchService.query().subscribe(
      (data) => {
        this.batches = data.body;
      },
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.project = response.data;
      this.isNew = this.project.id === null || this.project.id === undefined;
      this.updateForm(this.project);
    });
  }

  updateForm(project: Project) {
    this.form.patchValue({
      id: project.id,
      name: project.name,
      details: project.details,
      objectives: project.objectives,
      problems: project.problems,
      faculty: project.faculty,
      supervisor: project.supervisor,
      batch: project.batch,
    });
  }

  save() {
    this.isSaving = true;
    const project = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.projectService.update(project));
    } else {
      this.subscribeToSaveResponse(this.projectService.create(project));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Project>>) {
    result.subscribe(
      (res: HttpResponse<Project>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Project ${action} successfully.`, duration: 2000, position: 'middle' });
    toast.present();
    this.navController.navigateBack('/tabs/entities/project');
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

  private createFromForm(): Project {
    return {
      ...new Project(),
      id: this.form.get(['id']).value,
      name: this.form.get(['name']).value,
      details: this.form.get(['details']).value,
      objectives: this.form.get(['objectives']).value,
      problems: this.form.get(['problems']).value,
      faculty: this.form.get(['faculty']).value,
      supervisor: this.form.get(['supervisor']).value,
      batch: this.form.get(['batch']).value,
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
  compareSupervisor(first: Supervisor, second: Supervisor): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackSupervisorById(index: number, item: Supervisor) {
    return item.id;
  }
  compareBatch(first: Batch, second: Batch): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackBatchById(index: number, item: Batch) {
    return item.id;
  }
}
