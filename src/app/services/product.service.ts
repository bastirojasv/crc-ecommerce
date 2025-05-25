import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'assets/data/products.json'; // URL to web API

  constructor(private http: HttpClient) {}

  // This method will change when we have a real API
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl);
  }

  // This method will change when we have a real API
  getProductsByCategoryId(categoryId: number): Product[] {
    let products: Product[] = [];
    this.getProducts().subscribe(data => {
      products = data.filter(product => product.categoryId === categoryId);
    });
    return products;
  }

}
