import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { Supervisor } from './supervisor.model';

@Injectable({ providedIn: 'root' })
export class SupervisorService {
  private resourceUrl = ApiService.API_URL + '/supervisors';

  constructor(protected http: HttpClient) {}

  create(supervisor: Supervisor): Observable<HttpResponse<Supervisor>> {
    return this.http.post<Supervisor>(this.resourceUrl, supervisor, { observe: 'response' });
  }

  update(supervisor: Supervisor): Observable<HttpResponse<Supervisor>> {
    return this.http.put(this.resourceUrl, supervisor, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Supervisor>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Supervisor[]>> {
    const options = createRequestOption(req);
    return this.http.get<Supervisor[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
