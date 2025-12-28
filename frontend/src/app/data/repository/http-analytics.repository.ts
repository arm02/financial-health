import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../core/helpers/services/http.service';
import { AnalyticsRepository } from '../../core/repository/analytics.repository';
import { FinancialHealthResponse } from '../../core/domain/entities/analytics.entities';
import { AnalyticsFilterDTO } from '../../core/domain/dto/analytics.dto';

@Injectable({ providedIn: 'root' })
export class HttpAnalyticsRepository implements AnalyticsRepository {
  private http = inject(HttpService);

  GetFinancialHealth(params?: AnalyticsFilterDTO): Observable<FinancialHealthResponse> {
    let queryParams = '';
    if (params?.start_date && params?.end_date) {
      queryParams = `?start_date=${params.start_date}&end_date=${params.end_date}`;
    }
    return this.http.Get(`analytics/health${queryParams}`);
  }
}
