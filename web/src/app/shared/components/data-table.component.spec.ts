import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DataTableComponent } from './data-table.component';

/** Host component that wraps DataTableComponent with projected column definitions. */
@Component({
  template: `
    <app-data-table
      [data]="data"
      [displayedColumns]="displayedColumns"
      [loading]="loading"
      [error]="error"
      [emptyMessage]="emptyMessage"
      [emptyActionLabel]="emptyActionLabel"
      (retry)="onRetry()"
      (emptyAction)="onEmptyAction()">
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Name</th>
        <td mat-cell *matCellDef="let row">{{ row.name }}</td>
      </ng-container>
      <ng-container matColumnDef="value">
        <th mat-header-cell *matHeaderCellDef>Value</th>
        <td mat-cell *matCellDef="let row">{{ row.value }}</td>
      </ng-container>
    </app-data-table>
  `,
  standalone: true,
  imports: [DataTableComponent, MatTableModule],
})
class TestHostComponent {
  data: any[] = [];
  displayedColumns = ['name', 'value'];
  loading = false;
  error = '';
  emptyMessage = 'Nenhum registro encontrado';
  emptyActionLabel = '';

  onRetry(): void {}
  onEmptyAction(): void {}
}

describe('DataTableComponent', () => {
  let hostComponent: TestHostComponent;
  let hostFixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestHostComponent,
        NoopAnimationsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();
  });

  it('should create the host component', () => {
    expect(hostComponent).toBeTruthy();
  });

  it('should render table with data rows when data is provided', () => {
    hostComponent.data = [
      { name: 'Auditoria 1', value: 100 },
      { name: 'Auditoria 2', value: 200 },
    ];
    hostFixture.detectChanges();
    const rows = hostFixture.debugElement.queryAll(By.css('tr.mat-mdc-row'));
    expect(rows.length).toBe(2);
  });

  it('should render header row', () => {
    hostComponent.data = [{ name: 'A', value: 1 }];
    hostFixture.detectChanges();
    const headerRows = hostFixture.debugElement.queryAll(By.css('tr.mat-mdc-header-row'));
    expect(headerRows.length).toBe(1);
  });

  it('should display no-data row when data is empty', () => {
    hostComponent.data = [];
    hostFixture.detectChanges();
    const noDataRow = hostFixture.debugElement.query(By.css('tr.mat-mdc-no-data-row'));
    expect(noDataRow).toBeTruthy();
  });

  it('should show spinner when loading with no data', () => {
    hostComponent.loading = true;
    hostComponent.data = [];
    hostFixture.detectChanges();
    const spinner = hostFixture.debugElement.query(By.css('mat-spinner'));
    expect(spinner).toBeTruthy();
  });

  it('should show error state when error is set', () => {
    hostComponent.error = 'Erro ao carregar dados';
    hostComponent.data = [];
    hostFixture.detectChanges();
    const emptyState = hostFixture.debugElement.query(By.css('app-empty-state'));
    expect(emptyState).toBeTruthy();
    expect(emptyState.nativeElement.textContent).toContain('Erro ao carregar dados');
  });

  it('should show retry button when error is set', () => {
    hostComponent.error = 'Erro ao carregar';
    hostComponent.data = [];
    hostFixture.detectChanges();
    const retryBtn = hostFixture.debugElement.query(By.css('app-empty-state button'));
    expect(retryBtn).toBeTruthy();
    expect(retryBtn.nativeElement.textContent.trim()).toContain('Tentar novamente');
  });

  it('should emit retry event when retry button is clicked', () => {
    spyOn(hostComponent, 'onRetry');
    hostComponent.error = 'Erro ao carregar';
    hostComponent.data = [];
    hostFixture.detectChanges();
    const retryBtn = hostFixture.debugElement.query(By.css('app-empty-state button'));
    retryBtn.nativeElement.click();
    expect(hostComponent.onRetry).toHaveBeenCalled();
  });

  it('should show empty state message when data is empty and no error', () => {
    hostComponent.emptyMessage = 'Nada aqui ainda';
    hostComponent.data = [];
    hostFixture.detectChanges();
    const emptyState = hostFixture.debugElement.query(By.css('app-empty-state'));
    expect(emptyState).toBeTruthy();
    expect(emptyState.nativeElement.textContent).toContain('Nada aqui ainda');
  });

  it('should show empty action button when emptyActionLabel is set', () => {
    hostComponent.emptyActionLabel = 'Criar Novo';
    hostComponent.data = [];
    hostFixture.detectChanges();
    const actionBtn = hostFixture.debugElement.query(By.css('app-empty-state button'));
    expect(actionBtn).toBeTruthy();
    expect(actionBtn.nativeElement.textContent.trim()).toContain('Criar Novo');
  });

  it('should emit emptyAction when empty action button is clicked', () => {
    spyOn(hostComponent, 'onEmptyAction');
    hostComponent.emptyActionLabel = 'Adicionar';
    hostComponent.data = [];
    hostFixture.detectChanges();
    const actionBtn = hostFixture.debugElement.query(By.css('app-empty-state button'));
    actionBtn.nativeElement.click();
    expect(hostComponent.onEmptyAction).toHaveBeenCalled();
  });

  it('should not show empty action button when label is empty', () => {
    hostComponent.emptyActionLabel = '';
    hostComponent.data = [];
    hostFixture.detectChanges();
    const emptyState = hostFixture.debugElement.query(By.css('app-empty-state'));
    expect(emptyState).toBeTruthy();
    const actionBtn = emptyState.query(By.css('button'));
    expect(actionBtn).toBeFalsy();
  });

  it('should update data source when data input changes', () => {
    const dataTable = hostFixture.debugElement.query(By.directive(DataTableComponent)).componentInstance;
    hostComponent.data = [{ name: 'Test', value: 42 }];
    hostFixture.detectChanges();
    expect(dataTable.dataSource.data.length).toBe(1);
    expect(dataTable.dataSource.data[0].name).toBe('Test');
  });
});