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
import { SavingsService } from '../savings.service';

@Component({
  selector: 'app-savings-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './savings-form.html',
  styleUrl: './savings-form.scss',
})
export class SavingsForm {
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
