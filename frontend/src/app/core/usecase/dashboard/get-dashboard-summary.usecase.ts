import { inject, Injectable } from '@angular/core';
import { UseCase } from '../../base/usecase';
import { Observable } from 'rxjs';
import { DashboardSummaryDTO } from '../../domain/dto/dashboard.dto';
import { DashboardSummaryResponse } from '../../domain/entities/dashboard.entities';
import { DashboardRepository } from '../../repository/dashboard.repository';

@Injectable({
  providedIn: 'root',
})
export class GetDashboarSummaryUseCase
  implements UseCase<DashboardSummaryDTO, DashboardSummaryResponse>
{
  private repository = inject(DashboardRepository);

  execute(params: DashboardSummaryDTO): Observable<DashboardSummaryResponse> {
    return this.repository.GetDashboardSummary(params);
  }
}
