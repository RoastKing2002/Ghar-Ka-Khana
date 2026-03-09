export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  day: string | null;
}

export interface Order {
  id: string;
  customer_name: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'preparing' | 'delivered' | 'cancelled';
  created_at: string;
}

export interface CartItem extends InventoryItem {
  quantity: number;
}
