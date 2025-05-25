import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private CART_KEY = 'crc_cart';
  private items: CartItem[] = this.loadCartFromStorage();
  private cart$ = new BehaviorSubject<CartItem[]>(this.items);

  private saveCartToStorage(cart: CartItem[]): void {
    localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
  }

  private loadCartFromStorage(): CartItem[] {
    const data = localStorage.getItem(this.CART_KEY);
    return data ? JSON.parse(data) : [];
  }

  getCart() {
    return this.cart$.asObservable();
  }

  getItems(): CartItem[] {
    return [...this.items];
  }

  addToCart(product: Product, quantity: number = 1): void {
    const existingItem = this.items.find(item => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({ product, quantity });
    }
    this.saveCartToStorage(this.items);
    this.cart$.next([...this.items]);
  }

  removeFromCart(productId: number): void {
    this.items = this.items.filter(item => item.product.id !== productId);
    this.saveCartToStorage(this.items);
    this.cart$.next([...this.items]);
  }

  updateQuantity(productId: number, quantity: number): void {
    const item = this.items.find(item => item.product.id === productId);
    if (item && quantity > 0) {
      item.quantity = quantity;
    } else if (item && quantity === 0) {
      this.removeFromCart(productId);
      return;
    }
    this.saveCartToStorage(this.items);
    this.cart$.next([...this.items]);
  }

  clearCart(): void {
    this.items = [];
    this.saveCartToStorage(this.items);
    this.cart$.next([]);
  }
}
