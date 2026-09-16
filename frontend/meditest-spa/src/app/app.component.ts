import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Medicine } from './models/medicine';
import { MedicineListComponent } from './components/medicine-list/medicine-list.component';
import { AddMedicineComponent } from './components/add-medicine/add-medicine.component';
import { SalesComponent } from './components/sales/sales.component';

type Tab = 'list' | 'add';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MedicineListComponent, AddMedicineComponent, SalesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  activeTab: Tab = 'list';
  refreshTrigger = 0;
  medicineToSell: Medicine | null = null;

  setTab(tab: Tab): void {
    this.activeTab = tab;
  }

  onMedicineAdded(): void {
    this.refreshTrigger++;
    this.activeTab = 'list';
  }

  onSellRequested(medicine: Medicine): void {
    this.medicineToSell = medicine;
  }

  onSaleRecorded(): void {
    this.medicineToSell = null;
    this.refreshTrigger++;
  }

  onSaleCancelled(): void {
    this.medicineToSell = null;
  }
}
