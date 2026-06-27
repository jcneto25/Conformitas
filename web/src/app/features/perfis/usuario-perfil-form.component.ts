import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

const API = 'http://localhost:3001/api/v1';

@Component({
  selector: 'app-usuario-perfil-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    MatCardModule, MatFormFieldModule, MatSelectModule,
    MatButtonModule, MatListModule, MatIconModule, MatDividerModule,
  ],
  template: `
    <h1>Perfis do Usuário</h1>

    <mat-card *ngIf="usuario" style="margin-bottom: 1rem;">
      <mat-card-content>
        <p><strong>Nome:</strong> {{ usuario.nome }}</p>
        <p><strong>Email:</strong> {{ usuario.email }}</p>
        <p><strong>Matrícula:</strong> {{ usuario.matricula }}</p>
      </mat-card-content>
    </mat-card>

    <!-- Lista de perfis atuais -->
    <mat-card style="margin-bottom: 1rem;">
      <mat-card-content>
        <h3>Perfis Atribuídos</h3>
        <mat-list *ngIf="perfisUsuario.length; else semPerfis">
          @for (up of perfisUsuario; track up.id) {
            <mat-list-item>
              <span matListItemTitle>
                <strong>{{ up.perfil?.codigo }}</strong> — {{ up.perfil?.nome }}
              </span>
              <span matListItemLine *ngIf="up.unidadeEscopo">
                Escopo: {{ up.unidadeEscopo }}
              </span>
              <button mat-icon-button matListItemMeta color="warn"
                      (click)="removerPerfil(up.id)" title="Remover perfil">
                <mat-icon>delete</mat-icon>
              </button>
            </mat-list-item>
            <mat-divider />
          }
        </mat-list>
        <ng-template #semPerfis>
          <p style="color: #999; padding: 1rem;">Nenhum perfil atribuído.</p>
        </ng-template>
      </mat-card-content>
    </mat-card>

    <!-- Atribuir novo perfil -->
    <mat-card>
      <mat-card-content>
        <h3>Atribuir Perfil</h3>
        <form (ngSubmit)="atribuir()" style="display: flex; gap: 1rem; align-items: flex-end; flex-wrap: wrap;">
          <mat-form-field appearance="outline" style="min-width: 300px;">
            <mat-label>Perfil</mat-label>
            <mat-select [(ngModel)]="perfilSelecionado" name="perfil" required>
              @for (p of perfisDisponiveis; track p.id) {
                <mat-option [value]="p.id">
                  {{ p.codigo }} — {{ p.nome }}
                </mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" style="min-width: 250px;">
            <mat-label>Unidade (escopo opcional)</mat-label>
            <input matInput [(ngModel)]="unidadeEscopo" name="unidade" placeholder="Ex: 1ª Vara Cível" />
          </mat-form-field>

          <button mat-raised-button color="primary" type="submit"
                  [disabled]="!perfilSelecionado">
            Atribuir
          </button>
        </form>

        <p *ngIf="success" style="color: #2e7d32; margin-top: 0.5rem;">{{ success }}</p>
        <p *ngIf="error" style="color: #c62828; margin-top: 0.5rem;">{{ error }}</p>
      </mat-card-content>
    </mat-card>
  `,
})
export class UsuarioPerfilFormComponent implements OnInit {
  usuario: any = null;
  perfisUsuario: any[] = [];
  perfisDisponiveis: any[] = [];
  perfilSelecionado = '';
  unidadeEscopo = '';
  error = '';
  success = '';
  private usuarioId = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly http: HttpClient,
  ) {}

  async ngOnInit() {
    this.usuarioId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.usuarioId) {
      this.router.navigate(['/usuarios']);
      return;
    }
    await Promise.all([this.loadUsuario(), this.loadPerfisUsuario(), this.loadPerfis()]);
  }

  async loadUsuario() {
    try {
      this.usuario = await firstValueFrom(
        this.http.get<any>(`${API}/usuarios/${this.usuarioId}`),
      );
    } catch (err: any) {
      this.error = 'Erro ao carregar usuário';
    }
  }

  async loadPerfisUsuario() {
    try {
      this.perfisUsuario = await firstValueFrom(
        this.http.get<any[]>(`${API}/usuarios/${this.usuarioId}/perfis`),
      );
    } catch (err: any) {
      this.error = 'Erro ao carregar perfis do usuário';
    }
  }

  async loadPerfis() {
    try {
      this.perfisDisponiveis = await firstValueFrom(
        this.http.get<any[]>(`${API}/perfis`),
      );
    } catch (err: any) {
      // non-blocking
    }
  }

  async atribuir() {
    if (!this.perfilSelecionado) return;
    this.error = '';
    this.success = '';
    try {
      await firstValueFrom(
        this.http.post(`${API}/usuarios/${this.usuarioId}/perfis`, {
          perfil_id: this.perfilSelecionado,
          unidade_escopo: this.unidadeEscopo || undefined,
        }),
      );
      this.success = 'Perfil atribuído com sucesso';
      this.perfilSelecionado = '';
      this.unidadeEscopo = '';
      await this.loadPerfisUsuario();
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao atribuir perfil';
    }
  }

  async removerPerfil(usuarioPerfilId: string) {
    this.error = '';
    try {
      await firstValueFrom(
        this.http.delete(`${API}/usuarios-perfis/${usuarioPerfilId}`),
      );
      await this.loadPerfisUsuario();
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao remover perfil';
    }
  }
}
