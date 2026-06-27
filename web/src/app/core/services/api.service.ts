import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

const API = 'http://localhost:3001/api/v1';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private readonly http: HttpClient) {}

  getAuditorias(params?: { status?: string }) {
    return firstValueFrom(
      this.http.get<any[]>(`${API}/auditorias`, { params }),
    );
  }

  getPlanos(params?: { status?: string }) {
    return firstValueFrom(
      this.http.get<any[]>(`${API}/planos`, { params }),
    );
  }

  getAchados(params?: { status?: string }) {
    return firstValueFrom(
      this.http.get<any[]>(`${API}/achados`, { params }),
    );
  }
}
