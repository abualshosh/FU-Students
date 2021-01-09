import { Component, OnInit } from '@angular/core';
import { Supervisor } from './supervisor.model';
import { SupervisorService } from './supervisor.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-supervisor-detail',
  templateUrl: 'supervisor-detail.html',
})
export class SupervisorDetailPage implements OnInit {
  supervisor: Supervisor = {};

  constructor(
    private navController: NavController,
    private supervisorService: SupervisorService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.supervisor = response.data;
    });
  }

  open(item: Supervisor) {
    this.navController.navigateForward('/tabs/entities/supervisor/' + item.id + '/edit');
  }

  async deleteModal(item: Supervisor) {
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
            this.supervisorService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/supervisor');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
