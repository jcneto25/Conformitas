import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';

const API = 'http://localhost:3001/api/v1';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <h1>{{ isNew ? 'Novo Usuário' : 'Editar Usuário' }}</h1>

    <div style="background: #fff; border-radius: 8px; padding: 2rem; max-width: 600px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <form (ngSubmit)="save()" style="display: flex; flex-direction: column; gap: 1rem;">
        <div>
          <label style="display: block; margin-bottom: 0.25rem; font-size: 0.85rem; font-weight: 500;">Nome</label>
          <input type="text" [(ngModel)]="form.nome" name="nome" required
                 style="width: 100%; padding: 0.6rem; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; font-size: 1rem;" />
        </div>

        <div>
          <label style="display: block; margin-bottom: 0.25rem; font-size: 0.85rem; font-weight: 500;">Email</label>
          <input type="email" [(ngModel)]="form.email" name="email" required
                 style="width: 100%; padding: 0.6rem; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; font-size: 1rem;" />
        </div>

        <div>
          <label style="display: block; margin-bottom: 0.25rem; font-size: 0.85rem; font-weight: 500;">Matrícula</label>
          <input type="text" [(ngModel)]="form.matricula" name="matricula" required
                 style="width: 100%; padding: 0.6rem; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; font-size: 1rem;" />
        </div>

        <div>
          <label style="display: block; margin-bottom: 0.25rem; font-size: 0.85rem; font-weight: 500;">Cargo</label>
          <input type="text" [(ngModel)]="form.cargo" name="cargo"
                 style="width: 100%; padding: 0.6rem; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; font-size: 1rem;" />
        </div>

        <div>
          <label style="display: block; margin-bottom: 0.25rem; font-size: 0.85rem; font-weight: 500;">Unidade</label>
          <input type="text" [(ngModel)]="form.unidade" name="unidade"
                 style="width: 100%; padding: 0.6rem; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; font-size: 1rem;" />
        </div>

        <div *ngIf="isNew">
          <label style="display: block; margin-bottom: 0.25rem; font-size: 0.85rem; font-weight: 500;">Senha</label>
          <input type="password" [(ngModel)]="form.senha" name="senha" [required]="isNew"
                 style="width: 100%; padding: 0.6rem; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; font-size: 1rem;" />
        </div>

        <p *ngIf="error" style="color: #c62828; font-size: 0.85rem; margin: 0; text-align: center;">{{ error }}</p>
        <p *ngIf="success" style="color: #2e7d32; font-size: 0.85rem; margin: 0; text-align: center;">{{ success }}</p>

        <div style="display: flex; gap: 1rem;">
          <button type="submit"
                  style="flex: 1; padding: 0.75rem; background: #1a1a2e; color: #fff; border: none; border-radius: 4px; font-size: 1rem; font-weight: 600; cursor: pointer;">
            {{ isNew ? 'Criar' : 'Salvar' }}
          </button>
          <button type="button" routerLink="/usuarios"
                  style="padding: 0.75rem 1.5rem; background: #eee; color: #333; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem; cursor: pointer;">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  `,
})
export class UsuarioFormComponent implements OnInit {
  isNew = true;
  error = '';
  success = '';
  form = { nome: '', email: '', matricula: '', cargo: '', unidade: '', senha: '' };
  private id = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly http: HttpClient,
  ) {}

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.isNew = !this.id;

    if (!this.isNew) {
      await this.load();
    }
  }

  async load() {
    try {
      const user = await firstValueFrom(
        this.http.get<any>(`${API}/usuarios/${this.id}`),
      );
      this.form = {
        nome: user.nome || '',
        email: user.email || '',
        matricula: user.matricula || '',
        cargo: user.cargo || '',
        unidade: user.unidade || '',
        senha: '',
      };
    } catch (err: any) {
      this.error = 'Erro ao carregar usuário';
    }
  }

  async save() {
    if (!this.form.nome || !this.form.email || !this.form.matricula) return;
    if (this.isNew && !this.form.senha) return;
    this.error = '';
    this.success = '';

    try {
      if (this.isNew) {
        await firstValueFrom(
          this.http.post(`${API}/usuarios`, this.form),
        );
        this.success = 'Usuário criado com sucesso';
        this.router.navigate(['/usuarios']);
      } else {
        await firstValueFrom(
          this.http.patch(`${API}/usuarios/${this.id}`, this.form),
        );
        this.success = 'Usuário atualizado com sucesso';
      }
    } catch (err: any) {
      this.error = err?.error?.message || 'Erro ao salvar usuário';
    }
  }
}
