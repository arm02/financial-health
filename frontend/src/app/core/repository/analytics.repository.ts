import { Observable } from 'rxjs';
import { FinancialHealthResponse } from '../domain/entities/analytics.entities';
import { AnalyticsFilterDTO } from '../domain/dto/analytics.dto';

export abstract class AnalyticsRepository {
  abstract GetFinancialHealth(params?: AnalyticsFilterDTO): Observable<FinancialHealthResponse>;
}
