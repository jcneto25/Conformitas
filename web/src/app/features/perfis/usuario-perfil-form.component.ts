import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../../../environments/environment';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { SkeletonComponent } from '../../shared/components/skeleton.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../shared/components/confirm-dialog.component';
import { HasRoleDirective } from '../../core/directives/has-role.directive';

@Component({
  selector: 'app-usuario-perfil-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule, MatDialogModule,
    MatCardModule, MatFormFieldModule, MatSelectModule,
    MatButtonModule, MatListModule, MatIconModule, MatDividerModule,
    MatProgressSpinnerModule, PageHeaderComponent, SkeletonComponent, HasRoleDirective,
  ],
  template: `
    <app-page-header title="Perfis do Usuário" />

    @if (loading) {
      <div class="flex justify-center p-8"><app-skeleton type="card" /></div>
    } @else {
      @if (usuario) {
        <mat-card class="mb-4">
          <mat-card-content>
            <p><strong>Nome:</strong> {{ usuario.nome }}</p>
            <p><strong>Email:</strong> {{ usuario.email }}</p>
            <p><strong>Matrícula:</strong> {{ usuario.matricula }}</p>
          </mat-card-content>
        </mat-card>
      }

      <mat-card class="mb-4">
        <mat-card-content>
          <h3>Perfis Atribuídos</h3>
          @if (perfisUsuario.length) {
            <mat-list>
              @for (up of perfisUsuario; track up.id) {
                <mat-list-item>
                  <span matListItemTitle>
                    <strong>{{ up.perfil?.codigo }}</strong> — {{ up.perfil?.nome }}
                  </span>
                  @if (up.unidadeEscopo) {
                    <span matListItemLine>
                      Escopo: {{ up.unidadeEscopo }}
                    </span>
                  }
                  <button mat-icon-button matListItemMeta color="warn"
                          (click)="removerPerfil(up.id)" title="Remover perfil" aria-label="Remover perfil" *appHasRole="'P10'">
                    <mat-icon>delete</mat-icon>
                  </button>
                </mat-list-item>
                <mat-divider />
              }
            </mat-list>
          } @else {
            <p class="text-text-sec p-4">Nenhum perfil atribuído.</p>
          }
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-content>
          <h3>Atribuir Perfil</h3>
          <form (ngSubmit)="atribuir()" class="flex gap-4 items-end flex-wrap">
            <mat-form-field appearance="outline" class="min-w-[300px]">
              <mat-label>Perfil</mat-label>
              <mat-select #perfilModel="ngModel" [(ngModel)]="perfilSelecionado" name="perfil" required>
                @for (p of perfisDisponiveis; track p.id) {
                  <mat-option [value]="p.id">
                    {{ p.codigo }} — {{ p.nome }}
                  </mat-option>
                }
              </mat-select>
              @if (perfilModel.invalid && perfilModel.touched) {
                <mat-error>Selecione um perfil</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="min-w-[250px]">
              <mat-label>Unidade (escopo opcional)</mat-label>
              <input matInput [(ngModel)]="unidadeEscopo" name="unidade" placeholder="Ex: 1ª Vara Cível" />
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit"
                    [disabled]="!perfilSelecionado" *appHasRole="'P10'">
              Atribuir
            </button>
          </form>

          @if (success) {
            <p class="text-success mt-2">{{ success }}</p>
          }
          @if (error) {
            <p class="text-critical mt-2">{{ error }}</p>
          }
        </mat-card-content>
      </mat-card>
    }

    @if (loadError) {
      <p class="text-critical text-center mt-4">{{ loadError }}</p>
    }
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
  loadError = '';
  loading = true;
  private usuarioId = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly http: HttpClient,
    private readonly dialog: MatDialog,
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
        this.http.get<any>(`${environment.apiUrl}/usuarios/${this.usuarioId}`),
      );
    } catch (err: any) {
      this.loadError = 'Erro ao carregar usuário';
    }
  }

  async loadPerfisUsuario() {
    try {
      this.perfisUsuario = await firstValueFrom(
        this.http.get<any[]>(`${environment.apiUrl}/usuarios/${this.usuarioId}/perfis`),
      );
    } catch (err: any) {
      this.loadError = 'Erro ao carregar perfis do usuário';
    }
  }

  async loadPerfis() {
    try {
      this.perfisDisponiveis = await firstValueFrom(
        this.http.get<any[]>(`${environment.apiUrl}/perfis`),
      );
    } catch (err: any) {
      // non-blocking
    } finally {
      this.loading = false;
    }
  }

  async atribuir() {
    if (!this.perfilSelecionado) return;
    this.error = '';
    this.success = '';
    try {
      await firstValueFrom(
        this.http.post(`${environment.apiUrl}/usuarios/${this.usuarioId}/perfis`, {
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
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Confirmar', message: 'Remover perfil do usuário?', confirmText: 'Sim', cancelText: 'Não', type: 'danger' } as ConfirmDialogData,
    });
    const confirmed = await firstValueFrom(ref.afterClosed());
    if (!confirmed) return;
    this.error = '';
    try {
      await firstValueFrom(
        this.http.delete(`${environment.apiUrl}/usuarios-perfis/${usuarioPerfilId}`),
      );
      await this.loadPerfisUsuario();
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao remover perfil';
    }
  }
}
