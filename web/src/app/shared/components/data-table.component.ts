import { Component, Input, Output, EventEmitter, ContentChild, TemplateRef, ViewChild, AfterViewInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatSortModule, MatPaginatorModule,
    MatProgressSpinnerModule, MatButtonModule, MatIconModule, MatCardModule,
  ],
  template: `
    <mat-card>
      <mat-card-content class="p-0">
        @if (loading) {
          <div class="flex justify-center items-center py-12">
            <mat-spinner diameter="40" />
          </div>
        } @else if (error) {
          <div class="flex flex-col items-center py-12 text-critical gap-2">
            <mat-icon class="text-4xl">error_outline</mat-icon>
            <p class="text-sm m-0">{{ error }}</p>
            <button mat-button color="primary" (click)="retry.emit()">Tentar novamente</button>
          </div>
        } @else if (dataSource.data.length === 0) {
          <div class="flex flex-col items-center py-12 text-text-sec gap-2">
            <mat-icon class="text-4xl">search_off</mat-icon>
            <p class="text-sm m-0">{{ emptyMessage }}</p>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table mat-table [dataSource]="dataSource" matSort class="w-full">
              <ng-container [ngTemplateOutlet]="tableTemplate" />
              <tr mat-header-row *matHeaderRowDef="displayedColumns" class="bg-gray-50"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns" class="hover:bg-gray-50 transition-colors"></tr>
            </table>
            <mat-paginator
              [pageSizeOptions]="[10, 25, 50]"
              [pageSize]="10"
              showFirstLastButtons
              class="border-t border-divider" />
          </div>
        }
      </mat-card-content>
    </mat-card>
  `,
})
export class DataTableComponent implements AfterViewInit, OnChanges {
  @Input() data: any[] = [];
  @Input() displayedColumns: string[] = [];
  @Input() loading = false;
  @Input() error = '';
  @Input() emptyMessage = 'Nenhum registro encontrado';

  @Output() retry = new EventEmitter<void>();

  @ContentChild('tableBody', { static: false }) tableTemplate!: TemplateRef<any>;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = new MatTableDataSource<any>([]);

  ngAfterViewInit() {
    this.dataSource.data = this.data;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges() {
    this.dataSource.data = this.data;
  }
}
