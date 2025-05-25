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

  // This method will change when we have a real API
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl);
  }

  // This method will change when we have a real API
  getProductsByCategoryId(categoryId: number): Observable<Product[]> {
    return this.getProducts().pipe(
      map(products => products.filter(product => product.categoryId === categoryId))
    );
  }

}
