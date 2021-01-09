import { NgModule, Injectable } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserRouteAccessService } from '../../../services/auth/user-route-access.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';

import { SupervisorPage } from './supervisor';
import { SupervisorUpdatePage } from './supervisor-update';
import { Supervisor, SupervisorService, SupervisorDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class SupervisorResolve implements Resolve<Supervisor> {
  constructor(private service: SupervisorService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Supervisor> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Supervisor>) => response.ok),
        map((supervisor: HttpResponse<Supervisor>) => supervisor.body)
      );
    }
    return of(new Supervisor());
  }
}

const routes: Routes = [
  {
    path: '',
    component: SupervisorPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SupervisorUpdatePage,
    resolve: {
      data: SupervisorResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SupervisorDetailPage,
    resolve: {
      data: SupervisorResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SupervisorUpdatePage,
    resolve: {
      data: SupervisorResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [SupervisorPage, SupervisorUpdatePage, SupervisorDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class SupervisorPageModule {}
