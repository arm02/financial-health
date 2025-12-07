import { Observable } from 'rxjs';
import {
  ChartSummaryResponse,
  DashboardSummaryResponse,
} from '../domain/entities/dashboard.entities';
import { ChartSummaryDTO, DashboardSummaryDTO } from '../domain/dto/dashboard.dto';

export abstract class DashboardRepository {
  abstract GetDashboardSummary(params: DashboardSummaryDTO): Observable<DashboardSummaryResponse>;
  abstract GetChartSummary(params: ChartSummaryDTO): Observable<ChartSummaryResponse>;
}
