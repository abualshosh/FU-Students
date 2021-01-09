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

import { BatchPage } from './batch';
import { BatchUpdatePage } from './batch-update';
import { Batch, BatchService, BatchDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class BatchResolve implements Resolve<Batch> {
  constructor(private service: BatchService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Batch> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Batch>) => response.ok),
        map((batch: HttpResponse<Batch>) => batch.body)
      );
    }
    return of(new Batch());
  }
}

const routes: Routes = [
  {
    path: '',
    component: BatchPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BatchUpdatePage,
    resolve: {
      data: BatchResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BatchDetailPage,
    resolve: {
      data: BatchResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BatchUpdatePage,
    resolve: {
      data: BatchResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [BatchPage, BatchUpdatePage, BatchDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class BatchPageModule {}
