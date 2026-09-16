import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Medicine, NewMedicine } from '../models/medicine';

@Injectable({ providedIn: 'root' })
export class MedicineService {
  private readonly baseUrl = 'http://localhost:5000/api/medicines';

  constructor(private http: HttpClient) {}

  getAll(search?: string): Observable<Medicine[]> {
    let params = new HttpParams();
    if (search && search.trim().length > 0) {
      params = params.set('search', search.trim());
    }
    return this.http.get<Medicine[]>(this.baseUrl, { params });
  }

  add(medicine: NewMedicine): Observable<Medicine> {
    return this.http.post<Medicine>(this.baseUrl, medicine);
  }
}
