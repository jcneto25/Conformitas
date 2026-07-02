import { Component, Input, Output, EventEmitter, ViewChild, AfterContentInit, AfterViewInit, OnChanges, ContentChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource, MatTable, MatColumnDef } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { EmptyStateComponent } from './empty-state.component';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatSortModule, MatPaginatorModule,
    MatProgressSpinnerModule, MatButtonModule, MatIconModule, MatCardModule,
    EmptyStateComponent,
  ],
  template: `
    <mat-card class="mat-elevation-z0">
      <mat-card-content>
        <div class="overflow-x-auto">
          <table mat-table [dataSource]="dataSource" matSort class="w-full app-data-table">
            <ng-content></ng-content>
            <tr mat-header-row *matHeaderRowDef="displayedColumns; sticky: true" class="bg-gray-50"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns" class="transition-colors"></tr>
            <tr *matNoDataRow>
              <td [attr.colspan]="displayedColumns.length">
                @if (loading) {
                  <div class="flex justify-center py-12"><mat-spinner diameter="36" /></div>
                } @else if (error) {
                  <app-empty-state icon="error_outline" [title]="error" size="sm">
                    <button mat-button color="primary" (click)="retry.emit()" class="mt-2">Tentar novamente</button>
                  </app-empty-state>
                } @else {
                  <app-empty-state [icon]="emptyIcon" [title]="emptyMessage" [actionLabel]="emptyActionLabel" size="sm" (action)="emptyAction.emit()" />
                }
              </td>
            </tr>
          </table>
        </div>
        <mat-paginator
          [pageSizeOptions]="[10, 25, 50]"
          [pageSize]="10"
          showFirstLastButtons
          class="border-t border-divider" />
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    /* Zebra striping sutil + hover consistente (DESIGN_SYSTEM §5.1 / Epic C1) */
    .app-data-table .mat-mdc-row:nth-child(even) { background-color: rgba(26, 58, 92, 0.035); }
    .app-data-table .mat-mdc-row:hover { background-color: rgba(26, 58, 92, 0.07); }
    .app-data-table .mat-mdc-header-cell { font-weight: 600; }
  `],
})
export class DataTableComponent implements AfterContentInit, AfterViewInit, OnChanges {
  @Input() data: any[] = [];
  @Input() displayedColumns: string[] = [];
  @Input() loading = false;
  @Input() error = '';
  @Input() emptyMessage = 'Nenhum registro encontrado';
  @Input() emptyIcon = 'search_off';
  /** Rótulo do CTA exibido no estado vazio (ex: "Criar Novo"). Vazio = sem CTA. */
  @Input() emptyActionLabel = '';

  @Output() retry = new EventEmitter<void>();
  /** Emitido ao clicar no CTA do estado vazio. */
  @Output() emptyAction = new EventEmitter<void>();

  /** Column definitions projected by the consumer. MatTable can't auto-discover
   *  them across the component boundary, so we register them manually. */
  @ContentChildren(MatColumnDef, { descendants: true }) columnDefs!: QueryList<MatColumnDef>;

  /** static: true so the table is available in ngAfterContentInit, before the
   *  MatTable renders its rows. The table must therefore always be mounted. */
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = new MatTableDataSource<any>([]);

  ngAfterContentInit() {
    this.syncColumns();
    this.columnDefs.changes.subscribe(() => this.syncColumns());
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges() {
    this.dataSource.data = this.data;
  }

  private syncColumns(): void {
    this.columnDefs.forEach((cd) => this.table.addColumnDef(cd));
  }
}
