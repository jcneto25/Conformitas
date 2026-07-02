import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

const API = environment.apiUrl;

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  mfa_required?: boolean;
  session_token?: string;
}

export interface MfaResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface UserProfile {
  id: string;
  nome: string;
  email: string;
  matricula: string;
  cargo: string;
  unidade: string;
  ativo: boolean;
  mfaEnabled: boolean;
  usuariosPerfis: {
    perfil: {
      codigo: string;
      nome: string;
      permissoes: Record<string, unknown>;
    };
  }[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'access_token';
  private readonly refreshKey = 'refresh_token';
  private refreshPromise: Promise<void> | null = null;

  readonly user = signal<UserProfile | null>(null);
  readonly isAuthenticated = signal(false);
  readonly userRoles = signal<string[]>([]);

  /** Resolves once the initial session/profile restore attempt has settled. */
  readonly ready: Promise<void>;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
  ) {
    this.ready = this.tryRestoreSession();
  }

  async login(email: string, senha: string): Promise<LoginResponse> {
    const res = await firstValueFrom(
      this.http.post<LoginResponse>(`${API}/auth/login`, { email, senha }),
    );
    if (!res.mfa_required) {
      this.setSession(res.access_token, res.refresh_token);
      await this.loadProfile();
    }
    return res;
  }

  async verifyMfa(sessionToken: string, totpCode: string): Promise<void> {
    const res = await firstValueFrom(
      this.http.post<MfaResponse>(`${API}/auth/mfa/verify`, {
        session_token: sessionToken,
        totp_code: totpCode,
      }),
    );
    this.setSession(res.access_token, res.refresh_token);
    await this.loadProfile();
  }

  async refresh(): Promise<void> {
    const refreshToken = localStorage.getItem(this.refreshKey);
    if (!refreshToken) {
      this.clearSession();
      throw new Error('No refresh token');
    }

    const res = await firstValueFrom(
      this.http.post<LoginResponse>(`${API}/auth/refresh`, {
        refresh_token: refreshToken,
      }),
    );
    this.setSession(res.access_token, res.refresh_token);
  }

  async tryRefresh(): Promise<boolean> {
    if (this.refreshPromise) return this.refreshPromise.then(() => true).catch(() => false);
    this.refreshPromise = this.refresh().catch((err) => {
      this.refreshPromise = null;
      throw err;
    });
    try {
      await this.refreshPromise;
      return true;
    } catch {
      return false;
    } finally {
      this.refreshPromise = null;
    }
  }

  async loadProfile(): Promise<void> {
    try {
      const profile = await firstValueFrom(
        this.http.get<UserProfile>(`${API}/auth/profile`),
      );
      this.user.set(profile);
      this.userRoles.set(
        profile.usuariosPerfis?.map((up) => up.perfil.codigo) ?? [],
      );
    } catch {
      this.clearSession();
    }
  }

  logout(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }

  hasRole(role: string): boolean {
    return this.userRoles().includes(role);
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.some((r) => this.userRoles().includes(r));
  }

  private setSession(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.tokenKey, accessToken);
    localStorage.setItem(this.refreshKey, refreshToken);
    this.isAuthenticated.set(true);
  }

  private clearSession(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshKey);
    localStorage.removeItem('session_token');
    this.user.set(null);
    this.userRoles.set([]);
    this.isAuthenticated.set(false);
  }

  private async tryRestoreSession(): Promise<void> {
    const token = localStorage.getItem(this.tokenKey);
    if (!token) return;
    this.isAuthenticated.set(true);
    try {
      await this.loadProfile();
    } catch {
      const refreshed = await this.tryRefresh();
      if (refreshed) {
        await this.loadProfile();
      }
    }
  }
}
