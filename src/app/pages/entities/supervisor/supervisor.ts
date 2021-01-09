import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Supervisor } from './supervisor.model';
import { SupervisorService } from './supervisor.service';

@Component({
  selector: 'page-supervisor',
  templateUrl: 'supervisor.html',
})
export class SupervisorPage {
  supervisors: Supervisor[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private supervisorService: SupervisorService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.supervisors = [];
  }

  ionViewWillEnter() {
    this.loadAll();
  }

  async loadAll(refresher?) {
    this.supervisorService
      .query()
      .pipe(
        filter((res: HttpResponse<Supervisor[]>) => res.ok),
        map((res: HttpResponse<Supervisor[]>) => res.body)
      )
      .subscribe(
        (response: Supervisor[]) => {
          this.supervisors = response;
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

  trackId(index: number, item: Supervisor) {
    return item.id;
  }

  new() {
    this.navController.navigateForward('/tabs/entities/supervisor/new');
  }

  edit(item: IonItemSliding, supervisor: Supervisor) {
    this.navController.navigateForward('/tabs/entities/supervisor/' + supervisor.id + '/edit');
    item.close();
  }

  async delete(supervisor) {
    this.supervisorService.delete(supervisor.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Supervisor deleted successfully.', duration: 3000, position: 'middle' });
        toast.present();
        this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  view(supervisor: Supervisor) {
    this.navController.navigateForward('/tabs/entities/supervisor/' + supervisor.id + '/view');
  }
}
