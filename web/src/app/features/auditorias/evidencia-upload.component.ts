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
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../../../environments/environment';
import { ValidationService } from '../../shared/services/validation.service';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';

@Component({
  selector: 'app-evidencia-upload',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatFormFieldModule, MatSelectModule,
    MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, EmptyStateComponent,
  ],
  template: `
    <mat-card class="border-t-4 border-primary shadow-md rounded-xl overflow-hidden">
      <mat-card-header class="bg-slate-50/50 px-6 py-4 border-b border-gray-100">
        <mat-card-title class="text-lg font-semibold text-text-main flex items-center gap-2">
          <mat-icon class="text-primary">attach_file</mat-icon>
          Evidências
        </mat-card-title>
        <mat-card-subtitle class="text-xs text-text-sec">Documentos e fontes que embasam a auditoria.</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content class="p-6">
        @if (evidencias.length) {
          <div class="mb-6">
            @for (e of evidencias; track e.id || $index) {
              <div class="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                <div class="flex items-start gap-3">
                  <mat-icon class="text-primary text-[20px] mt-0.5">description</mat-icon>
                  <div>
                    <span class="text-text-main font-medium">{{ e.tipo }}</span>
                    <span class="text-text-sec"> — {{ e.descricao }}</span>
                    <br /><small class="text-text-sec">Fonte: {{ e.fonte || 'N/A' }} | Arquivo: {{ e.arquivoPath }}</small>
                  </div>
                </div>
              </div>
            }
          </div>
        } @else {
          <app-empty-state icon="inbox" title="Nenhuma evidência registrada" description="Adicione evidências para fundamentar os achados de auditoria." size="sm" />
        }

        <h4 class="text-sm font-semibold text-text-main mb-3 flex items-center gap-2">
          <mat-icon class="text-[18px] text-primary">add</mat-icon>
          Adicionar Evidência
        </h4>
        <form (ngSubmit)="adicionar()" class="flex flex-col gap-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-1">
            <mat-form-field appearance="outline">
              <mat-label>Tipo</mat-label>
              <mat-select #tipoModel="ngModel" [(ngModel)]="form.tipo" name="tipo" required>
                <mat-option value="DOCUMENTO">Documento</mat-option>
                <mat-option value="PLANILHA">Planilha</mat-option>
                <mat-option value="IMAGEM">Imagem</mat-option>
                <mat-option value="EMAIL">E-mail</mat-option>
                <mat-option value="SISTEMA">Sistema</mat-option>
                <mat-option value="ENTREVISTA">Entrevista</mat-option>
                <mat-option value="OUTRO">Outro</mat-option>
              </mat-select>
              @if (tipoModel.invalid && tipoModel.touched) {
                <mat-error>{{ validation.required('Tipo') }}</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="md:col-span-2">
              <mat-label>Descrição</mat-label>
              <input matInput #descModel="ngModel" [(ngModel)]="form.descricao" name="descricao" required />
              @if (descModel.invalid && descModel.touched) {
                <mat-error>{{ validation.required('Descrição') }}</mat-error>
              }
            </mat-form-field>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-1">
            <mat-form-field appearance="outline">
              <mat-label>Fonte</mat-label>
              <input matInput [(ngModel)]="form.fonte" name="fonte" />
            </mat-form-field>

            <mat-form-field appearance="outline" class="md:col-span-2">
              <mat-label>Arquivo (até 25MB)</mat-label>
              <input
                matInput
                type="file"
                name="arquivo"
                #arquivoInput="ngModel"
                (change)="onFileChange($event)"
                required
                placeholder="PDF, DOC(X), XLS(X), JPG, PNG, TIFF, ZIP"
              />
              @if (arquivoInput.invalid && arquivoInput.touched) {
                <mat-error>{{ validation.required('Arquivo') }}</mat-error>
              }
            </mat-form-field>
          </div>

          <button mat-raised-button color="primary" type="submit"
                  [disabled]="!form.tipo || !form.descricao || !file || uploading"
                  class="flex items-center gap-2 self-start min-w-[160px]">
            @if (uploading) {
              <mat-spinner diameter="16" class="inline-block mr-1" />
            }
            <mat-icon>cloud_upload</mat-icon>
            {{ uploading ? 'Enviando...' : 'Adicionar' }}
          </button>
        </form>

        @if (error) {
          <div class="flex items-center gap-2 text-red-600 text-sm p-3 bg-red-50 rounded-lg border border-red-100 mt-3" role="alert">
            <mat-icon class="text-[18px]">error_outline</mat-icon>
            <span>{{ error }}</span>
          </div>
        }
      </mat-card-content>
    </mat-card>
  `,
})
export class EvidenciaUploadComponent {
  @Input() auditoriaId = '';
  @Input() evidencias: any[] = [];
  @Output() evidenciasChange = new EventEmitter<any[]>();

  form = { tipo: '', descricao: '', fonte: '' };
  file: File | null = null;
  uploading = false;
  error = '';

  constructor(
    private readonly http: HttpClient,
    public readonly validation: ValidationService,
  ) {}

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.file = input.files?.length ? input.files[0] : null;
  }

  async adicionar() {
    if (!this.form.tipo || !this.form.descricao || !this.file) return;
    this.error = '';
    this.uploading = true;
    try {
      const formData = new FormData();
      formData.append('arquivo', this.file, this.file.name);
      formData.append('tipo', this.form.tipo);
      formData.append('descricao', this.form.descricao);
      if (this.form.fonte) formData.append('fonte', this.form.fonte);

      const nova = await firstValueFrom(
        this.http.post<any>(`${environment.apiUrl}/auditorias/${this.auditoriaId}/evidencias`, formData),
      );
      this.evidencias = [...this.evidencias, nova];
      this.evidenciasChange.emit(this.evidencias);
      this.form = { tipo: '', descricao: '', fonte: '' };
      this.file = null;
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao adicionar evidência';
    } finally {
      this.uploading = false;
    }
  }
}