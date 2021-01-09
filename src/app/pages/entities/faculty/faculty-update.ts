import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Faculty } from './faculty.model';
import { FacultyService } from './faculty.service';
import { Supervisor, SupervisorService } from '../supervisor';

@Component({
  selector: 'page-faculty-update',
  templateUrl: 'faculty-update.html',
})
export class FacultyUpdatePage implements OnInit {
  faculty: Faculty;
  supervisors: Supervisor[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [],
    name: [null, []],
    code: [null, []],
    supervisors: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private supervisorService: SupervisorService,
    private facultyService: FacultyService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.supervisorService.query().subscribe(
      (data) => {
        this.supervisors = data.body;
      },
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.faculty = response.data;
      this.isNew = this.faculty.id === null || this.faculty.id === undefined;
      this.updateForm(this.faculty);
    });
  }

  updateForm(faculty: Faculty) {
    this.form.patchValue({
      id: faculty.id,
      name: faculty.name,
      code: faculty.code,
      supervisors: faculty.supervisors,
    });
  }

  save() {
    this.isSaving = true;
    const faculty = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.facultyService.update(faculty));
    } else {
      this.subscribeToSaveResponse(this.facultyService.create(faculty));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Faculty>>) {
    result.subscribe(
      (res: HttpResponse<Faculty>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Faculty ${action} successfully.`, duration: 2000, position: 'middle' });
    toast.present();
    this.navController.navigateBack('/tabs/entities/faculty');
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

  private createFromForm(): Faculty {
    return {
      ...new Faculty(),
      id: this.form.get(['id']).value,
      name: this.form.get(['name']).value,
      code: this.form.get(['code']).value,
      supervisors: this.form.get(['supervisors']).value,
    };
  }

  compareSupervisor(first: Supervisor, second: Supervisor): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackSupervisorById(index: number, item: Supervisor) {
    return item.id;
  }
}
