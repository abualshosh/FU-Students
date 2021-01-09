import { Component, OnInit } from '@angular/core';
import { Faculty } from './faculty.model';
import { FacultyService } from './faculty.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-faculty-detail',
  templateUrl: 'faculty-detail.html',
})
export class FacultyDetailPage implements OnInit {
  faculty: Faculty = {};

  constructor(
    private navController: NavController,
    private facultyService: FacultyService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.faculty = response.data;
    });
  }

  open(item: Faculty) {
    this.navController.navigateForward('/tabs/entities/faculty/' + item.id + '/edit');
  }

  async deleteModal(item: Faculty) {
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
            this.facultyService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/faculty');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
