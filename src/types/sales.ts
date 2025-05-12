export interface Sales {
  id: number;
  productName: string;
  quantity: number;
  price: number;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSalesInput {
  productName: string;
  quantity: number;
  price: number;
}

export interface UpdateSalesInput extends Partial<CreateSalesInput> {
  id: number;
} 