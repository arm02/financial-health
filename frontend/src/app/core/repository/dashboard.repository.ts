import { Observable } from 'rxjs';
import {
  ChartSummaryResponse,
  DailySummaryResponse,
  DashboardSummaryResponse,
} from '../domain/entities/dashboard.entities';
import { ChartSummaryDTO, DailyChartSummaryDTO, DashboardSummaryDTO } from '../domain/dto/dashboard.dto';

export abstract class DashboardRepository {
  abstract GetDashboardSummary(params: DashboardSummaryDTO): Observable<DashboardSummaryResponse>;
  abstract GetChartSummary(params: ChartSummaryDTO): Observable<ChartSummaryResponse>;
  abstract GetDailyChartSummary(params: DailyChartSummaryDTO): Observable<DailySummaryResponse>;
}
