import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TransactionService } from '../transactions.service';
import { DateService } from '../../../../core/helpers/services/date.service';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './transaction-form.html',
  styleUrl: './transaction-form.scss',
})
export class TransactionForm implements OnInit {
  readonly dialogRef = inject(MatDialogRef<TransactionForm>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly fb = inject(FormBuilder);
  private transactionService = inject(TransactionService);
  private dateService = inject(DateService);

  transactionForm: FormGroup = this.fb.group({
    title: [
      this.data.data.transaction?.title || '',
      [Validators.required, Validators.maxLength(50)],
    ],
    type: [this.data.data.transaction?.type || '', Validators.required],
    amount: [this.data.data.transaction?.amount || '', [Validators.required, Validators.min(1000)]],
    transaction_date: [this.data.data.transaction?.transaction_date || '', Validators.required],
  });

  transactionInputSimple = '';
  errorMessage = '';

  ngOnInit(): void {
    const trx = this.data.data?.transaction;
    if (trx) {
      const formatted = this.dateService.FormatISODate(trx.transaction_date);
      this.transactionForm.patchValue({
        ...trx,
        transaction_date: formatted,
      });
    }
  }

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
