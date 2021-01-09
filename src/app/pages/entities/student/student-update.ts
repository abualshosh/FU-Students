import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Student } from './student.model';
import { StudentService } from './student.service';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';
import { Faculty, FacultyService } from '../faculty';
import { Project, ProjectService } from '../project';

@Component({
  selector: 'page-student-update',
  templateUrl: 'student-update.html',
})
export class StudentUpdatePage implements OnInit {
  student: Student;
  users: User[];
  faculties: Faculty[];
  projects: Project[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [],
    index: [null, []],
    fullNameArabic: [null, []],
    phone: [null, []],
    user: [null, []],
    faculty: [null, []],
    project: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private userService: UserService,
    private facultyService: FacultyService,
    private projectService: ProjectService,
    private studentService: StudentService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.userService.findAll().subscribe(
      (data) => (this.users = data),
      (error) => this.onError(error)
    );
    this.facultyService.query().subscribe(
      (data) => {
        this.faculties = data.body;
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
      this.student = response.data;
      this.isNew = this.student.id === null || this.student.id === undefined;
      this.updateForm(this.student);
    });
  }

  updateForm(student: Student) {
    this.form.patchValue({
      id: student.id,
      index: student.index,
      fullNameArabic: student.fullNameArabic,
      phone: student.phone,
      user: student.user,
      faculty: student.faculty,
      project: student.project,
    });
  }

  save() {
    this.isSaving = true;
    const student = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.studentService.update(student));
    } else {
      this.subscribeToSaveResponse(this.studentService.create(student));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Student>>) {
    result.subscribe(
      (res: HttpResponse<Student>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Student ${action} successfully.`, duration: 2000, position: 'middle' });
    toast.present();
    this.navController.navigateBack('/tabs/entities/student');
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

  private createFromForm(): Student {
    return {
      ...new Student(),
      id: this.form.get(['id']).value,
      index: this.form.get(['index']).value,
      fullNameArabic: this.form.get(['fullNameArabic']).value,
      phone: this.form.get(['phone']).value,
      user: this.form.get(['user']).value,
      faculty: this.form.get(['faculty']).value,
      project: this.form.get(['project']).value,
    };
  }

  compareUser(first: User, second: User): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackUserById(index: number, item: User) {
    return item.id;
  }
  compareFaculty(first: Faculty, second: Faculty): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackFacultyById(index: number, item: Faculty) {
    return item.id;
  }
  compareProject(first: Project, second: Project): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackProjectById(index: number, item: Project) {
    return item.id;
  }
}
