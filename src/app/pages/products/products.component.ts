import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { ProductCardComponent } from '../../components/product-card/product-card.component';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [ProductCardComponent, CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  // Datos principales
  products: Product[] = [];
  categories: Category[] = [];
  filteredProducts: Product[] = [];
  paginatedProducts: Product[] = [];

  // Filtros y paginación
  searchText: string = '';
  selectedCategories: number[] = [];
  sortOption: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 12;
  queryParams: any = {};

  // Otros
  isMobile = false;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private titleService: Title,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Productos | CRC Comercial SPA');
    this.categoryService.getCategories().subscribe(categories => this.categories = categories);

    this.productService.getProducts().subscribe(products => {
      this.products = products;

      // Suscríbete a los parámetros de la URL después de cargar productos
      this.route.queryParams.subscribe(params => {
        this.syncFiltersWithParams(params);
        this.applyFilters();
        this.updatePaginatedProducts();
      });
    });

    this.isMobile = window.innerWidth < 768;
  }

  // Sincroniza los filtros visuales con los parámetros de la URL
  syncFiltersWithParams(params: any): void {
    this.searchText = params['search'] || '';
    this.selectedCategories = params['categories']
      ? (Array.isArray(params['categories'])
          ? params['categories'].map(Number)
          : params['categories'].split(',').map(Number))
      : [];
    this.currentPage = params['page'] ? +params['page'] : 1;
  }

  // Aplica todos los filtros y orden
  applyFilters(): void {
    let result = [...this.products];

    // Filtro por búsqueda
    if (this.searchText.trim()) {
      const search = this.searchText.trim().toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(search) ||
        (p.description && p.description.toLowerCase().includes(search))
      );
    }

    // Filtro por categorías
    if (this.selectedCategories.length > 0) {
      result = result.filter(p => this.selectedCategories.includes(p.categoryId));
    }

    // Orden
    if (this.sortOption === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (this.sortOption === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }

    this.filteredProducts = result;
    // Elimina o comenta esta línea:
    // this.currentPage = 1;
  }

  // Actualiza los productos paginados
  updatePaginatedProducts(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;

    this.paginatedProducts = this.filteredProducts.slice(start, end);
  }

  // Cambia de página y actualiza la URL
  goToPage(page: number): void {
    this.currentPage = page;
    this.updateQueryParams(page);
  }

  // Actualiza los parámetros de la URL
  updateQueryParams(page?: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        ...this.queryParams,
        search: this.searchText || undefined,
        categories: this.selectedCategories.length ? this.selectedCategories : undefined,
        sort: this.sortOption || undefined,
        page: page != null ? page : this.currentPage
      },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  // Maneja el cambio de categoría (checkbox)
  onCategoryChange(event: any, categoryId: number): void {
    if (event.target.checked) {
      if (!this.selectedCategories.includes(categoryId)) {
        this.selectedCategories.push(categoryId);
      }
    } else {
      this.selectedCategories = this.selectedCategories.filter(id => id !== categoryId);
    }
    this.currentPage = 1; // Reinicia a la primera página al filtrar
    this.updateQueryParams();
    // Quita estas líneas:
    // this.applyFilters();
    // this.updatePaginatedProducts();
  }

  // Maneja el cambio de búsqueda
  onSearchChange(): void {
    this.currentPage = 1;
    this.updateQueryParams();
    // Quita estas líneas:
    // this.applyFilters();
    // this.updatePaginatedProducts();
  }

  // Maneja el cambio de orden
  onSortChange(): void {
    this.currentPage = 1;
    this.updateQueryParams();
    // Quita estas líneas:
    // this.applyFilters();
    // this.updatePaginatedProducts();
  }

  // Limpia todos los filtros
  clearFilters(): void {
    this.searchText = '';
    this.selectedCategories = [];
    this.sortOption = '';
    this.currentPage = 1;
    this.updateQueryParams();
    // Quita estas líneas:
  }

  // Paginación
  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  get startItem(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get endItem(): number {
    return Math.min(this.startItem + this.itemsPerPage - 1, this.filteredProducts.length);
  }

  get visiblePages(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const delta = 2;
    const pages = [];
    for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
      pages.push(i);
    }
    return pages;
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  @HostListener('window:resize', [])
  onResize() {
    this.isMobile = window.innerWidth < 768;
  }
}
