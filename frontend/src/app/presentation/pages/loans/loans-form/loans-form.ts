import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-loans-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './loans-form.html',
  styleUrl: './loans-form.scss',
})
export class LoansForm {
  readonly dialogRef = inject(MatDialogRef<LoansForm>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly fb = inject(FormBuilder);

  loanForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(50)]],
    tenor: ['', [Validators.required, Validators.min(1)]],
    tenor_type: ['', Validators.required],
    amount: ['', [Validators.required, Validators.min(1000)]],
    start_date: ['', Validators.required],
  });

  onCloseDialog(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.loanForm.invalid) {
      this.loanForm.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.loanForm.value);
  }
}
