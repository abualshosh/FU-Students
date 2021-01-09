import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Student } from './student.model';
import { StudentService } from './student.service';

@Component({
  selector: 'page-student',
  templateUrl: 'student.html',
})
export class StudentPage {
  students: Student[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private studentService: StudentService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.students = [];
  }

  ionViewWillEnter() {
    this.loadAll();
  }

  async loadAll(refresher?) {
    this.studentService
      .query()
      .pipe(
        filter((res: HttpResponse<Student[]>) => res.ok),
        map((res: HttpResponse<Student[]>) => res.body)
      )
      .subscribe(
        (response: Student[]) => {
          this.students = response;
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

  trackId(index: number, item: Student) {
    return item.id;
  }

  new() {
    this.navController.navigateForward('/tabs/entities/student/new');
  }

  edit(item: IonItemSliding, student: Student) {
    this.navController.navigateForward('/tabs/entities/student/' + student.id + '/edit');
    item.close();
  }

  async delete(student) {
    this.studentService.delete(student.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Student deleted successfully.', duration: 3000, position: 'middle' });
        toast.present();
        this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  view(student: Student) {
    this.navController.navigateForward('/tabs/entities/student/' + student.id + '/view');
  }
}
