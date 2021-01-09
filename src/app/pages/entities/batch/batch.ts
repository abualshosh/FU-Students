import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Batch } from './batch.model';
import { BatchService } from './batch.service';

@Component({
  selector: 'page-batch',
  templateUrl: 'batch.html',
})
export class BatchPage {
  batches: Batch[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private batchService: BatchService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.batches = [];
  }

  ionViewWillEnter() {
    this.loadAll();
  }

  async loadAll(refresher?) {
    this.batchService
      .query()
      .pipe(
        filter((res: HttpResponse<Batch[]>) => res.ok),
        map((res: HttpResponse<Batch[]>) => res.body)
      )
      .subscribe(
        (response: Batch[]) => {
          this.batches = response;
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

  trackId(index: number, item: Batch) {
    return item.id;
  }

  new() {
    this.navController.navigateForward('/tabs/entities/batch/new');
  }

  edit(item: IonItemSliding, batch: Batch) {
    this.navController.navigateForward('/tabs/entities/batch/' + batch.id + '/edit');
    item.close();
  }

  async delete(batch) {
    this.batchService.delete(batch.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Batch deleted successfully.', duration: 3000, position: 'middle' });
        toast.present();
        this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  view(batch: Batch) {
    this.navController.navigateForward('/tabs/entities/batch/' + batch.id + '/view');
  }
}
