import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ExpensesService } from '../expenses.service';

@Component({
  selector: 'app-expenses-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './expenses-form.html',
  styleUrl: './expenses-form.scss',
})
export class ExpensesForm implements OnInit {
  readonly dialogRef = inject(MatDialogRef<ExpensesForm>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly fb = inject(FormBuilder);
  private expensesService = inject(ExpensesService);

  expensesForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(50)]],
    type: ['', Validators.required],
    amount: ['', [Validators.required, Validators.min(1000)]],
  });

  expensesInputSimple = '';
  errorMessage = '';
  isEditMode = false;

  ngOnInit(): void {
    if (this.data?.data?.expenses) {
      this.isEditMode = true;
      const expenses = this.data.data.expenses;
      this.expensesForm.patchValue({
        title: expenses.title,
        type: expenses.type,
        amount: expenses.amount,
      });
    }
  }

  onCloseDialog(): void {
    this.dialogRef.close();
  }

  onSimpleCreate() {
    const convertQuery = this.expensesService.TransformSimpleQuery(this.expensesInputSimple);
    if (convertQuery.errorMessage) {
      this.errorMessage = convertQuery.errorMessage;
      return;
    }
    this.errorMessage = '';
    this.dialogRef.close(convertQuery.data);
  }

  onSubmit() {
    if (this.expensesForm.invalid) {
      this.expensesForm.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.expensesForm.value);
  }
}
