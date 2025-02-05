import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-delete',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './confirm-delete.component.html',
  styleUrls: ['./confirm-delete.component.css']
})
export class ConfirmDeleteComponent {
  constructor(
    private dialogRef: MatDialogRef<ConfirmDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {}

  ngOnInit() {
    console.log('ConfirmDeleteComponent received ID:', this.data?.id); // ✅ Debugging
  }

  confirm(): void {
    console.log('Delete confirmed for ID:', this.data.id); // Debugging log
    this.dialogRef.close(true);
  }

  cancel(): void {
    console.log('Delete canceled'); // Debugging log
    this.dialogRef.close(false);
  }
}