import { Component, OnInit } from '@angular/core';
import { Batch } from './batch.model';
import { BatchService } from './batch.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-batch-detail',
  templateUrl: 'batch-detail.html',
})
export class BatchDetailPage implements OnInit {
  batch: Batch = {};

  constructor(
    private navController: NavController,
    private batchService: BatchService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.batch = response.data;
    });
  }

  open(item: Batch) {
    this.navController.navigateForward('/tabs/entities/batch/' + item.id + '/edit');
  }

  async deleteModal(item: Batch) {
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
            this.batchService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/batch');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
