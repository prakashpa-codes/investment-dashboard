import { Component, Input, OnChanges, SimpleChanges, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import {
  ChartConfiguration,
  ChartType,
  Chart,
  registerables,
} from 'chart.js';
import { Investment } from '../../models/investment.model';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

Chart.register(...registerables);

@Component({
  selector: 'app-graphs',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, MatSelectModule, MatFormFieldModule],
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.css']
})
export class GraphsComponent implements OnChanges {
  @Input() investments: Investment[] = [];

  selectedChart: string = 'netWorth'; // Default chart for mobile
  isDesktopView: boolean = window.innerWidth > 768; // Detect screen size

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isDesktopView = window.innerWidth > 768;
  }

  // Net Worth Chart (Line Chart)
  netWorthData!: ChartConfiguration['data'];
  netWorthOptions: ChartConfiguration['options'] = { responsive: true };
  netWorthType: ChartType = 'line';

  // Category Distribution (Pie Chart)
  categoryData!: ChartConfiguration['data'];
  categoryOptions: ChartConfiguration['options'] = { responsive: true };
  categoryType: ChartType = 'pie';

  // ROI Over Time (Line Chart)
  roiData!: ChartConfiguration['data'];
  roiOptions: ChartConfiguration['options'] = { responsive: true };
  roiType: ChartType = 'line';

  // Investment vs. Gain (Stacked Bar Chart)
  investmentGainData!: ChartConfiguration['data'];
  investmentGainOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true },
    },
    scales: {
      x: { stacked: true },
      y: { stacked: true }
    }
  };
  investmentGainType: ChartType = 'bar';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['investments']) {
      if (this.investments.length > 0) {
        this.updateGraphs();
      } else {
        this.resetGraphs();
      }
    }
  }

  resetGraphs(): void {
    this.netWorthData = { labels: [], datasets: [] };
    this.categoryData = { labels: [], datasets: [] };
    this.roiData = { labels: [], datasets: [] };
    this.investmentGainData = { labels: [], datasets: [] };
  }

  updateGraphs(): void {
    if (!this.investments || this.investments.length === 0) {
      this.resetGraphs();
      return;
    }

    // Preparing data for Net Worth Chart
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

    // Preparing data for Category Distribution Chart
    const categories = this.investments.reduce((acc, inv) => {
      acc[inv.category] = (acc[inv.category] || 0) + inv.amount;
      return acc;
    }, {} as Record<string, number>);

    this.categoryData = {
      labels: Object.keys(categories),
      datasets: [
        {
          data: Object.values(categories),
        },
      ],
    };

    // Preparing data for ROI Over Time Chart
    const roiValues: number[] = [];
    this.investments.forEach((investment) => {
      const roi = (investment.gain / investment.amount) * 100; // ROI Formula
      roiValues.push(roi);
    });

    this.roiData = {
      labels,
      datasets: [
        {
          label: 'ROI (%)',
          data: roiValues,
          borderColor: '#FF6384',
          backgroundColor: 'rgba(255,99,132,0.2)',
          fill: true,
        },
      ],
    };

    // Preparing data for Investment vs. Gain (Stacked Bar Chart)
    const investmentValues: number[] = [];
    const gainValues: number[] = [];
    Object.keys(categories).forEach((category) => {
      const totalInvestment = this.investments
        .filter(inv => inv.category === category)
        .reduce((sum, inv) => sum + inv.amount, 0);
      const totalGain = this.investments
        .filter(inv => inv.category === category)
        .reduce((sum, inv) => sum + inv.gain, 0);

      investmentValues.push(totalInvestment);
      gainValues.push(totalGain);
    });

    this.investmentGainData = {
      labels: Object.keys(categories),
      datasets: [
        { label: 'Investment', data: investmentValues, backgroundColor: '#36A2EB' },
        { label: 'Gain', data: gainValues, backgroundColor: '#FFCE56' },
      ],
    };
  }
}
