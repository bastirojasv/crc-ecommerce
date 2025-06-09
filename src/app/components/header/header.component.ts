import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CategoryService, Category } from '../../services/category.service';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  categories: Category[] = [];
  totalItems: number = 0;
  isBouncing = false;

  // Search functionality
  searchText: string = '';
  isFocused: boolean = false;
  filteredProducts: Product[] = [];
  products: Product[] = [];

  constructor(
    private categoryService: CategoryService, 
    private router : Router,
    private cartService: CartService,
    private productService: ProductService // Assuming productService is used for products
  ) {}

  ngOnInit(): void {
    
    // Obtain all categories
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
    });

    // Obtain all products 
    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });

    // Obtain the total number of items in the cart
    this.cartService.getCart().subscribe(cart => {
      this.totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    })

    // Initialize filtered products
    this.filteredProducts = [];
  }

  // Handle search input changes
  ngOnChanges() {
    this.filterProducts();
  }

  // Handle search input focus
  filterProducts() {
    const query = this.searchText?.toLowerCase().trim();

    if (query && query.length > 0) {
      this.filteredProducts = this.products.filter(product =>
        product.name.toLowerCase().includes(query) // Is like a LIKE in SQL
      ).slice(0, 5); // Limit to 5 results
    } else {
      this.filteredProducts = [];
    }
  }

  goToSearchResults(): void {
    const trimmed = this.searchText?.trim();
    if (trimmed) {
      this.router.navigate(['/products'], { queryParams: { search: trimmed } });
      this.searchText = '';
      this.filteredProducts = [];
    }
  }

  goToCategory(categoryId: number): void {
    this.router.navigate(['/products'], { queryParams: { category: categoryId } });
  }

  goToProduct(productId: number): void {
    this.router.navigate(['/products', productId]);
    this.filteredProducts = [];
    this.searchText = '';
  }

  triggerBounce(): void {
    this.isBouncing = true;
    setTimeout(() => {
      this.isBouncing = false;
    }, 400);
  }
}
