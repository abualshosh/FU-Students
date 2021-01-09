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

import { StudentPage } from './student';
import { StudentUpdatePage } from './student-update';
import { Student, StudentService, StudentDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class StudentResolve implements Resolve<Student> {
  constructor(private service: StudentService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Student> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Student>) => response.ok),
        map((student: HttpResponse<Student>) => student.body)
      );
    }
    return of(new Student());
  }
}

const routes: Routes = [
  {
    path: '',
    component: StudentPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: StudentUpdatePage,
    resolve: {
      data: StudentResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: StudentDetailPage,
    resolve: {
      data: StudentResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: StudentUpdatePage,
    resolve: {
      data: StudentResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [StudentPage, StudentUpdatePage, StudentDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class StudentPageModule {}
