import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-investment-form',
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [DatePipe],
  templateUrl: './investment-form.component.html',
  styleUrls: ['./investment-form.component.css']
})
export class InvestmentFormComponent {
  investmentForm: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private dialogRef: MatDialogRef<InvestmentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = !!data; // Check if editing an existing investment
    this.investmentForm = this.fb.group({
      category: [data?.category || '', Validators.required],
      amount: [data?.amount || '', [Validators.required, Validators.min(1)]],
      date: [data?.date ? new Date(data.date) : '', Validators.required],
      growth: [data?.growth || '', Validators.required],
    });
  }

  save(): void {
    if (this.investmentForm.valid) {
      const formData = this.investmentForm.value;
      formData.date = this.datePipe.transform(formData.date, 'yyyy-MM-dd'); // ✅ Convert to ISO before saving
      formData.gain = formData.amount * (formData.growth / 100); // ✅ Auto-calculate gain
      this.dialogRef.close(formData);
    }
  }

  restrictInput(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', '/', '-'];
    const isNumber = /[0-9]/.test(event.key);
    if (!isNumber && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
  
}
