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
  fatherCategories: Category[] = [];
  totalItems: number = 0;
  isBouncing = false;

  // Search functionality
  searchText: string = '';
  isFocused: boolean = false;
  filteredProducts: Product[] = [];
  products: Product[] = [];

  sideMenuOpen = false;
  sideMenuStack: Category[][] = []; // Stack para navegar entre niveles
  currentCategories: Category[] = []; // Categorías actuales a mostrar
  sideMenuTitle: string = 'Categorías';

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
      this.fatherCategories = this.categories.filter(category => category.fatherId === null);
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

  // Abrir menú lateral con categorías padre
  openSideMenu() {
    this.sideMenuOpen = true;
    this.sideMenuStack = [];
    this.currentCategories = this.fatherCategories;
    this.sideMenuTitle = 'Categorías';
  }

  // Cerrar menú lateral
  closeSideMenu() {
    this.sideMenuOpen = false;
    this.sideMenuStack = [];
    this.currentCategories = [];
  }

  // Navegar a subcategorías
  openSubcategories(category: Category) {
    const subcategories = this.categories.filter(cat => cat.fatherId === category.id);
    if (subcategories.length > 0) {
      this.sideMenuStack.push(this.currentCategories);
      this.currentCategories = subcategories;
      this.sideMenuTitle = category.name;
    } else {
      // Si no hay subcategorías, navegar a la categoría
      this.goToCategory(category.id);
      this.closeSideMenu();
    }
  }

  // Volver al nivel anterior
  goBackSideMenu() {
    if (this.sideMenuStack.length > 0) {
      this.currentCategories = this.sideMenuStack.pop()!;
      // Actualiza el título
      if (this.sideMenuStack.length === 0) {
        this.sideMenuTitle = 'Categorías';
      } else {
        // Busca el nombre de la categoría anterior
        const prevCat = this.categories.find(cat =>
          cat.id === this.currentCategories[0]?.fatherId
        );
        this.sideMenuTitle = prevCat ? prevCat.name : 'Categorías';
      }
    }
  }

  // Mostrar todos los productos de la categoría actual
  showAllCurrentCategory() {
    // Si estamos en subcategoría, busca el padre
    const parentId = this.currentCategories[0]?.fatherId;
    if (parentId) {
      this.goToCategory(parentId);
    }
    this.closeSideMenu();
  }

  // Add this method to your HeaderComponent class
  hasSubcategories(category: any): boolean {
    return Array.isArray(category.subcategories) && category.subcategories.length > 0;
  }
}
