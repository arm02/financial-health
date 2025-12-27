import { Observable } from 'rxjs';
import { FinancialHealthResponse } from '../domain/entities/analytics.entities';

export abstract class AnalyticsRepository {
  abstract GetFinancialHealth(): Observable<FinancialHealthResponse>;
}
