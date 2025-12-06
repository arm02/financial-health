import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CreateTransactionDTO } from '../../../../core/domain/dto/transaction.dto';
import { TransactionService } from '../transactions.service';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './transaction-form.html',
  styleUrl: './transaction-form.scss',
})
export class TransactionForm {
  readonly dialogRef = inject(MatDialogRef<TransactionForm>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly fb = inject(FormBuilder);
  private transactionService = inject(TransactionService);

  transactionForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(50)]],
    type: ['', Validators.required],
    amount: ['', [Validators.required, Validators.min(1000)]],
    transaction_date: ['', Validators.required],
  });

  transactionInputSimple = '';
  errorMessage = '';

  onCloseDialog(): void {
    this.dialogRef.close();
  }

  onSimpleCreate() {
    const convertQuery = this.transactionService.TransformSimpleQuery(this.transactionInputSimple);
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
    this.dialogRef.close(this.transactionForm.value);
  }
}
