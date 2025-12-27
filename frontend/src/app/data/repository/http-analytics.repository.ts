import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../core/helpers/services/http.service';
import { AnalyticsRepository } from '../../core/repository/analytics.repository';
import { FinancialHealthResponse } from '../../core/domain/entities/analytics.entities';

@Injectable({ providedIn: 'root' })
export class HttpAnalyticsRepository implements AnalyticsRepository {
  private http = inject(HttpService);

  GetFinancialHealth(): Observable<FinancialHealthResponse> {
    return this.http.Get(`analytics/health`);
  }
}
