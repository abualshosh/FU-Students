import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Faculty } from './faculty.model';
import { FacultyService } from './faculty.service';

@Component({
  selector: 'page-faculty',
  templateUrl: 'faculty.html',
})
export class FacultyPage {
  faculties: Faculty[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private facultyService: FacultyService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.faculties = [];
  }

  ionViewWillEnter() {
    this.loadAll();
  }

  async loadAll(refresher?) {
    this.facultyService
      .query()
      .pipe(
        filter((res: HttpResponse<Faculty[]>) => res.ok),
        map((res: HttpResponse<Faculty[]>) => res.body)
      )
      .subscribe(
        (response: Faculty[]) => {
          this.faculties = response;
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

  trackId(index: number, item: Faculty) {
    return item.id;
  }

  new() {
    this.navController.navigateForward('/tabs/entities/faculty/new');
  }

  edit(item: IonItemSliding, faculty: Faculty) {
    this.navController.navigateForward('/tabs/entities/faculty/' + faculty.id + '/edit');
    item.close();
  }

  async delete(faculty) {
    this.facultyService.delete(faculty.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Faculty deleted successfully.', duration: 3000, position: 'middle' });
        toast.present();
        this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  view(faculty: Faculty) {
    this.navController.navigateForward('/tabs/entities/faculty/' + faculty.id + '/view');
  }
}
