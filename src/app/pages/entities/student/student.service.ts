import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { Student } from './student.model';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private resourceUrl = ApiService.API_URL + '/students';

  constructor(protected http: HttpClient) { }

  create(student: Student): Observable<HttpResponse<Student>> {
    return this.http.post<Student>(this.resourceUrl, student, { observe: 'response' });
  }

  update(student: Student): Observable<HttpResponse<Student>> {
    return this.http.put(this.resourceUrl, student, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Student>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Student[]>> {
    const options = createRequestOption(req);
    return this.http.get<Student[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
