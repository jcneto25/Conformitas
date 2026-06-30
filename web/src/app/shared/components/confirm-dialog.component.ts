import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title class="text-lg font-semibold m-0 px-6 pt-5">{{ data.title }}</h2>
    <mat-dialog-content class="text-sm text-text-sec px-6 py-4">
      {{ data.message }}
    </mat-dialog-content>
    <mat-dialog-actions align="end" class="px-6 pb-4 gap-2">
      <button mat-button mat-dialog-close>{{ data.cancelText || 'Cancelar' }}</button>
      <button
        mat-raised-button
        [color]="data.type === 'danger' ? 'warn' : 'primary'"
        [mat-dialog-close]="true">
        {{ data.confirmText || 'Confirmar' }}
      </button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData,
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
  ) {}
}
