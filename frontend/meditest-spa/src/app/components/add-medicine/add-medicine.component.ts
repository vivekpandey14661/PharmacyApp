import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NewMedicine } from '../../models/medicine';
import { MedicineService } from '../../services/medicine.service';

@Component({
  selector: 'app-add-medicine',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-medicine.component.html',
  styleUrl: './add-medicine.component.css'
})
export class AddMedicineComponent {
  @Output() medicineAdded = new EventEmitter<void>();

  model: NewMedicine = this.emptyModel();
  submitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(private medicineService: MedicineService) {}

  private emptyModel(): NewMedicine {
    return {
      fullName: '',
      notes: '',
      expiryDate: '',
      quantity: 0,
      price: 0,
      brand: ''
    };
  }

  submit(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.medicineService.add(this.model).subscribe({
      next: () => {
        this.successMessage = `"${this.model.fullName}" was added successfully.`;
        this.model = this.emptyModel();
        form.resetForm();
        this.submitting = false;
        this.medicineAdded.emit();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message ?? 'Could not add medicine. Please try again.';
        this.submitting = false;
      }
    });
  }
}
