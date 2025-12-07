import { Component } from '@angular/core';
import { BarChartLocal } from '../../../core/helpers/components/chart';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [BarChartLocal],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent {
  monthlyExpenses = [
    1500000, 2300000, 1800000, 2000000, 1750000, 2200000, 1900000, 2100000, 2500000, 3000000,
    2800000, 3200000,
  ];
}
