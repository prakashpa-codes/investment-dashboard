import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort'; // ✅ Import MatSort
import { MatIconModule } from '@angular/material/icon';
import { InvestmentService } from '../../services/investment.service';
import { Investment } from '../../models/investment.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { InvestmentFormComponent } from '../forms/investment-form/investment-form.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmDeleteComponent } from '../dialogs/confirm-delete/confirm-delete.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule, 
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatPaginator,
    MatSort,
    MatInputModule,
    MatSelectModule,
    FormsModule
  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, AfterViewInit {
  @Output() investmentsChanged = new EventEmitter<Investment[]>(); // ✅ Emits updates to dashboard

  investments: Investment[] = [];
  displayedColumns: string[] = ['category', 'amount', 'growth', 'gain', 'date', 'actions'];
  dataSource!: MatTableDataSource<Investment>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  searchQuery: string = '';
  selectedCategory: string = '';

  constructor(
    private investmentService: InvestmentService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Investment>();
    this.loadInvestments();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadInvestments() {
    this.investmentService.getInvestments().subscribe((data) => {
      this.investments = data;
      this.dataSource.data = [...this.investments];
      this.updateInvestments(); // ✅ Notify graphs after loading investments
    });
  }

  updateInvestments(): void {
    console.log('Emitting updated investments:', this.investments);
    this.investmentsChanged.emit(this.investments);
  }

  // ✅ Get unique categories for the dropdown filter
  get uniqueCategories(): string[] {
    return [...new Set(this.investments.map((i) => i.category))];
  }

  applyFilter() {
    this.dataSource.filter = this.searchQuery.trim().toLowerCase();
  }

  filterByCategory() {
    if (this.selectedCategory) {
      this.dataSource.data = this.investments.filter(
        (investment) => investment.category === this.selectedCategory
      );
    } else {
      this.dataSource.data = [...this.investments]; // Reset filter
    }
  }

  openAddForm(): void {
    const dialogRef = this.dialog.open(InvestmentFormComponent, { width: '400px' });

    dialogRef.afterClosed().subscribe((newInvestment) => {
      if (newInvestment) {
        this.investmentService.addInvestment(newInvestment).subscribe((addedInvestment) => {
          this.investments.push(addedInvestment);
          this.dataSource.data = [...this.investments];
          this.updateInvestments();
          this.snackBar.open('Investment added successfully!', 'Close', { duration: 3000 });
        });
      }
    });
  }

  editInvestment(investment: Investment): void {
    const dialogRef = this.dialog.open(InvestmentFormComponent, {
      width: '400px',
      data: { ...investment }
    });

    dialogRef.afterClosed().subscribe(updatedInvestment => {
      if (updatedInvestment) {
        this.investmentService.updateInvestment(investment.id, updatedInvestment).subscribe(() => {
          const index = this.investments.findIndex(inv => inv.id === investment.id);
          if (index !== -1) {
            this.investments[index] = updatedInvestment;
            this.dataSource.data = [...this.investments];
            this.updateInvestments();
          }
          this.snackBar.open('Investment edited successfully!', 'Close', { duration: 3000 });
        });
      }
    });
  }

  confirmDeleteInvestment(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      width: '350px',
      data: { id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteInvestment(id);
      }
    });
  }

  deleteInvestment(id: number): void {
    this.investmentService.deleteInvestment(id).subscribe(() => {
      this.investments = this.investments.filter((inv) => inv.id !== id);
      this.dataSource.data = [...this.investments];
      this.updateInvestments();
      this.snackBar.open('Investment deleted successfully!', 'Close', { duration: 3000 });
    });
  }
}
