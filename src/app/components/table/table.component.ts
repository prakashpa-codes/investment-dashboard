import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
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
import { MatExpansionModule } from '@angular/material/expansion';
//import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as ExcelJS from 'exceljs';
import saveAs from 'file-saver';

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
    FormsModule,
    MatExpansionModule
  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, AfterViewInit {
  @Output() investmentsChanged = new EventEmitter<Investment[]>();

  investments: Investment[] = [];
  displayedColumns: string[] = ['category', 'amount', 'growth', 'gain', 'date', 'actions'];
  dataSource!: MatTableDataSource<Investment>;
  isMobileView: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('mobilePaginator') mobilePaginator!: MatPaginator;

  searchQuery: string = '';
  selectedCategory: string = '';
  selectedExport: string | null = ''

  constructor(
    private investmentService: InvestmentService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Investment>();
    this.loadInvestments();
    this.detectScreenSize();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  
    setTimeout(() => {
      if (window.innerWidth <= 768) {
        this.dataSource.paginator = this.mobilePaginator;
      }
    });
    
    this.dataSource.sort = this.sort;
  }
  
  loadInvestments() {
    this.investmentService.getInvestments().subscribe((data) => {
      this.investments = data.map(investment => ({
        ...investment,
        expanded: false
      }));
      this.dataSource.data = [...this.investments];
      this.updateInvestments();
    });
  }

  updateInvestments(): void {
    this.investmentsChanged.emit(this.investments);
  }

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
      this.dataSource.data = [...this.investments];
    }
  }

  exportAs(){
    if (this.selectedExport == 'csv') {
      this.exportToCSV();
    }else if(this.selectedExport == 'excel'){
      this.exportToExcel();
    }else if(this.selectedExport == 'pdf'){
      this.exportToPDF();
    }
      // Reset selection to the default empty option
  setTimeout(() => {
    this.selectedExport = '';
  }, 100);
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

  toggleExpand(investment: any): void {
    investment.expanded = !investment.expanded;
  }

  @HostListener('window:resize', [])
  detectScreenSize() {
    this.isMobileView = window.innerWidth < 768;
  }

  // Export to CSV
  exportToCSV(): void {
    const csvData = this.dataSource.data.map(({ category, amount, growth, gain, date }) =>
      [category, amount, growth, gain, date]
    );
    const csvHeader = ['Category', 'Amount', 'Growth (%)', 'Gain/Loss', 'Invested Date'];
    const csvContent = [csvHeader, ...csvData].map(e => e.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Investments.csv';
    link.click();
  }

  // Export to Excel
  /*
  exportToExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      this.investments.map(({ id, expanded, ...investment }) => investment)
    );
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Investments');
    XLSX.writeFile(wb, 'Investments.xlsx');
  }
*/
exportToExcel(): void {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Investments');

  // Define columns
  worksheet.columns = [
    { header: 'Category', key: 'category', width: 20 },
    { header: 'Amount', key: 'amount', width: 15 },
    { header: 'Growth (%)', key: 'growth', width: 15 },
    { header: 'Gain/Loss', key: 'gain', width: 15 },
    { header: 'Invested Date', key: 'date', width: 15 },
  ];

  // Use filtered data if available, otherwise use all investments
  const exportData = this.dataSource.filteredData.length > 0 
    ? this.dataSource.filteredData  // Export only filtered data
    : this.investments;  // Export all data if no filter is applied

  // Add rows (skip 'id' and 'expanded' properties)
  exportData.forEach(investment => {
    worksheet.addRow({
      category: investment.category,
      amount: investment.amount,
      growth: investment.growth,
      gain: investment.gain,
      date: investment.date
    });
  });

  // Save the file
  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'Investments.xlsx');
  });
}  

  // Export to PDF
  exportToPDFold(): void {
    const doc = new jsPDF();
  
    // Set title
    doc.setFontSize(16);
    doc.text('Investment Data', 14, 15);
  
    // Convert table data
    const tableData = this.dataSource.filteredData.map(({ category, amount, growth, gain, date }) => [
      category,
      `$${amount.toLocaleString()}`,
      `${growth}%`,
      `$${gain.toLocaleString()}`,
      new Date(date).toLocaleDateString('en-US')
    ]);
  
    // Add table to PDF
    (doc as any).autoTable({
      head: [['Category', 'Amount', 'Growth (%)', 'Gain/Loss', 'Invested Date']],
      body: tableData,
      startY: 20,
      theme: 'striped'
    });
  
    // Save PDF file
    doc.save('Investments.pdf');
  }

  exportToPDF(): void {
    const doc = new jsPDF();
  
    // Set title
    doc.setFontSize(16);
    doc.text('Investment Data', 14, 15);
  
    // Convert table data
    const tableData = this.dataSource.filteredData.map(({ category, amount, growth, gain, date }) => [
      category,
      `$${amount.toLocaleString()}`,
      `${growth}%`,
      `$${gain.toLocaleString()}`,
      new Date(date).toLocaleDateString('en-US')
    ]);
  
    // Ensure autoTable is attached correctly
    autoTable(doc, {
      head: [['Category', 'Amount', 'Growth (%)', 'Gain/Loss', 'Invested Date']],
      body: tableData,
      startY: 20,
      theme: 'striped'
    });
  
    // Save PDF file
    doc.save('Investments.pdf');
  }
  
  
}
