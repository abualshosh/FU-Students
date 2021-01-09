import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { Faculty } from '../../model/faculty.model';

@Injectable({ providedIn: 'root' })
export class FacultyService {
  private resourceUrl = ApiService.API_URL + '/faculties';

  constructor(protected http: HttpClient) {}

  create(faculty: Faculty): Observable<HttpResponse<Faculty>> {
    return this.http.post<Faculty>(this.resourceUrl, faculty, { observe: 'response' });
  }

  update(faculty: Faculty): Observable<HttpResponse<Faculty>> {
    return this.http.put(this.resourceUrl, faculty, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Faculty>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Faculty[]>> {
    const options = createRequestOption(req);
    return this.http.get<Faculty[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
