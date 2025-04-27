import { Component, EventEmitter, Output } from '@angular/core';
import { Product } from '../../models/product.model';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { CommonModule } from '@angular/common';
import { ProductDetailComponent } from '../../components/product-detail/product-detail.component';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [ProductCardComponent, CommonModule, ProductDetailComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {

  // Variables
  selectedProduct?: Product;

  currentPage: number = 1;
  itemsPerPage: number = 9;
  paginatedProducts: Product[] = [];

  products: Product[] = [];
  filteredProducts: Product[] = [];

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {} 

  ngOnInit(): void {
    this.productService.getProducts().subscribe((products) => {
      this.products = products;

      this.route.queryParams.subscribe(params => {
        const categoryId = +params['category'];
        if (categoryId) {
          this.filteredProducts = this.products.filter(p => p.categoryId === categoryId);
        } else {
          this.filteredProducts = this.products;
        }

        this.updatePaginatedProducts();
      });

    });
  }

  openProduct(product: Product) {
    this.selectedProduct = product;
  }

  closeProduct() {
    this.selectedProduct = undefined;
  }

  // Pagination logic

  updatePaginatedProducts(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }
  
  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }
  
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedProducts();
    }
  }
  
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedProducts();
    }
  }

  get startItem(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }
  
  get endItem(): number {
    const end = this.currentPage * this.itemsPerPage;
    return end > this.filteredProducts.length ? this.filteredProducts.length : end;
  }  
  
}
