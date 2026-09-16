export interface SaleRecord {
  id: string;
  medicineId: string;
  medicineName: string;
  quantitySold: number;
  unitPrice: number;
  totalAmount: number;
  saleDate: string; // ISO date string
}

export interface RecordSaleRequest {
  medicineId: string;
  quantitySold: number;
}
