import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ Import CommonModule
import { BaseChartDirective } from 'ng2-charts';
import {
  ChartConfiguration,
  ChartType,
  Chart,
  registerables,
} from 'chart.js';
import { Investment } from '../../models/investment.model';

Chart.register(...registerables);

@Component({
  selector: 'app-graphs',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.css']
})
export class GraphsComponent implements OnChanges {
  @Input() investments: Investment[] = []; // ✅ Receive live data from table component

  // Net Worth Chart (Line Chart)
  netWorthData!: ChartConfiguration['data'];
  netWorthOptions: ChartConfiguration['options'] = { responsive: true };
  netWorthType: ChartType = 'line';

  // Category Chart (Pie Chart)
  categoryData!: ChartConfiguration['data'];
  categoryOptions: ChartConfiguration['options'] = { responsive: true };
  categoryType: ChartType = 'pie';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['investments']) {
      console.log('Updated Investments received in GraphsComponent:', this.investments);
      if (this.investments.length > 0) {
        this.updateGraphs();
      } else {
        console.log('No investments data found for graphs.');
        this.resetGraphs(); // ✅ Prevent graph errors when no investments exist
      }
    }
  }

  resetGraphs(): void {
    this.netWorthData = { labels: [], datasets: [] };
    this.categoryData = { labels: [], datasets: [] };
  }

  updateGraphs(): void {
    if (!this.investments || this.investments.length === 0) {
      this.resetGraphs();
      return;
    }

    // ✅ Prepare data for Net Worth Chart
    const labels: string[] = [];
    const cumulativeNetWorth: number[] = [];
    let runningTotal = 0;

    this.investments
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .forEach((investment) => {
        runningTotal += investment.amount * (1 + investment.growth / 100);
        labels.push(investment.date);
        cumulativeNetWorth.push(runningTotal);
      });

    this.netWorthData = {
      labels,
      datasets: [
        {
          label: 'Net Worth',
          data: cumulativeNetWorth,
          borderColor: '#42A5F5',
          backgroundColor: 'rgba(66,165,245,0.1)',
          fill: true,
        },
      ],
    };

    // ✅ Prepare data for Category Distribution Chart
    const categories = this.investments.reduce((acc, inv) => {
      acc[inv.category] = (acc[inv.category] || 0) + inv.amount;
      return acc;
    }, {} as Record<string, number>);

    this.categoryData = {
      labels: Object.keys(categories),
      datasets: [
        {
          data: Object.values(categories),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50'],
        },
      ],
    };
  }
}