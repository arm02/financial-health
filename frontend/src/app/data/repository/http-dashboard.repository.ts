import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../core/helpers/services/http.service';
import { DashboardRepository } from '../../core/repository/dashboard.repository';
import {
  ChartSummaryResponse,
  DashboardSummaryResponse,
} from '../../core/domain/entities/dashboard.entities';
import { ChartSummaryDTO, DashboardSummaryDTO } from '../../core/domain/dto/dashboard.dto';

@Injectable({ providedIn: 'root' })
export class HttpDashboardRepository implements DashboardRepository {
  private http = inject(HttpService);

  GetDashboardSummary(params: DashboardSummaryDTO): Observable<DashboardSummaryResponse> {
    return this.http.Get(`dashboard/summary`, params);
  }

  GetChartSummary(params: ChartSummaryDTO): Observable<ChartSummaryResponse> {
    return this.http.Get(`dashboard/chart`, params);
  }
}
