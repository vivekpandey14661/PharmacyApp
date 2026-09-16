import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Medicine } from '../../models/medicine';
import { SaleRecord } from '../../models/sale';
import { SaleService } from '../../services/sale.service';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css'
})
export class SalesComponent implements OnInit, OnChanges {
  /** Set by the parent when the user clicks "Record Sale" on a medicine row. */
  @Input() medicineToSell: Medicine | null = null;
  @Input() refreshTrigger = 0;
  @Output() saleRecorded = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  sales: SaleRecord[] = [];
  quantityToSell = 1;
  submitting = false;
  errorMessage = '';

  constructor(private saleService: SaleService) {}

  ngOnInit(): void {
    this.loadSales();
  }

  ngOnChanges(): void {
    this.quantityToSell = 1;
    this.errorMessage = '';
    this.loadSales();
  }

  loadSales(): void {
    this.saleService.getAll().subscribe({
      next: (data) => (this.sales = data),
      error: () => (this.errorMessage = 'Could not load sale records.')
    });
  }

  confirmSale(): void {
    if (!this.medicineToSell) {
      return;
    }
    if (this.quantityToSell <= 0 || this.quantityToSell > this.medicineToSell.quantity) {
      this.errorMessage = `Enter a quantity between 1 and ${this.medicineToSell.quantity}.`;
      return;
    }

    this.submitting = true;
    this.errorMessage = '';
    this.saleService
      .record({ medicineId: this.medicineToSell.id, quantitySold: this.quantityToSell })
      .subscribe({
        next: () => {
          this.submitting = false;
          this.saleRecorded.emit();
        },
        error: (err) => {
          this.errorMessage = err?.error?.message ?? 'Could not record sale.';
          this.submitting = false;
        }
      });
  }

  cancel(): void {
    this.errorMessage = '';
    this.cancelled.emit();
  }
}
