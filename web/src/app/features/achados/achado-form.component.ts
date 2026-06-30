import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { ToastService } from '../../core/services/toast.service';
import { environment } from '../../../environments/environment';
import { PageHeaderComponent } from '../../shared/components/page-header.component';

const API = environment.apiUrl;

@Component({
  selector: 'app-achado-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatDividerModule,
    MatListModule, MatIconModule, MatProgressSpinnerModule,
    MatChipsModule, PageHeaderComponent,
  ],
  template: `
    @if (loadError) {
      <mat-card class="border border-red-50">
        <mat-card-content class="flex items-center gap-2 text-critical">
          <mat-icon>error_outline</mat-icon>
          <span>{{ loadError }}</span>
          <button mat-button color="primary" (click)="load()" class="ml-auto">Tentar novamente</button>
        </mat-card-content>
      </mat-card>
    } @else if (loading) {
      <div class="flex justify-center py-8">
        <mat-spinner diameter="40" />
      </div>
    } @else {
      <app-page-header [title]="isNew ? 'Novo Achado' : 'Achado ' + (achado?.codigo ?? '')" />
      @if (achado) {
        <div class="flex items-center gap-2 mb-4">
          <mat-chip [color]="statusChipColor(achado.status)" class="text-xs">{{ achado.status }}</mat-chip>
        </div>
      }

      @if (!isNew && achado?.prazoManifestacao) {
        <mat-card class="mb-4 bg-info-bg border border-info/20">
          <mat-card-content class="text-sm text-info">
            <mat-icon class="align-middle mr-1 text-[18px]">info</mat-icon>
            Prazo manifestação: {{ achado.prazoManifestacao | date:'short' }}
          </mat-card-content>
        </mat-card>
      }

      @if (isNew || editing) {
        <mat-card class="mb-4">
          <mat-card-content>
            <form (ngSubmit)="save()" #achadoForm="ngForm" class="flex flex-col gap-4">
              <mat-form-field appearance="outline">
                <mat-label>Tipo</mat-label>
                <mat-select [(ngModel)]="form.tipo" name="tipo" required #tipoModel="ngModel">
                  <mat-option value="CONFORMIDADE">Conformidade</mat-option>
                  <mat-option value="OPORTUNIDADE">Oportunidade de Melhoria</mat-option>
                  <mat-option value="IRREGULARIDADE">Irregularidade</mat-option>
                </mat-select>
                @if (tipoModel.invalid && tipoModel.touched) {
                  <mat-error>Obrigatório</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Situação Encontrada</mat-label>
                <textarea matInput [(ngModel)]="form.situacaoEncontrada" name="situacao" rows="2" required #sitModel="ngModel"></textarea>
                @if (sitModel.invalid && sitModel.touched) {
                  <mat-error>Obrigatório</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Critério</mat-label>
                <textarea matInput [(ngModel)]="form.criterio" name="criterio" rows="2" required #criterioModel="ngModel"></textarea>
                @if (criterioModel.invalid && criterioModel.touched) {
                  <mat-error>Obrigatório</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Causa</mat-label>
                <textarea matInput [(ngModel)]="form.causa" name="causa" rows="2" required></textarea>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Efeito</mat-label>
                <textarea matInput [(ngModel)]="form.efeito" name="efeito" rows="2" required></textarea>
              </mat-form-field>

              @if (saveError) {
                <div class="flex items-center gap-2 text-critical text-sm" role="alert">
                  <mat-icon class="text-[18px]">error_outline</mat-icon>
                  <span>{{ saveError }}</span>
                </div>
              }

              <div class="flex gap-2">
                <button mat-raised-button color="primary" type="submit" [disabled]="saving || achadoForm.invalid">
                  @if (saving) {
                    <mat-spinner diameter="18" class="inline-block mr-1" />
                  }
                  {{ isNew ? 'Criar Achado' : 'Salvar' }}
                </button>
                <button mat-button type="button" routerLink="/achados">Cancelar</button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
      }

      @if (!isNew && achado) {
        <mat-card>
          <mat-card-header><mat-card-title class="text-heading-md">Manifestações</mat-card-title></mat-card-header>
          <mat-card-content>
            @if (manifestacoes.length === 0) {
              <p class="text-text-sec text-sm">Nenhuma manifestação registrada.</p>
            } @else {
              <mat-list>
                @for (m of manifestacoes; track m.id) {
                  <mat-list-item>
                    <span matListItemTitle class="text-sm">{{ m.tipo }} — {{ m.dataManifestacao | date:'short' }}</span>
                    <span matListItemLine class="text-text-sec">{{ m.conteudo }}</span>
                  </mat-list-item>
                }
              </mat-list>
            }
          </mat-card-content>
        </mat-card>

        @if (achado.status === 'PRELIMINAR' || achado.status === 'EM_MANIFESTACAO') {
          <div class="flex gap-2 mt-4">
            @if (achado.status === 'PRELIMINAR') {
              <button mat-raised-button color="primary" (click)="enviarManifestacao()" [disabled]="saving">
                @if (saving) { <mat-spinner diameter="18" class="inline-block mr-1" /> }
                Enviar para Manifestação
              </button>
            }
            @if (achado.status === 'EM_MANIFESTACAO') {
              <button mat-raised-button color="accent" (click)="consolidar()" [disabled]="saving">
                @if (saving) { <mat-spinner diameter="18" class="inline-block mr-1" /> }
                Consolidar Achado
              </button>
            }
          </div>
        }
      }
    }
  `,
})
export class AchadoFormComponent implements OnInit {
  isNew = false;
  achado: any = null;
  manifestacoes: any[] = [];
  editing = false;
  loading = false;
  saving = false;
  loadError = '';
  saveError = '';
  form = { tipo: '', situacaoEncontrada: '', criterio: '', causa: '', efeito: '' };
  private id = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly http: HttpClient,
    private readonly toast: ToastService,
  ) {}

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.isNew = !this.id;
    this.editing = this.isNew;
    if (!this.isNew) await this.load();
  }

  async load() {
    this.loading = true;
    this.loadError = '';
    try {
      this.achado = await firstValueFrom(
        this.http.get<any>(`${API}/achados/${this.id}`),
      );
      this.manifestacoes = await firstValueFrom(
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
    this.saving = true;
    this.saveError = '';
    try {
      if (this.isNew) {
        await firstValueFrom(
          this.http.post(`${API}/achados`, {
            ...this.form,
            auditoriaId: '',
            autorId: '',
          }),
        );
        this.toast.show('Achado criado com sucesso', 'success');
      }
      await this.router.navigate(['/achados']);
    } catch {
      this.saveError = 'Erro ao salvar achado';
    } finally {
      this.saving = false;
    }
  }

  async enviarManifestacao() {
    this.saving = true;
    try {
      await firstValueFrom(
        this.http.post(`${API}/achados/${this.id}/enviar-manifestacao`, { prazoDias: 5 }),
      );
      this.toast.show('Enviado para manifestação', 'success');
      await this.load();
    } catch {
      this.toast.show('Erro ao enviar para manifestação', 'error');
    } finally {
      this.saving = false;
    }
  }

  async consolidar() {
    this.saving = true;
    try {
      await firstValueFrom(
        this.http.post(`${API}/achados/${this.id}/consolidar`, {}),
      );
      this.toast.show('Achado consolidado', 'success');
      await this.load();
    } catch {
      this.toast.show('Erro ao consolidar achado', 'error');
    } finally {
      this.saving = false;
    }
  }

  statusChipColor(s: string) {
    return s === 'PRELIMINAR' ? 'warn' : s === 'EM_MANIFESTACAO' ? 'primary' : 'accent';
  }
}
