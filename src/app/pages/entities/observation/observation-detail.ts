import { Component, OnInit } from '@angular/core';
import { JhiDataUtils } from 'ng-jhipster';
import { Observation } from './observation.model';
import { ObservationService } from './observation.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { File } from '../file';

@Component({
  selector: 'page-observation-detail',
  templateUrl: 'observation-detail.html',
})
export class ObservationDetailPage implements OnInit {
  observation: Observation = {};

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private observationService: ObservationService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.observation = response.data;
    });
  }

  open(item: Observation) {
    this.navController.navigateForward('/tabs/entities/observation/' + item.id + '/edit');
  }

  async deleteModal(item: Observation) {
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
            this.observationService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/observation');
            });
          },
        },
      ],
    });
    await alert.present();
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.downloadFile(contentType, field, contentType);
  }
  download(file: File) {
    return this.dataUtils.downloadFile(file.fileContentType, file.file, file.fileContentType);

  }
}
