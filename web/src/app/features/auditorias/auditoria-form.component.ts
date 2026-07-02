import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
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
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';
import { environment } from '../../../environments/environment';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { ValidationService } from '../../shared/services/validation.service';

@Component({
  selector: 'app-auditoria-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    MatCardModule, MatFormFieldModule, MatSelectModule,
    MatInputModule, MatButtonModule, MatSlideToggleModule,
    MatDividerModule, MatIconModule, MatProgressSpinnerModule, StatusBadgeComponent, PageHeaderComponent, EmptyStateComponent,
  ],
  template: `
    <app-page-header [title]="isNew ? 'Abrir Auditoria' : 'Auditoria ' + (auditoria?.codigo ?? '')" />

    @if (loading) {
      <div class="flex justify-center py-12">
        <mat-spinner diameter="40" />
      </div>
    } @else {
      @if (isNew || editing) {
        <div class="max-w-2xl">
          <mat-card class="border-t-4 border-primary shadow-md rounded-xl overflow-hidden">
            <mat-card-header class="bg-slate-50/50 px-6 py-4 border-b border-gray-100">
              <mat-card-title class="text-lg font-semibold text-text-main flex items-center gap-2">
                <mat-icon class="text-primary">fact_check</mat-icon>
                {{ isNew ? 'Nova Auditoria' : 'Editar' }}
              </mat-card-title>
              <mat-card-subtitle class="text-xs text-text-sec">Selecione o item do PAA e registre as observações da auditoria.</mat-card-subtitle>
            </mat-card-header>

            <mat-card-content class="p-6">
              <form (ngSubmit)="salvar()" #auditoriaForm="ngForm" class="flex flex-col gap-4">
                <div class="grid grid-cols-1 gap-x-4 gap-y-1">
                  <mat-form-field appearance="outline" class="w-full">
                    <mat-label>Item do PAA</mat-label>
                    <mat-select #itemPlanoModel="ngModel" [(ngModel)]="form.itemPlanoId" name="itemPlanoId" required>
                      @for (i of itensPlano; track i.id) {
                        <mat-option [value]="i.id">
                          {{ i.nome || i.id }} — {{ i.plano?.tipo || 'PAA' }}
                        </mat-option>
                      }
                    </mat-select>
                    @if (itemPlanoModel.invalid && itemPlanoModel.touched) {
                      <mat-error>{{ validation.required('Item do PAA') }}</mat-error>
                    }
                    @if (itensPlano.length === 0) {
                      <mat-hint>Carregando itens do plano...</mat-hint>
                    }
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="w-full">
                    <mat-label>Observações</mat-label>
                    <textarea matInput [(ngModel)]="form.observacoes" name="observacoes" rows="3"></textarea>
                  </mat-form-field>
                </div>

                <mat-slide-toggle [(ngModel)]="form.sigilosa" name="sigilosa" color="warn">
                  Auditoria Sigilosa
                </mat-slide-toggle>

                @if (error) {
                  <div class="flex items-center gap-2 text-red-600 text-sm p-3 bg-red-50 rounded-lg border border-red-100 mt-2" role="alert">
                    <mat-icon class="text-[18px]">error_outline</mat-icon>
                    <span>{{ error }}</span>
                  </div>
                }
                @if (success) {
                  <div class="flex items-center gap-2 text-green-700 text-sm p-3 bg-green-50 rounded-lg border border-green-100 mt-2">
                    <mat-icon class="text-[18px]">check_circle</mat-icon>
                    <span>{{ success }}</span>
                  </div>
                }

                <div class="form-actions">
                  <button mat-stroked-button type="button" (click)="router.navigate(['/auditorias'])">Cancelar</button>
                  <button mat-raised-button color="primary" type="submit"
                          [disabled]="!form.itemPlanoId" class="min-w-[120px]">
                    {{ isNew ? 'Abrir Auditoria' : 'Salvar' }}
                  </button>
                </div>
              </form>
            </mat-card-content>
          </mat-card>
        </div>
      }

      @if (!isNew && auditoria) {
        <mat-card class="mb-4 border-t-4 border-primary shadow-md rounded-xl overflow-hidden">
          <mat-card-header class="bg-slate-50/50 px-6 py-4 border-b border-gray-100">
            <mat-card-title class="text-lg font-semibold text-text-main flex items-center gap-2">
              <mat-icon class="text-primary">description</mat-icon>
              Detalhes
            </mat-card-title>
          </mat-card-header>
          <mat-card-content class="p-6">
            <p class="flex items-center gap-2"><strong class="text-text-main">Status:</strong>
              <app-status-badge [status]="auditoria.status" />
            </p>
            @if (auditoria.codigo) {
              <p class="text-text-sec"><strong class="text-text-main">Código:</strong> {{ auditoria.codigo }}</p>
            }
            @if (auditoria.unidadeAuditada) {
              <p class="text-text-sec"><strong class="text-text-main">Unidade Auditada:</strong> {{ auditoria.unidadeAuditada }}</p>
            }
            @if (auditoria.observacoes) {
              <p class="text-text-sec"><strong class="text-text-main">Observações:</strong> {{ auditoria.observacoes }}</p>
            }
            @if (auditoria.motivoSuspensao) {
              <p class="text-text-sec"><strong class="text-text-main">Motivo Suspensão:</strong> {{ auditoria.motivoSuspensao }}</p>
            }
            @if (auditoria.createdAt) {
              <p class="text-text-sec"><strong class="text-text-main">Criada em:</strong> {{ auditoria.createdAt | date:'dd/MM/yyyy HH:mm' }}</p>
            }
          </mat-card-content>
        </mat-card>

        <mat-card class="border-t-4 border-primary shadow-md rounded-xl overflow-hidden">
          <mat-card-header class="bg-slate-50/50 px-6 py-4 border-b border-gray-100">
            <mat-card-title class="text-lg font-semibold text-text-main flex items-center gap-2">
              <mat-icon class="text-primary">mail</mat-icon>
              Comunicado de Auditoria
            </mat-card-title>
          </mat-card-header>
          <mat-card-content class="p-6">
            @if (comunicado) {
              <div class="bg-blue-50 border border-blue-100 p-4 rounded-lg mb-4">
                <p class="text-text-main"><strong>Número:</strong> {{ comunicado.numero }}</p>
                <p class="text-text-main"><strong>Data:</strong> {{ comunicado.dataEmissao | date:'dd/MM/yyyy' }}</p>
                <p class="text-text-main"><strong>Destinatário:</strong> {{ comunicado.destinatario }}</p>
                <p class="text-text-main"><strong>Conteúdo:</strong></p>
                <pre class="whitespace-pre-wrap font-sans">{{ comunicado.conteudo }}</pre>
              </div>
            } @else {
              <app-empty-state icon="mail_outline" title="Nenhum comunicado gerado ainda" description="Clique em Gerar Comunicado para emitir o comunicado de auditoria." size="sm" />
            }
            <button mat-stroked-button color="primary" (click)="gerarComunicado()"
                    [disabled]="gerando" class="min-w-[160px]">
              @if (gerando) {
                <mat-spinner diameter="18" class="inline-block mr-2" />
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
  /** Referência ao ngForm para detecção de alterações não salvas (Epic D4). */
  @ViewChild('auditoriaForm') formRef?: NgForm;
  private saved = false;

  /** Guard de saída: bloqueia navegação se o formulário estiver "dirty" e não salvo. */
  canDeactivate(): boolean {
    if (this.saved) return true;
    return !this.formRef?.dirty;
  }

  constructor(
    readonly route: ActivatedRoute,
    readonly router: Router,
    private readonly http: HttpClient,
    public readonly validation: ValidationService,
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
      this.saved = true;
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
