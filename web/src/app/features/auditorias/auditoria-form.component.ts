import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';
import { environment } from '../../../environments/environment';
import { PageHeaderComponent } from '../../shared/components/page-header.component';

@Component({
  selector: 'app-auditoria-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    MatCardModule, MatFormFieldModule, MatSelectModule,
    MatInputModule, MatButtonModule, MatSlideToggleModule,
    MatDividerModule, MatProgressSpinnerModule, StatusBadgeComponent, PageHeaderComponent,
  ],
  template: `
    <app-page-header [title]="isNew ? 'Abrir Auditoria' : 'Auditoria ' + (auditoria?.codigo ?? '')" />

    @if (loading) {
      <div class="flex justify-center p-8">
        <mat-spinner diameter="40" />
      </div>
    } @else {
      @if (isNew || editing) {
        <mat-card class="mb-4">
          <mat-card-content>
            <h3>{{ isNew ? 'Nova Auditoria' : 'Editar' }}</h3>
            <form (ngSubmit)="salvar()" class="flex flex-col gap-4">
              <mat-form-field appearance="outline">
                <mat-label>Item do PAA</mat-label>
                <mat-select #itemPlanoModel="ngModel" [(ngModel)]="form.itemPlanoId" name="itemPlanoId" required>
                  @for (i of itensPlano; track i.id) {
                    <mat-option [value]="i.id">
                      {{ i.nome || i.id }} — {{ i.plano?.tipo || 'PAA' }}
                    </mat-option>
                  }
                </mat-select>
                @if (itemPlanoModel.invalid && itemPlanoModel.touched) {
                  <mat-error>Item do PAA obrigatório</mat-error>
                }
                @if (itensPlano.length === 0) {
                  <mat-hint>Carregando itens do plano...</mat-hint>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Observações</mat-label>
                <textarea matInput [(ngModel)]="form.observacoes" name="observacoes" rows="3"></textarea>
              </mat-form-field>

              <mat-slide-toggle [(ngModel)]="form.sigilosa" name="sigilosa" color="warn">
                Auditoria Sigilosa
              </mat-slide-toggle>

              <div>
                <button mat-raised-button color="primary" type="submit"
                        [disabled]="!form.itemPlanoId">
                  {{ isNew ? 'Abrir Auditoria' : 'Salvar' }}
                </button>
                <button mat-button type="button" (click)="router.navigate(['/auditorias'])" class="ml-2">
                  Cancelar
                </button>
              </div>
            </form>

            @if (error) {
              <p class="text-critical mt-2">{{ error }}</p>
            }
            @if (success) {
              <p class="text-success mt-2">{{ success }}</p>
            }
          </mat-card-content>
        </mat-card>
      }

      @if (!isNew && auditoria) {
        <mat-card class="mb-4">
          <mat-card-content>
            <h3>Detalhes</h3>
            <p><strong>Status:</strong>
              <app-status-badge [status]="auditoria.status" />
            </p>
            @if (auditoria.codigo) {
              <p><strong>Código:</strong> {{ auditoria.codigo }}</p>
            }
            @if (auditoria.unidadeAuditada) {
              <p><strong>Unidade Auditada:</strong> {{ auditoria.unidadeAuditada }}</p>
            }
            @if (auditoria.observacoes) {
              <p><strong>Observações:</strong> {{ auditoria.observacoes }}</p>
            }
            @if (auditoria.motivoSuspensao) {
              <p><strong>Motivo Suspensão:</strong> {{ auditoria.motivoSuspensao }}</p>
            }
            @if (auditoria.createdAt) {
              <p><strong>Criada em:</strong> {{ auditoria.createdAt | date:'dd/MM/yyyy HH:mm' }}</p>
            }
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-content>
            <h3>Comunicado de Auditoria</h3>
            @if (comunicado) {
              <div class="bg-surface p-4 rounded mb-4">
                <p><strong>Número:</strong> {{ comunicado.numero }}</p>
                <p><strong>Data:</strong> {{ comunicado.dataEmissao | date:'dd/MM/yyyy' }}</p>
                <p><strong>Destinatário:</strong> {{ comunicado.destinatario }}</p>
                <p><strong>Conteúdo:</strong></p>
                <pre class="whitespace-pre-wrap font-sans">{{ comunicado.conteudo }}</pre>
              </div>
            } @else {
              <p class="text-text-sec">Nenhum comunicado gerado ainda.</p>
            }
            <button mat-stroked-button color="primary" (click)="gerarComunicado()"
                    [disabled]="gerando">
              @if (gerando) {
                <mat-spinner diameter="16" class="inline-block mr-1" />
              }
              {{ gerando ? 'Gerando...' : 'Gerar Comunicado' }}
            </button>
          </mat-card-content>
        </mat-card>
      }
    }
  `,
})
export class AuditoriaFormComponent implements OnInit {
  isNew = true;
  auditoria: any = null;
  comunicado: any = null;
  itensPlano: any[] = [];
  editing = false;
  gerando = false;
  loading = true;
  error = '';
  success = '';
  form = { itemPlanoId: '', observacoes: '', sigilosa: false };
  private id = '';

  constructor(
    readonly route: ActivatedRoute,
    readonly router: Router,
    private readonly http: HttpClient,
  ) {}

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.isNew = !this.id;
    this.editing = this.isNew;

    try {
      await Promise.all([this.loadItensPlano()]);
      if (!this.isNew) {
        await this.loadAuditoria();
      }
    } finally {
      this.loading = false;
    }
  }

  async loadItensPlano() {
    try {
      const planos = await firstValueFrom(
        this.http.get<any[]>(`${environment.apiUrl}/planos`, { params: { status: 'APROVADO' } }),
      );
      for (const plano of planos) {
        const itens = await firstValueFrom(
          this.http.get<any[]>(`${environment.apiUrl}/planos/${plano.id}/itens`),
        );
        this.itensPlano.push(...itens.map((i: any) => ({ ...i, plano })));
      }
    } catch {
      // non-blocking
    }
  }

  async loadAuditoria() {
    try {
      this.auditoria = await firstValueFrom(
        this.http.get<any>(`${environment.apiUrl}/auditorias/${this.id}`),
      );
      await this.loadComunicado();
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao carregar auditoria';
    }
  }

  async loadComunicado() {
    try {
      const comunicados = await firstValueFrom(
        this.http.get<any[]>(`${environment.apiUrl}/auditorias/${this.id}/comunicado`),
      );
      if (Array.isArray(comunicados) && comunicados.length) {
        this.comunicado = comunicados[comunicados.length - 1];
      }
    } catch {
      // comunicado pode não existir
    }
  }

  async salvar() {
    this.error = '';
    this.success = '';
    try {
      const result = await firstValueFrom(
        this.http.post(`${environment.apiUrl}/auditorias`, {
          itemPlanoId: this.form.itemPlanoId,
          observacoes: this.form.observacoes || undefined,
          sigilosa: this.form.sigilosa,
        }),
      );
      this.success = 'Auditoria aberta com sucesso';
      this.router.navigate(['/auditorias', (result as any).id]);
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao abrir auditoria';
    }
  }

  async gerarComunicado() {
    this.error = '';
    this.gerando = true;
    try {
      this.comunicado = await firstValueFrom(
        this.http.post<any>(`${environment.apiUrl}/auditorias/${this.id}/comunicado`, {}),
      );
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao gerar comunicado';
    } finally {
      this.gerando = false;
    }
  }


}
