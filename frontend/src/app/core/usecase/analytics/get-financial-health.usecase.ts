import { inject, Injectable } from '@angular/core';
import { UseCase } from '../../base/usecase';
import { Observable } from 'rxjs';
import { FinancialHealthResponse } from '../../domain/entities/analytics.entities';
import { AnalyticsRepository } from '../../repository/analytics.repository';

@Injectable({
  providedIn: 'root',
})
export class GetFinancialHealthUseCase implements UseCase<void, FinancialHealthResponse> {
  private repository = inject(AnalyticsRepository);

  execute(): Observable<FinancialHealthResponse> {
    return this.repository.GetFinancialHealth();
  }
}
