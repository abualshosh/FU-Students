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

import { FacultyPage } from './faculty';
import { FacultyUpdatePage } from './faculty-update';
import { Faculty, FacultyService, FacultyDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class FacultyResolve implements Resolve<Faculty> {
  constructor(private service: FacultyService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Faculty> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Faculty>) => response.ok),
        map((faculty: HttpResponse<Faculty>) => faculty.body)
      );
    }
    return of(new Faculty());
  }
}

const routes: Routes = [
  {
    path: '',
    component: FacultyPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FacultyUpdatePage,
    resolve: {
      data: FacultyResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FacultyDetailPage,
    resolve: {
      data: FacultyResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FacultyUpdatePage,
    resolve: {
      data: FacultyResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [FacultyPage, FacultyUpdatePage, FacultyDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class FacultyPageModule {}
