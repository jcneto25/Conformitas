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

const API = 'http://localhost:3001/api/v1';

@Component({
  selector: 'app-evidencia-upload',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatFormFieldModule, MatSelectModule,
    MatInputModule, MatButtonModule,
  ],
  template: `
    <mat-card>
      <mat-card-content>
        <h3>Evidências</h3>

        <!-- Lista de evidências -->
        <div *ngIf="evidencias.length; else semEvidencias" style="margin-bottom: 1rem;">
          <div *ngFor="let e of evidencias"
               style="display: flex; justify-content: space-between; align-items: center;
                      padding: 0.5rem 0; border-bottom: 1px solid #eee;">
            <div>
              <strong>{{ e.tipo }}</strong> — {{ e.descricao }}
              <br /><small style="color: #888;">Fonte: {{ e.fonte || 'N/A' }} | Arquivo: {{ e.arquivoPath }}</small>
            </div>
          </div>
        </div>
        <ng-template #semEvidencias>
          <p style="color: #999; padding: 1rem;">Nenhuma evidência registrada.</p>
        </ng-template>

        <!-- Form upload -->
        <h4>Adicionar Evidência</h4>
        <form (ngSubmit)="adicionar()" style="display: flex; gap: 1rem; align-items: flex-end; flex-wrap: wrap;">
          <mat-form-field appearance="outline" style="min-width: 180px;">
            <mat-label>Tipo</mat-label>
            <mat-select [(ngModel)]="form.tipo" name="tipo" required>
              <mat-option value="DOCUMENTO">Documento</mat-option>
              <mat-option value="PLANILHA">Planilha</mat-option>
              <mat-option value="EMAIL">E-mail</mat-option>
              <mat-option value="SISTEMA">Sistema</mat-option>
              <mat-option value="ENTREVISTA">Entrevista</mat-option>
              <mat-option value="OUTRO">Outro</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" style="min-width: 250px; flex: 1;">
            <mat-label>Descrição</mat-label>
            <input matInput [(ngModel)]="form.descricao" name="descricao" required />
          </mat-form-field>

          <mat-form-field appearance="outline" style="min-width: 180px;">
            <mat-label>Fonte</mat-label>
            <input matInput [(ngModel)]="form.fonte" name="fonte" />
          </mat-form-field>

          <mat-form-field appearance="outline" style="min-width: 200px;">
            <mat-label>Caminho do Arquivo</mat-label>
            <input matInput [(ngModel)]="form.arquivoPath" name="arquivoPath" required
                   placeholder="/evidencias/doc-001.pdf" />
          </mat-form-field>

          <button mat-raised-button color="primary" type="submit"
                  [disabled]="!form.tipo || !form.descricao || !form.arquivoPath || uploading">
            {{ uploading ? 'Enviando...' : 'Adicionar' }}
          </button>
        </form>

        <p *ngIf="error" style="color: #c62828; margin-top: 0.5rem;">{{ error }}</p>
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
        this.http.post(`${API}/auditorias/${this.auditoriaId}/evidencias`, {
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
