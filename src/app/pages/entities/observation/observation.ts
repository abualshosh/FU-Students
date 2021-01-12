import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { JhiDataUtils } from 'ng-jhipster';
import { Observation } from './observation.model';
import { ObservationService } from './observation.service';
import { Project } from '../project';

@Component({
  selector: 'page-observation',
  templateUrl: 'observation.html',
})
export class ObservationPage {
  observations: Observation[];

  // todo: add pagination

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private observationService: ObservationService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.observations = [];
  }

  ionViewWillEnter() {
    this.loadAll();
  }

  async loadAll(refresher?) {
    const project: Project = JSON.parse(localStorage.getItem('project'))
    this.observationService
      .query({ 'projectId.equals': project.id })
      .pipe(
        filter((res: HttpResponse<Observation[]>) => res.ok),
        map((res: HttpResponse<Observation[]>) => res.body)
      )
      .subscribe(
        (response: Observation[]) => {
          this.observations = response;
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

  trackId(index: number, item: Observation) {
    return item.id;
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  new() {
    this.navController.navigateForward('/tabs/entities/observation/new');
  }

  edit(item: IonItemSliding, observation: Observation) {
    this.navController.navigateForward('/tabs/entities/observation/' + observation.id + '/edit');
    item.close();
  }

  async delete(observation) {
    this.observationService.delete(observation.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Observation deleted successfully.', duration: 3000, position: 'middle' });
        toast.present();
        this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  view(observation: Observation) {
    this.navController.navigateForward('/tabs/entities/observation/' + observation.id + '/view');
  }
}
