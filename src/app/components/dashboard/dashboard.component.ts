import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GraphsComponent } from '../graphs/graphs.component';
import { TableComponent } from '../table/table.component';
import { Investment } from '../../models/investment.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    GraphsComponent,
    TableComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  // Stores the latest list of investments for use in graphs
  investments: Investment[] = []; 

  // Updates the investment list when changes occur in the table component
  onInvestmentsChanged(updatedInvestments: Investment[]): void {
    //console.log('Dashboard received updated investments:', updatedInvestments);
    this.investments = [...updatedInvestments]; 
  }
}