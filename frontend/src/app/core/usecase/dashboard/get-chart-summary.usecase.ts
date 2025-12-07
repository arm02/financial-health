import { inject, Injectable } from '@angular/core';
import { UseCase } from '../../base/usecase';
import { Observable } from 'rxjs';
import { ChartSummaryDTO } from '../../domain/dto/dashboard.dto';
import { ChartSummaryResponse } from '../../domain/entities/dashboard.entities';
import { DashboardRepository } from '../../repository/dashboard.repository';

@Injectable({
  providedIn: 'root',
})
export class GetChartSummaryUseCase implements UseCase<ChartSummaryDTO, ChartSummaryResponse> {
  private repository = inject(DashboardRepository);

  execute(params: ChartSummaryDTO): Observable<ChartSummaryResponse> {
    return this.repository.GetChartSummary(params);
  }
}
