import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'assets/data/products.json'; // URL to web API

  products: Product[] = [];

  constructor(private http: HttpClient) {}

  // Agrega un query string para evitar caché
  getProducts(): Observable<Product[]> {
    const url = `${this.productsUrl}?v=${Date.now()}`;
    return this.http.get<Product[]>(url);
  }

  getProductsByCategoryId(categoryId: number): Observable<Product[]> {
    const url = `${this.productsUrl}?v=${Date.now()}`;
    return this.http.get<Product[]>(url).pipe(
      map(products => products.filter(product => product.categoryId === categoryId))
    );
  }
}
