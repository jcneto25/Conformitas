import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-evidencia-upload',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatFormFieldModule, MatSelectModule,
    MatInputModule, MatButtonModule, MatProgressSpinnerModule,
  ],
  template: `
    <mat-card>
      <mat-card-content>
        <h3>Evidências</h3>

        @if (evidencias.length) {
          <div class="mb-4">
            @for (e of evidencias; track e.id || $index) {
              <div class="flex justify-between items-center py-2 border-b border-divider">
                <div>
                  <strong>{{ e.tipo }}</strong> — {{ e.descricao }}
                  <br /><small class="text-text-sec">Fonte: {{ e.fonte || 'N/A' }} | Arquivo: {{ e.arquivoPath }}</small>
                </div>
              </div>
            }
          </div>
        } @else {
          <p class="text-text-sec p-4">Nenhuma evidência registrada.</p>
        }

        <h4>Adicionar Evidência</h4>
        <form (ngSubmit)="adicionar()" class="flex gap-4 items-end flex-wrap">
          <mat-form-field appearance="outline" class="min-w-[180px]">
            <mat-label>Tipo</mat-label>
            <mat-select #tipoModel="ngModel" [(ngModel)]="form.tipo" name="tipo" required>
              <mat-option value="DOCUMENTO">Documento</mat-option>
              <mat-option value="PLANILHA">Planilha</mat-option>
              <mat-option value="EMAIL">E-mail</mat-option>
              <mat-option value="SISTEMA">Sistema</mat-option>
              <mat-option value="ENTREVISTA">Entrevista</mat-option>
              <mat-option value="OUTRO">Outro</mat-option>
            </mat-select>
            @if (tipoModel.invalid && tipoModel.touched) {
              <mat-error>Tipo obrigatório</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="min-w-[250px] flex-1">
            <mat-label>Descrição</mat-label>
            <input matInput #descModel="ngModel" [(ngModel)]="form.descricao" name="descricao" required />
            @if (descModel.invalid && descModel.touched) {
              <mat-error>Descrição obrigatória</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="min-w-[180px]">
            <mat-label>Fonte</mat-label>
            <input matInput [(ngModel)]="form.fonte" name="fonte" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="min-w-[200px]">
            <mat-label>Caminho do Arquivo</mat-label>
            <input matInput [(ngModel)]="form.arquivoPath" name="arquivoPath" required
                   placeholder="/evidencias/doc-001.pdf" />
          </mat-form-field>

          <button mat-raised-button color="primary" type="submit"
                  [disabled]="!form.tipo || !form.descricao || !form.arquivoPath || uploading">
            @if (uploading) {
              <mat-spinner diameter="16" class="inline-block mr-1" />
            }
            {{ uploading ? 'Enviando...' : 'Adicionar' }}
          </button>
        </form>

        @if (error) {
          <p class="text-critical mt-2">{{ error }}</p>
        }
      </mat-card-content>
    </mat-card>
  `,
})
export class EvidenciaUploadComponent {
  @Input() auditoriaId = '';
  @Input() evidencias: any[] = [];
  @Output() evidenciasChange = new EventEmitter<any[]>();

  form = { tipo: '', descricao: '', fonte: '', arquivoPath: '' };
  uploading = false;
  error = '';

  constructor(private readonly http: HttpClient) {}

  async adicionar() {
    if (!this.form.tipo || !this.form.descricao || !this.form.arquivoPath) return;
    this.error = '';
    this.uploading = true;
    try {
      const nova = await firstValueFrom(
        this.http.post(`${environment.apiUrl}/auditorias/${this.auditoriaId}/evidencias`, {
          tipo: this.form.tipo,
          descricao: this.form.descricao,
          fonte: this.form.fonte || undefined,
          arquivoPath: this.form.arquivoPath,
        }),
      );
      this.evidencias = [...this.evidencias, nova];
      this.evidenciasChange.emit(this.evidencias);
      this.form = { tipo: '', descricao: '', fonte: '', arquivoPath: '' };
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao adicionar evidência';
    } finally {
      this.uploading = false;
    }
  }
}
