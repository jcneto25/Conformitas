import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatColumnDef, MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DataTableComponent } from './data-table.component';

@Component({
  standalone: true,
  imports: [
    DataTableComponent,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatColumnDef,
  ],
  template: `
    <app-data-table
      [data]="data"
      [displayedColumns]="columns"
      [loading]="loading"
      [error]="error"
      [emptyMessage]="emptyMessage"
      [emptyActionLabel]="emptyActionLabel"
      (retry)="onRetry()"
      (emptyAction)="onEmptyAction()">
      <ng-container matColumnDef="id">
        <th mat-header-cell *matHeaderCellDef>ID</th>
        <td mat-cell *matCellDef="let row">{{ row.id }}</td>
      </ng-container>
      <ng-container matColumnDef="nome">
        <th mat-header-cell *matHeaderCellDef>Nome</th>
        <td mat-cell *matCellDef="let row">{{ row.nome }}</td>
      </ng-container>
    </app-data-table>
  `,
})
class TestHostComponent {
  data: any[] = [];
  columns: string[] = ['id', 'nome'];
  loading = false;
  error = '';
  emptyMessage = 'Nenhum registro';
  emptyActionLabel = '';
  retried = false;
  emptyClicked = false;

  onRetry() { this.retried = true; }
  onEmptyAction() { this.emptyClicked = true; }
}

describe('DataTableComponent', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, NoopAnimationsModule],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    host = hostFixture.componentInstance;
  });

  it('should display empty state when data is empty', () => {
    host.data = [];
    hostFixture.detectChanges();

    const emptyEl = hostFixture.debugElement.query(By.css('app-empty-state'));
    expect(emptyEl).not.toBeNull();
  });

  it('should show loading spinner when loading is true', () => {
    host.loading = true;
    hostFixture.detectChanges();

    const spinner = hostFixture.debugElement.query(By.css('mat-spinner'));
    expect(spinner).not.toBeNull();
  });

  it('should show error with retry button when error is set', () => {
    host.error = 'Falha ao carregar dados';
    hostFixture.detectChanges();

    const el = hostFixture.debugElement.nativeElement;
    expect(el.textContent).toContain('Falha ao carregar dados');
    expect(el.textContent).toContain('Tentar novamente');
  });

  it('should emit retry event on retry button click', () => {
    host.error = 'Falha ao carregar dados';
    hostFixture.detectChanges();

    const btn = hostFixture.debugElement.query(By.css('button'));
    btn.nativeElement.click();

    expect(host.retried).toBeTrue();
  });

  it('should emit emptyAction on CTA click in empty state', () => {
    host.emptyActionLabel = 'Criar Novo';
    host.data = [];
    hostFixture.detectChanges();

    const btn = hostFixture.debugElement.query(By.css('button'));
    btn.nativeElement.click();

    expect(host.emptyClicked).toBeTrue();
  });

  it('should render mat-paginator', () => {
    hostFixture.detectChanges();

    const paginator = hostFixture.debugElement.query(By.css('mat-paginator'));
    expect(paginator).not.toBeNull();
  });
});
