export interface Medicine {
  id: string;
  fullName: string;
  notes: string;
  expiryDate: string; // ISO date string
  quantity: number;
  price: number;
  brand: string;
}

// Payload for creating a medicine - id is generated server-side.
export type NewMedicine = Omit<Medicine, 'id'>;
