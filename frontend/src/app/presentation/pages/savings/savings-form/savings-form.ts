import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CreateTransactionDTO } from '../../../../core/domain/dto/transaction.dto';
import { SavingsService } from '../savings.service';

@Component({
  selector: 'app-savings-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './savings-form.html',
  styleUrl: './savings-form.scss',
})
export class SavingsForm implements OnInit {
  readonly dialogRef = inject(MatDialogRef<SavingsForm>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly fb = inject(FormBuilder);
  private savingService = inject(SavingsService);

  transactionForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(50)]],
    amount: ['', [Validators.required, Validators.min(1000)]],
    transaction_date: ['', Validators.required],
  });

  transactionInputSimple = '';
  errorMessage = '';
  isEditMode = false;

  ngOnInit(): void {
    if (this.data?.data?.transaction) {
      this.isEditMode = true;
      const transaction = this.data.data.transaction;
      this.transactionForm.patchValue({
        title: transaction.title,
        amount: transaction.amount,
        transaction_date: transaction.transaction_date?.split('T')[0],
      });
    }
  }

  onCloseDialog(): void {
    this.dialogRef.close();
  }

  onSimpleCreate() {
    const convertQuery = this.savingService.TransformSimpleQuery(this.transactionInputSimple);
    if (convertQuery.errorMessage) {
      this.errorMessage = convertQuery.errorMessage;
      return;
    }
    this.errorMessage = '';
    this.dialogRef.close(convertQuery.data);
  }

  onSubmit() {
    if (this.transactionForm.invalid) {
      this.transactionForm.markAllAsTouched();
      return;
    }
    const data = this.transactionForm.value;
    data.type = 'SAVING';
    this.dialogRef.close(this.transactionForm.value);
  }
}
