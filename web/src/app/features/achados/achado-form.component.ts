import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';
import { MatStepperModule } from '@angular/material/stepper';
import { ToastService } from '../../core/services/toast.service';
import { AuthService } from '../../core/services/auth.service';
import { ValidationService } from '../../shared/services/validation.service';
import { environment } from '../../../environments/environment';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../shared/components/confirm-dialog.component';

const API = environment.apiUrl;

/** Base normativa dos 4 atributos do achado (RF-006.2) — fonte única da citação na UI. */
const NORMA_ACHADO = 'CNJ 309 art. 46';

@Component({
  selector: 'app-achado-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule, MatDialogModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatDividerModule,
    MatListModule, MatIconModule, MatProgressSpinnerModule,
    MatStepperModule, StatusBadgeComponent,
    PageHeaderComponent, EmptyStateComponent,
  ],
  template: `
    @if (loadError) {
      <mat-card class="border border-red-200 bg-red-50 rounded-xl shadow-sm">
        <mat-card-content class="flex items-center gap-2 text-red-600 p-4">
          <mat-icon>error_outline</mat-icon>
          <span class="text-sm">{{ loadError }}</span>
          <button mat-button color="primary" (click)="load()" class="ml-auto">Tentar novamente</button>
        </mat-card-content>
      </mat-card>
    } @else if (loading) {
      <div class="flex justify-center py-8"><mat-spinner diameter="40" /></div>
    } @else {
      <app-page-header [title]="isNew ? 'Novo Achado' : 'Achado ' + (achado?.codigo ?? '')" />
      @if (achado) {
        <div class="flex items-center gap-3 mb-6">
          <span class="text-sm text-text-sec font-medium">Status atual:</span>
          <app-status-badge [status]="achado.status" />
        </div>
      }

      @if (!isNew && achado?.prazoManifestacao) {
        <mat-card class="mb-6 bg-blue-50 border border-blue-100 rounded-xl shadow-sm">
          <mat-card-content class="text-sm text-blue-700 p-4 flex items-center gap-2">
            <mat-icon class="text-[18px]">schedule</mat-icon>
            Prazo para manifestação: {{ achado.prazoManifestacao | date:'short' }}
          </mat-card-content>
        </mat-card>
      }

      @if (isNew) {
        <mat-card class="border-t-4 border-primary shadow-md rounded-xl overflow-hidden">
          <mat-card-header class="bg-slate-50/50 px-6 py-4 border-b border-gray-100">
            <mat-card-title class="text-lg font-semibold text-text-main flex items-center gap-2">
              <mat-icon class="text-primary">find_in_page</mat-icon> Registrar Achado
            </mat-card-title>
            <mat-card-subtitle class="text-xs text-text-sec">
              Preencha os 4 atributos do achado ({{ normaAchado }}) em 3 etapas.
            </mat-card-subtitle>
          </mat-card-header>
          <mat-card-content class="p-6">
            <form (ngSubmit)="save()" #achadoForm="ngForm">
              <mat-stepper #stepper="matStepper" class="bg-transparent">
                <!-- Step 1: Identificação -->
                <mat-step>
                  <ng-template matStepLabel>Identificação</ng-template>
                  <div class="flex flex-col gap-4 py-4">
                    @if (!auditoriaId) {
                      <mat-form-field appearance="outline" class="w-full">
                        <mat-label>Auditoria</mat-label>
                        <mat-select [(ngModel)]="selectedAuditoriaId" name="auditoria" required #audModel="ngModel" (selectionChange)="onAuditoriaChange()">
                          <mat-option *ngFor="let a of auditorias" [value]="a.id">{{ a.numero }} — {{ a.unidadeAuditada }}</mat-option>
                        </mat-select>
                        @if (audModel.invalid && audModel.touched) {
                          <mat-error>Selecione a auditoria relacionada</mat-error>
                        }
                      </mat-form-field>
                    }
                    <mat-form-field appearance="outline" class="w-full">
                      <mat-label>Tipo de Achado</mat-label>
                      <mat-select [(ngModel)]="form.tipo" name="tipo" required #tipoModel="ngModel">
                        <mat-option value="NEGATIVO">Negativo</mat-option>
                        <mat-option value="POSITIVO">Positivo</mat-option>
                      </mat-select>
                      @if (tipoModel.invalid && tipoModel.touched) {
                        <mat-error>{{ validation.required('Tipo de achado') }}</mat-error>
                      }
                    </mat-form-field>
                    @if (evidencias.length > 0) {
                      <mat-form-field appearance="outline" class="w-full">
                        <mat-label>Evidências vinculadas</mat-label>
                        <mat-select [(ngModel)]="form.evidenciaIds" name="evidencias" multiple>
                          <mat-option *ngFor="let e of evidencias" [value]="e.id">{{ e.tipo }} — {{ e.descricao }}</mat-option>
                        </mat-select>
                      </mat-form-field>
                    }
                  </div>
                  <div class="flex justify-end gap-2 pt-2">
                    <button mat-stroked-button matStepperNext type="button">Próximo</button>
                  </div>
                </mat-step>

                <!-- Step 2: Análise -->
                <mat-step>
                  <ng-template matStepLabel>Análise</ng-template>
                  <div class="flex flex-col gap-4 py-4">
                    <mat-form-field appearance="outline" class="w-full">
                      <mat-label>Situação Encontrada</mat-label>
                      <textarea matInput [(ngModel)]="form.situacaoEncontrada" name="situacao" rows="2" required #sitModel="ngModel"></textarea>
                      @if (sitModel.invalid && sitModel.touched) {
                        <mat-error>{{ cnjErros.situacao }}</mat-error>
                      }
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="w-full">
                      <mat-label>Critério</mat-label>
                      <textarea matInput [(ngModel)]="form.criterio" name="criterio" rows="2" required #criterioModel="ngModel"></textarea>
                      @if (criterioModel.invalid && criterioModel.touched) {
                        <mat-error>{{ cnjErros.criterio }}</mat-error>
                      }
                    </mat-form-field>
                  </div>
                  <div class="flex justify-between gap-2 pt-2">
                    <button mat-stroked-button matStepperPrevious type="button">Voltar</button>
                    <button mat-stroked-button matStepperNext type="button">Próximo</button>
                  </div>
                </mat-step>

                <!-- Step 3: Conclusão -->
                <mat-step>
                  <ng-template matStepLabel>Conclusão</ng-template>
                  <div class="flex flex-col gap-4 py-4">
                    <mat-form-field appearance="outline" class="w-full">
                      <mat-label>Causa</mat-label>
                      <textarea matInput [(ngModel)]="form.causa" name="causa" rows="2" required #causaModel="ngModel"></textarea>
                      @if (causaModel.invalid && causaModel.touched) {
                        <mat-error>{{ cnjErros.causa }}</mat-error>
                      }
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="w-full">
                      <mat-label>Efeito</mat-label>
                      <textarea matInput [(ngModel)]="form.efeito" name="efeito" rows="2" required #efeitoModel="ngModel"></textarea>
                      @if (efeitoModel.invalid && efeitoModel.touched) {
                        <mat-error>{{ cnjErros.efeito }}</mat-error>
                      }
                    </mat-form-field>

                    @if (saveError) {
                      <div class="flex items-center gap-2 text-red-600 text-sm p-3 bg-red-50 rounded-lg border border-red-100 mt-2" role="alert">
                        <mat-icon class="text-[18px]">error_outline</mat-icon>
                        <span>{{ saveError }}</span>
                      </div>
                    }
                  </div>
                  <div class="flex justify-between gap-2 pt-2">
                    <button mat-stroked-button matStepperPrevious type="button">Voltar</button>
                    <button mat-raised-button color="primary" type="submit" [disabled]="saving || achadoForm.invalid" class="min-w-[140px]">
                      @if (saving) { <mat-spinner diameter="18" class="inline-block mr-2" /> }
                      Criar Achado
                    </button>
                  </div>
                </mat-step>
              </mat-stepper>
            </form>
          </mat-card-content>
        </mat-card>
      }

      @if (!isNew && achado) {
        <mat-card class="border-t-4 border-primary shadow-md rounded-xl overflow-hidden">
          <mat-card-header class="bg-slate-50/50 px-6 py-4 border-b border-gray-100">
            <mat-card-title class="text-lg font-semibold text-text-main flex items-center gap-2">
              <mat-icon class="text-primary">description</mat-icon> Detalhes do Achado
            </mat-card-title>
            <mat-card-subtitle class="text-xs text-text-sec">Tipo: {{ achado.tipo }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content class="p-6 grid grid-cols-1 gap-4">
            <div><span class="text-xs font-semibold text-text-sec uppercase">Situação Encontrada</span><p class="text-sm text-text-main mt-1">{{ achado.situacaoEncontrada }}</p></div>
            <div><span class="text-xs font-semibold text-text-sec uppercase">Critério</span><p class="text-sm text-text-main mt-1">{{ achado.criterio }}</p></div>
            <div><span class="text-xs font-semibold text-text-sec uppercase">Causa</span><p class="text-sm text-text-main mt-1">{{ achado.causa }}</p></div>
            <div><span class="text-xs font-semibold text-text-sec uppercase">Efeito</span><p class="text-sm text-text-main mt-1">{{ achado.efeito }}</p></div>
            @if (achado.ressalva) {
              <div class="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                <span class="text-xs font-semibold text-amber-700 uppercase">Ressalva</span>
                <p class="text-sm text-amber-800 mt-1">{{ achado.ressalva }}</p>
              </div>
            }
          </mat-card-content>
        </mat-card>

        <mat-card class="mt-6 border-t-4 border-primary shadow-md rounded-xl overflow-hidden">
          <mat-card-header class="bg-slate-50/50 px-6 py-4 border-b border-gray-100">
            <mat-card-title class="text-lg font-semibold text-text-main flex items-center gap-2">
              <mat-icon class="text-primary">forum</mat-icon> Manifestações
            </mat-card-title>
          </mat-card-header>
          <mat-card-content class="p-6">
            @if (manifestacoes.length === 0) {
              <app-empty-state icon="forum" title="Nenhuma manifestação registrada" description="Aguarde a manifestação da unidade auditada." size="sm" />
            } @else {
              <mat-list>
                @for (m of manifestacoes; track m.id) {
                  <mat-list-item>
                    <span matListItemTitle class="text-sm font-medium text-text-main">{{ m.tipo }} — {{ m.dataManifestacao | date:'short' }}</span>
                    <span matListItemLine class="text-text-sec">{{ m.conteudo }}</span>
                  </mat-list-item>
                }
              </mat-list>
            }
          </mat-card-content>
        </mat-card>

        @if (achado.status === 'PRELIMINAR' || achado.status === 'EM_MANIFESTACAO') {
          <div class="flex flex-wrap items-center gap-3 mt-6">
            @if (achado.status === 'PRELIMINAR') {
              <button mat-raised-button color="primary" (click)="enviarManifestacao()" [disabled]="saving" class="flex items-center gap-2">
                <mat-icon>send</mat-icon>
                @if (saving) { <mat-spinner diameter="18" class="inline-block" /> }
                Enviar para Manifestação
              </button>
            }
            @if (achado.status === 'EM_MANIFESTACAO') {
              <button mat-raised-button color="accent" (click)="consolidar()" [disabled]="saving" class="flex items-center gap-2">
                <mat-icon>check_circle</mat-icon>
                @if (saving) { <mat-spinner diameter="18" class="inline-block" /> }
                Consolidar Achado
              </button>
            }
            @if (achado.status === 'EM_MANIFESTACAO' && isP05) {
              <button mat-stroked-button color="primary" [routerLink]="['/achados', id, 'manifestar']" class="flex items-center gap-2">
                <mat-icon>edit_note</mat-icon> Registrar Manifestação
              </button>
            }
          </div>
        }
      }
    }
  `,
})
export class AchadoFormComponent implements OnInit {
  /** Referência normativa exposta ao template (fonte única — RF-006.2). */
  readonly normaAchado = NORMA_ACHADO;
  /** Mensagens de erro dos 4 atributos, derivadas da mesma citação normativa. */
  readonly cnjErros = {
    situacao: `Situação encontrada é obrigatória (${NORMA_ACHADO})`,
    criterio: `Critério é obrigatório (${NORMA_ACHADO})`,
    causa: `Causa é obrigatória (${NORMA_ACHADO})`,
    efeito: `Efeito é obrigatório (${NORMA_ACHADO})`,
  };

  isNew = false;
  achado: any = null;
  manifestacoes: any[] = [];
  loading = false;
  saving = false;
  loadError = '';
  saveError = '';
  auditorias: any[] = [];
  evidencias: any[] = [];
  selectedAuditoriaId = '';
  form = { tipo: 'NEGATIVO', situacaoEncontrada: '', criterio: '', causa: '', efeito: '', evidenciaIds: [] as string[] };
  id = '';
  /** auditoriaId capturado da rota aninhada (auditorias/:auditoriaId/achados/novo). */
  auditoriaId = '';
  isP05 = false;
  @ViewChild('achadoForm') formRef?: NgForm;
  private saved = false;

  canDeactivate(): boolean {
    if (this.saved) return true;
    return !this.formRef?.dirty;
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly http: HttpClient,
    private readonly dialog: MatDialog,
    private readonly toast: ToastService,
    private readonly auth: AuthService,
    public readonly validation: ValidationService,
  ) {}

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.auditoriaId = this.route.snapshot.paramMap.get('auditoriaId') || '';
    this.isNew = !this.id;
    this.isP05 = this.auth.hasRole('P05');
    if (this.isNew) {
      if (this.auditoriaId) await this.loadEvidencias(this.auditoriaId);
      else await this.loadAuditorias();
    } else {
      await this.load();
    }
  }

  async loadAuditorias() {
    try {
      this.auditorias = await firstValueFrom(
        this.http.get<any[]>(`${API}/auditorias`, { params: { status: 'EM_EXECUCAO' } }),
      );
    } catch {
      this.loadError = 'Erro ao carregar auditorias';
    }
  }

  async onAuditoriaChange() {
    this.auditoriaId = this.selectedAuditoriaId;
    if (this.auditoriaId) await this.loadEvidencias(this.auditoriaId);
  }

  async loadEvidencias(auditoriaId: string) {
    try {
      this.evidencias = await firstValueFrom(
        this.http.get<any[]>(`${API}/auditorias/${auditoriaId}/evidencias`),
      );
    } catch {
      this.evidencias = [];
    }
  }

  async load() {
    this.loading = true;
    this.loadError = '';
    try {
      this.achado = await firstValueFrom(this.http.get<any>(`${API}/achados/${this.id}`));
      this.manifestacoes = this.achado?.manifestacoes ?? await firstValueFrom(
        this.http.get<any[]>(`${API}/achados/${this.id}/manifestacoes`),
      );
    } catch {
      this.loadError = 'Erro ao carregar achado';
    } finally {
      this.loading = false;
    }
  }

  async save() {
    if (this.saving) return;
    if (!this.auditoriaId) {
      this.saveError = 'Selecione a auditoria relacionada ao achado';
      return;
    }
    this.saving = true;
    this.saveError = '';
    try {
      await firstValueFrom(
        this.http.post(`${API}/auditorias/${this.auditoriaId}/achados`, {
          tipo: this.form.tipo,
          situacaoEncontrada: this.form.situacaoEncontrada,
          criterio: this.form.criterio,
          causa: this.form.causa,
          efeito: this.form.efeito,
          evidenciaIds: this.form.evidenciaIds,
        }),
      );
      this.toast.show('Achado criado com sucesso', 'success');
      this.saved = true;
      await this.router.navigate(['/achados']);
    } catch {
      this.saveError = 'Erro ao salvar achado';
    } finally {
      this.saving = false;
    }
  }

  async enviarManifestacao() {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Enviar para Manifestação', message: 'Enviar este achado para manifestação da unidade auditada? O prazo será de 5 dias úteis.', confirmText: 'Enviar', type: 'warning' } as ConfirmDialogData,
    });
    const confirmed = await firstValueFrom(ref.afterClosed());
    if (!confirmed) return;
    this.saving = true;
    try {
      await firstValueFrom(this.http.post(`${API}/achados/${this.id}/enviar-manifestacao`, { prazoDiasUteis: 5 }));
      this.toast.show('Enviado para manifestação', 'success');
      await this.load();
    } catch {
      this.toast.show('Erro ao enviar para manifestação', 'error');
    } finally {
      this.saving = false;
    }
  }

  async consolidar() {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Consolidar Achado', message: 'Confirmar consolidação deste achado? Após consolidado, não poderá ser alterado.', confirmText: 'Consolidar', type: 'warning' } as ConfirmDialogData,
    });
    const confirmed = await firstValueFrom(ref.afterClosed());
    if (!confirmed) return;
    this.saving = true;
    try {
      await firstValueFrom(this.http.post(`${API}/achados/${this.id}/consolidar`, {}));
      this.toast.show('Achado consolidado', 'success');
      await this.load();
    } catch {
      this.toast.show('Erro ao consolidar achado', 'error');
    } finally {
      this.saving = false;
    }
  }
}
