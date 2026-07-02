import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../shared/components/confirm-dialog.component';

@Component({
  selector: 'app-acao-coordenada-detail',
  standalone: true,
  imports: [
    MatCardModule, MatProgressSpinnerModule, MatIconModule, MatDialogModule,
    MatButtonModule, MatChipsModule, MatFormFieldModule,
    MatSelectModule, FormsModule, RouterModule, PageHeaderComponent, DatePipe,
  ],
  template: `
    <app-page-header title="Ação Coordenada">
      <button mat-stroked-button routerLink="/acoes-coordenadas">
        <mat-icon>arrow_back</mat-icon> Voltar
      </button>
    </app-page-header>

    @if (loading) {
      <div class="flex justify-center py-12"><mat-spinner diameter="40" /></div>
    } @else if (!acao) {
      <mat-card><mat-card-content class="p-8 text-center">Ação não encontrada</mat-card-content></mat-card>
    } @else {
      <div class="grid grid-cols-1 gap-6 max-w-3xl mx-auto">
        <mat-card class="shadow-sm rounded-xl">
          <mat-card-content class="p-6">
            <div class="flex items-center gap-2 mb-4">
              <span class="text-lg font-bold">{{ acao.codigoSiaud }}</span>
              <span class="px-2 py-0.5 rounded-full text-xs font-medium {{ statusColor(acao.status) }}">{{ acao.status }}</span>
            </div>
            <h2 class="text-2xl font-bold text-text-main mb-4">{{ acao.titulo }}</h2>

            @if (acao.descricao) {
              <p class="text-text-sec mb-4">{{ acao.descricao }}</p>
            }

            <div class="grid grid-cols-2 gap-4 text-sm">
              <div><span class="text-text-sec">Metodologia:</span> <span class="font-medium">{{ acao.metodologia || '—' }}</span></div>
              <div><span class="text-text-sec">Prazo Execução:</span> <span class="font-medium">{{ acao.prazoExecucao ? (acao.prazoExecucao | date:'shortDate') : '—' }}</span></div>
              <div><span class="text-text-sec">Data CPA:</span> <span class="font-medium">{{ acao.dataAprovacaoCpa ? (acao.dataAprovacaoCpa | date:'shortDate') : '—' }}</span></div>
              <div>
                <span class="text-text-sec">Reportado:</span>
                <mat-icon class="text-sm align-text-bottom ml-1">{{ acao.resultadoReportado ? 'check_circle text-green-600' : 'cancel text-gray-400' }}</mat-icon>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        @if (!acao.resultadoReportado) {
          <mat-card class="shadow-sm rounded-xl">
            <mat-card-header><mat-card-title>Reportar à CPA</mat-card-title></mat-card-header>
            <mat-card-content class="p-6">
              <p class="text-sm text-text-sec mb-4">Vincule a auditoria concluída para reportar o resultado ao SIAUD-Jud.</p>
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>ID da Auditoria</mat-label>
                <input matInput [(ngModel)]="auditoriaId" placeholder="uuid da auditoria" />
              </mat-form-field>
              <div class="flex gap-3 mt-4">
                <button mat-raised-button color="primary" (click)="reportar()" [disabled]="!auditoriaId || reportando">
                  {{ reportando ? 'Reportando...' : 'Reportar à CPA' }}
                </button>
              </div>
            </mat-card-content>
          </mat-card>
        }
      </div>
    }
  `,
})
export class AcaoCoordenadaDetailComponent implements OnInit {
  acao: any = null;
  loading = true;
  reportando = false;
  auditoriaId = '';

  constructor(
    private readonly api: ApiService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly toast: ToastService,
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    try { this.acao = await this.api.getAcaoCoordenada(id); }
    catch { this.acao = null; }
    finally { this.loading = false; }
  }

  async reportar() {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Reportar à CPA', message: 'Confirmar reporte do resultado ao SIAUD-Jud? Esta ação altera o status da ação coordenada.', confirmText: 'Reportar', type: 'warning' } as ConfirmDialogData,
    });
    const confirmed = await firstValueFrom(ref.afterClosed());
    if (!confirmed) return;
    this.reportando = true;
    try {
      await this.api.reportarResultadoCPA(this.acao.id, { auditoriaId: this.auditoriaId });
      this.acao.resultadoReportado = true;
      this.acao.status = 'REPORTADA';
      this.toast.show('Resultado reportado à CPA com sucesso', 'success');
    } catch {
      this.toast.show('Erro ao reportar resultado à CPA', 'error');
    } finally {
      this.reportando = false;
    }
  }

  statusColor(s: string) {
    const colors: Record<string, string> = {
      RECEBIDA: 'bg-blue-100 text-blue-800',
      EM_ANALISE: 'bg-yellow-100 text-yellow-800',
      EM_EXECUCAO: 'bg-purple-100 text-purple-800',
      CONCLUIDA: 'bg-green-100 text-green-800',
      REPORTADA: 'bg-teal-100 text-teal-800',
    };
    return colors[s] ?? 'bg-gray-100';
  }
}
