import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
  investments: Investment[] = []; // ✅ Holds latest investments for graphs

  onInvestmentsChanged(updatedInvestments: Investment[]): void {
    console.log('Dashboard received updated investments:', updatedInvestments); // ✅ Debugging
    this.investments = [...updatedInvestments]; // ✅ Store updated investments
  }
}
