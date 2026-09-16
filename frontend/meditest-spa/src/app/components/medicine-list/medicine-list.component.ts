import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { Medicine } from '../../models/medicine';
import { MedicineService } from '../../services/medicine.service';

const EXPIRY_WARNING_DAYS = 30;
const LOW_STOCK_THRESHOLD = 10;

@Component({
  selector: 'app-medicine-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medicine-list.component.html',
  styleUrl: './medicine-list.component.css'
})
export class MedicineListComponent implements OnInit, OnChanges {
  /** Bumped by the parent whenever a medicine or sale changes, to trigger a refresh. */
  @Input() refreshTrigger = 0;
  @Output() sellRequested = new EventEmitter<Medicine>();

  medicines: Medicine[] = [];
  searchTerm = '';
  loading = false;
  errorMessage = '';

  private searchTerms$ = new Subject<string>();

  constructor(private medicineService: MedicineService) {}

  ngOnInit(): void {
    this.loadMedicines();

    this.searchTerms$.pipe(debounceTime(300), distinctUntilChanged()).subscribe((term) => {
      this.loadMedicines(term);
    });
  }

  ngOnChanges(): void {
    // Parent bumped refreshTrigger (e.g. after adding a medicine or recording a sale).
    this.loadMedicines(this.searchTerm);
  }

  onSearchChange(term: string): void {
    this.searchTerms$.next(term);
  }

  loadMedicines(search?: string): void {
    this.loading = true;
    this.errorMessage = '';
    this.medicineService.getAll(search).subscribe({
      next: (data) => {
        this.medicines = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Could not load medicines. Is the API running on http://localhost:5000?';
        this.loading = false;
      }
    });
  }

  isExpiringSoon(medicine: Medicine): boolean {
    const daysToExpiry = this.daysUntil(medicine.expiryDate);
    return daysToExpiry < EXPIRY_WARNING_DAYS;
  }

  isLowStock(medicine: Medicine): boolean {
    return medicine.quantity < LOW_STOCK_THRESHOLD;
  }

  rowClass(medicine: Medicine): string {
    // Expiry takes visual priority over low stock when both apply.
    if (this.isExpiringSoon(medicine)) {
      return 'row-expiring';
    }
    if (this.isLowStock(medicine)) {
      return 'row-low-stock';
    }
    return '';
  }

  private daysUntil(dateIso: string): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateIso);
    target.setHours(0, 0, 0, 0);
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.round((target.getTime() - today.getTime()) / msPerDay);
  }

  sell(medicine: Medicine): void {
    this.sellRequested.emit(medicine);
  }
}
