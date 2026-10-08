export class Category {
  id: number;
  name: string;

  constructor(init?: Partial<Product>) {
    this.id = init?.id ?? 0;
    this.name = init?.name ?? '';
  }
}

export class Product {
  id: number;
  categoryId: number;
  name: string;
  description: string;
  price: number;
  position?: number;

  constructor(init?: Partial<Product>) {
    this.id = init?.id ?? 0;
    this.categoryId = init?.categoryId ?? 1;
    this.name = init?.name ?? '';
    this.description = init?.description ?? '';
    this.price = init?.price ?? 0;
  }
}

export class CartItem {
  productId: number;
  quantity: number;

  constructor(productId: number) {
    this.productId = productId;
    this.quantity = 1;
  }
}

export interface CustomerInfo {
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  address: {
    street: string;
    buildingNumber: string;
    zipCode: string;
    city: string;
  };
  paymentMethod: 'cash' | string;
  notes: string;
}

export class Order {
  id?: string | undefined;
  createdAt?: Date;
  customer?: CustomerInfo;
  items: CartItem[];
  totalAmount: number;
  status: 'NEW' | 'IN_PROGRESS' | 'COMPLETED';

  constructor() {
    this.totalAmount = 0;
    this.status = 'NEW';
    this.items = [];
  }
}