import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { Observation } from './observation.model';

@Injectable({ providedIn: 'root' })
export class ObservationService {
  private resourceUrl = ApiService.API_URL + '/observations';

  constructor(protected http: HttpClient) {}

  create(observation: Observation): Observable<HttpResponse<Observation>> {
    return this.http.post<Observation>(this.resourceUrl, observation, { observe: 'response' });
  }

  update(observation: Observation): Observable<HttpResponse<Observation>> {
    return this.http.put(this.resourceUrl, observation, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Observation>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Observation[]>> {
    const options = createRequestOption(req);
    return this.http.get<Observation[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
