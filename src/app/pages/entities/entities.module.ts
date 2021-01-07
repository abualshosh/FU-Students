import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { UserRouteAccessService } from 'src/app/services/auth/user-route-access.service';
import { EntitiesPage } from './entities.page';

const routes: Routes = [
  {
    path: '',
    component: EntitiesPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'student',
    loadChildren: './student/student.module#StudentPageModule',
  },
  {
    path: 'project',
    loadChildren: './project/project.module#ProjectPageModule',
  },
  {
    path: 'supervisor',
    loadChildren: './supervisor/supervisor.module#SupervisorPageModule',
  },
  {
    path: 'faculty',
    loadChildren: './faculty/faculty.module#FacultyPageModule',
  },
  {
    path: 'announcement',
    loadChildren: './announcement/announcement.module#AnnouncementPageModule',
  },
  {
    path: 'observation',
    loadChildren: './observation/observation.module#ObservationPageModule',
  },
  {
    path: 'file',
    loadChildren: './file/file.module#FilePageModule',
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, RouterModule.forChild(routes), TranslateModule],
  declarations: [EntitiesPage],
})
export class EntitiesPageModule {}
