import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { Batch } from './batch.model';

@Injectable({ providedIn: 'root' })
export class BatchService {
  private resourceUrl = ApiService.API_URL + '/batches';

  constructor(protected http: HttpClient) {}

  create(batch: Batch): Observable<HttpResponse<Batch>> {
    return this.http.post<Batch>(this.resourceUrl, batch, { observe: 'response' });
  }

  update(batch: Batch): Observable<HttpResponse<Batch>> {
    return this.http.put(this.resourceUrl, batch, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Batch>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Batch[]>> {
    const options = createRequestOption(req);
    return this.http.get<Batch[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
