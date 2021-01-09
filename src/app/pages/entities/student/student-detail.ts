import { Component, OnInit } from '@angular/core';
import { Student } from './student.model';
import { StudentService } from './student.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-student-detail',
  templateUrl: 'student-detail.html',
})
export class StudentDetailPage implements OnInit {
  student: Student = {};

  constructor(
    private navController: NavController,
    private studentService: StudentService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.student = response.data;
    });
  }

  open(item: Student) {
    this.navController.navigateForward('/tabs/entities/student/' + item.id + '/edit');
  }

  async deleteModal(item: Student) {
    const alert = await this.alertController.create({
      header: 'Confirm the deletion?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Delete',
          handler: () => {
            this.studentService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/student');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
