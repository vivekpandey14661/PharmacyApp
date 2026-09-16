import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RecordSaleRequest, SaleRecord } from '../models/sale';

@Injectable({ providedIn: 'root' })
export class SaleService {
  private readonly baseUrl = 'http://localhost:5000/api/sales';

  constructor(private http: HttpClient) {}

  getAll(): Observable<SaleRecord[]> {
    return this.http.get<SaleRecord[]>(this.baseUrl);
  }

  record(request: RecordSaleRequest): Observable<SaleRecord> {
    return this.http.post<SaleRecord>(this.baseUrl, request);
  }
}
