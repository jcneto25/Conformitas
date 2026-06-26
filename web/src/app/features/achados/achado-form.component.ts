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

const API = 'http://localhost:3001/api/v1';

@Component({
  selector: 'app-achado-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatDividerModule,
    MatListModule, MatIconModule,
  ],
  template: `
    <h1>{{ isNew ? 'Novo Achado' : 'Achado ' + achado?.codigo }}</h1>

    <mat-card *ngIf="!isNew && achado" style="margin-bottom: 1rem;">
      <mat-card-content>
        <p><strong>Status:</strong> {{ achado.status }}</p>
        <p *ngIf="achado.prazoManifestacao"><strong>Prazo manifestação:</strong> {{ achado.prazoManifestacao | date }}</p>
      </mat-card-content>
    </mat-card>

    <!-- Formulário de edição/criação -->
    <mat-card *ngIf="isNew || editing">
      <mat-card-content>
        <form (ngSubmit)="save()" style="display: flex; flex-direction: column; gap: 1rem;">
          <mat-form-field appearance="outline">
            <mat-label>Tipo</mat-label>
            <mat-select [(ngModel)]="form.tipo" name="tipo" required>
              <mat-option value="CONFORMIDADE">Conformidade</mat-option>
              <mat-option value="OPORTUNIDADE">Oportunidade de Melhoria</mat-option>
              <mat-option value="IRREGULARIDADE">Irregularidade</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Situação Encontrada</mat-label>
            <textarea matInput [(ngModel)]="form.situacaoEncontrada" name="situacao" rows="2" required></textarea>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Critério</mat-label>
            <textarea matInput [(ngModel)]="form.criterio" name="criterio" rows="2" required></textarea>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Causa</mat-label>
            <textarea matInput [(ngModel)]="form.causa" name="causa" rows="2" required></textarea>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Efeito</mat-label>
            <textarea matInput [(ngModel)]="form.efeito" name="efeito" rows="2" required></textarea>
          </mat-form-field>

          <button mat-raised-button color="primary" type="submit">
            {{ isNew ? 'Criar Achado' : 'Salvar' }}
          </button>
        </form>
      </mat-card-content>
    </mat-card>

    <!-- Workflow / Manifestações -->
    <mat-card *ngIf="!isNew && achado" style="margin-top: 1rem;">
      <mat-card-header><mat-card-title>Manifestações</mat-card-title></mat-card-header>
      <mat-card-content>
        <mat-list>
          <mat-list-item *ngFor="let m of manifestacoes">
            <span matListItemTitle>{{ m.tipo }} — {{ m.dataManifestacao | date:'short' }}</span>
            <span matListItemLine>{{ m.conteudo }}</span>
          </mat-list-item>
        </mat-list>
        <p *ngIf="manifestacoes.length === 0" style="color: #888;">Nenhuma manifestação registrada.</p>
      </mat-card-content>
    </mat-card>

    <!-- Ações de workflow -->
    <div *ngIf="!isNew && achado" style="display: flex; gap: 1rem; margin-top: 1rem;">
      <button *ngIf="achado.status === 'PRELIMINAR'" mat-raised-button color="primary"
              (click)="enviarManifestacao()">
        Enviar para Manifestação
      </button>
      <button *ngIf="achado.status === 'EM_MANIFESTACAO'" mat-raised-button color="accent"
              (click)="consolidar()">
        Consolidar Achado
      </button>
    </div>
  `,
})
export class AchadoFormComponent implements OnInit {
  isNew = false;
  achado: any = null;
  manifestacoes: any[] = [];
  editing = false;
  form = { tipo: '', situacaoEncontrada: '', criterio: '', causa: '', efeito: '' };
  private id = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly http: HttpClient,
  ) {}

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.isNew = !this.id;
    this.editing = this.isNew;

    if (!this.isNew) {
      await this.load();
    }
  }

  async load() {
    this.achado = await firstValueFrom(
      this.http.get<any>(`${API}/achados/${this.id}`),
    );
    this.manifestacoes = await firstValueFrom(
      this.http.get<any[]>(`${API}/achados/${this.id}/manifestacoes`),
    );
  }

  async save() {
    if (this.isNew) {
      await firstValueFrom(
        this.http.post(`${API}/achados`, {
          ...this.form,
          auditoriaId: '', // será preenchido pelo contexto
          autorId: '',
        }),
      );
    }
    this.router.navigate(['/achados']);
  }

  async enviarManifestacao() {
    await firstValueFrom(
      this.http.post(`${API}/achados/${this.id}/enviar-manifestacao`, { prazoDias: 5 }),
    );
    await this.load();
  }

  async consolidar() {
    await firstValueFrom(
      this.http.post(`${API}/achados/${this.id}/consolidar`, {}),
    );
    await this.load();
  }
}
