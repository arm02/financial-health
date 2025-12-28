import { inject, Injectable } from '@angular/core';
import { UseCase } from '../../base/usecase';
import { Observable } from 'rxjs';
import { FinancialHealthResponse } from '../../domain/entities/analytics.entities';
import { AnalyticsRepository } from '../../repository/analytics.repository';
import { AnalyticsFilterDTO } from '../../domain/dto/analytics.dto';

@Injectable({
  providedIn: 'root',
})
export class GetFinancialHealthUseCase implements UseCase<AnalyticsFilterDTO | undefined, FinancialHealthResponse> {
  private repository = inject(AnalyticsRepository);

  execute(params?: AnalyticsFilterDTO): Observable<FinancialHealthResponse> {
    return this.repository.GetFinancialHealth(params);
  }
}
