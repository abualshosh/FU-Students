import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Supervisor } from './supervisor.model';
import { SupervisorService } from './supervisor.service';
import { Faculty, FacultyService } from '../faculty';

@Component({
  selector: 'page-supervisor-update',
  templateUrl: 'supervisor-update.html',
})
export class SupervisorUpdatePage implements OnInit {
  supervisor: Supervisor;
  faculties: Faculty[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [],
    fullName: [null, []],
    role: [null, []],
    gender: [null, []],
    email: [null, []],
    phoneNumber: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private facultyService: FacultyService,
    private supervisorService: SupervisorService
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
      this.supervisor = response.data;
      this.isNew = this.supervisor.id === null || this.supervisor.id === undefined;
      this.updateForm(this.supervisor);
    });
  }

  updateForm(supervisor: Supervisor) {
    this.form.patchValue({
      id: supervisor.id,
      fullName: supervisor.fullName,
      role: supervisor.role,
      gender: supervisor.gender,
      email: supervisor.email,
      phoneNumber: supervisor.phoneNumber,
    });
  }

  save() {
    this.isSaving = true;
    const supervisor = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.supervisorService.update(supervisor));
    } else {
      this.subscribeToSaveResponse(this.supervisorService.create(supervisor));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Supervisor>>) {
    result.subscribe(
      (res: HttpResponse<Supervisor>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Supervisor ${action} successfully.`, duration: 2000, position: 'middle' });
    toast.present();
    this.navController.navigateBack('/tabs/entities/supervisor');
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

  private createFromForm(): Supervisor {
    return {
      ...new Supervisor(),
      id: this.form.get(['id']).value,
      fullName: this.form.get(['fullName']).value,
      role: this.form.get(['role']).value,
      gender: this.form.get(['gender']).value,
      email: this.form.get(['email']).value,
      phoneNumber: this.form.get(['phoneNumber']).value,
    };
  }

  compareFaculty(first: Faculty, second: Faculty): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackFacultyById(index: number, item: Faculty) {
    return item.id;
  }
}
