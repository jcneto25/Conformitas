import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, NgForm } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { ValidationService } from '../../shared/services/validation.service';

@Component({
  selector: 'app-integracao-form',
  standalone: true,
  imports: [
    MatCardModule, MatProgressSpinnerModule, MatIconModule,
    MatButtonModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, FormsModule, RouterModule, PageHeaderComponent,
  ],
  template: `
    <app-page-header [title]="editando ? 'Editar Integração' : 'Nova Integração'">
      <button mat-stroked-button routerLink="/integracoes">
        <mat-icon>arrow_back</mat-icon> Voltar
      </button>
    </app-page-header>

    @if (loading) {
      <div class="flex justify-center py-12"><mat-spinner diameter="40" /></div>
    } @else {
      <mat-card class="shadow-sm rounded-xl max-w-2xl mx-auto">
        <mat-card-content class="p-6">
          <form #intForm="ngForm" (ngSubmit)="salvar()" class="contents">
            <div class="grid grid-cols-2 gap-4">
              <mat-form-field appearance="outline" class="col-span-2">
                <mat-label>Nome</mat-label>
                <input matInput #nomeModel="ngModel" name="nome" [(ngModel)]="form.nome" placeholder="Ouvidoria TJCE" required />
                @if (nomeModel.invalid && nomeModel.touched) {
                  <mat-error>{{ validation.required('Nome') }}</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Sistema Externo</mat-label>
                <input matInput #sistemaModel="ngModel" name="sistemaExterno" [(ngModel)]="form.sistemaExterno" placeholder="Ouvidoria" required />
                @if (sistemaModel.invalid && sistemaModel.touched) {
                  <mat-error>{{ validation.required('Sistema externo') }}</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Protocolo</mat-label>
                <mat-select #protocoloModel="ngModel" name="protocolo" [(ngModel)]="form.protocolo" required>
                  @for (p of ['REST', 'SOAP', 'GRAPHQL', 'FILE']; track p) {
                    <mat-option [value]="p">{{ p }}</mat-option>
                  }
                </mat-select>
                @if (protocoloModel.invalid && protocoloModel.touched) {
                  <mat-error>{{ validation.required('Protocolo') }}</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Tipo</mat-label>
                <mat-select #tipoModel="ngModel" name="tipo" [(ngModel)]="form.tipo" required>
                  @for (t of ['ENTRADA', 'SAIDA', 'BIDIRECIONAL']; track t) {
                    <mat-option [value]="t">{{ t }}</mat-option>
                  }
                </mat-select>
                @if (tipoModel.invalid && tipoModel.touched) {
                  <mat-error>{{ validation.required('Tipo') }}</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Status</mat-label>
                <mat-select #statusModel="ngModel" name="status" [(ngModel)]="form.status" required>
                  @for (s of ['ATIVA', 'INATIVA', 'EM_CONFIGURACAO', 'ERRO']; track s) {
                    <mat-option [value]="s">{{ s }}</mat-option>
                  }
                </mat-select>
                @if (statusModel.invalid && statusModel.touched) {
                  <mat-error>{{ validation.required('Status') }}</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="col-span-2">
                <mat-label>Endpoint</mat-label>
                <input matInput name="endpoint" [(ngModel)]="form.endpoint" placeholder="https://..." />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Autenticação</mat-label>
                <input matInput name="metodoAutenticacao" [(ngModel)]="form.metodoAutenticacao" placeholder="API_KEY" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Frequência</mat-label>
                <input matInput name="frequencia" [(ngModel)]="form.frequencia" placeholder="DIARIA" />
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-stroked-button type="button" routerLink="/integracoes">Cancelar</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="salvando">
                {{ salvando ? 'Salvando...' : 'Salvar' }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    }
  `,
})
export class IntegracaoFormComponent implements OnInit {
  editando = false;
  loading = false;
  salvando = false;
  form: any = { nome: '', sistemaExterno: '', tipo: 'ENTRADA', protocolo: 'REST', endpoint: '', metodoAutenticacao: '', frequencia: '', status: 'EM_CONFIGURACAO' };
  /** Referência ao ngForm para detecção de alterações não salvas (Epic D4). */
  @ViewChild('intForm') formRef?: NgForm;
  private saved = false;

  /** Guard de saída: bloqueia navegação se o formulário estiver "dirty" e não salvo. */
  canDeactivate(): boolean {
    if (this.saved) return true;
    return !this.formRef?.dirty;
  }

  constructor(
    private readonly api: ApiService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    public readonly validation: ValidationService,
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editando = true;
      this.loading = true;
      try {
        const data = await this.api.getIntegracao(id);
        if (data) this.form = { ...data };
      } catch { /* fallback */ }
      finally { this.loading = false; }
    }
  }

  async salvar() {
    this.salvando = true;
    try {
      if (this.editando) {
        const id = this.route.snapshot.paramMap.get('id')!;
        await this.api.atualizarIntegracao(id, this.form);
      } else {
        await this.api.criarIntegracao(this.form);
      }
      this.saved = true;
      this.router.navigate(['/integracoes']);
    } catch {
      alert('Erro ao salvar integração');
    } finally {
      this.salvando = false;
    }
  }
}
