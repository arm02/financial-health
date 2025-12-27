import { inject, Injectable } from '@angular/core';
import { UseCase } from '../../base/usecase';
import { Observable } from 'rxjs';
import { DailyChartSummaryDTO } from '../../domain/dto/dashboard.dto';
import { DailySummaryResponse } from '../../domain/entities/dashboard.entities';
import { DashboardRepository } from '../../repository/dashboard.repository';

@Injectable({
  providedIn: 'root',
})
export class GetDailyChartSummaryUseCase implements UseCase<DailyChartSummaryDTO, DailySummaryResponse> {
  private repository = inject(DashboardRepository);

  execute(params: DailyChartSummaryDTO): Observable<DailySummaryResponse> {
    return this.repository.GetDailyChartSummary(params);
  }
}
