import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-entities',
  templateUrl: 'entities.page.html',
  styleUrls: ['entities.page.scss'],
})
export class EntitiesPage {
  entities: Array<any> = [
    { name: 'Project', component: 'ProjectPage', route: 'project' },
    { name: 'Announcement', component: 'AnnouncementPage', route: 'announcement' },
    { name: 'Observation', component: 'ObservationPage', route: 'observation' },
    { name: 'File', component: 'FilePage', route: 'file' },
    /* jhipster-needle-add-entity-page - JHipster will add entity pages here */
  ];

  constructor(public navController: NavController) { }

  openPage(page) {
    this.navController.navigateForward('/tabs/entities/' + page.route);
  }
}
