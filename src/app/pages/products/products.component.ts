import { Component, HostListener } from '@angular/core';
import { Product } from '../../models/product.model';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { CommonModule } from '@angular/common';
import { Category, CategoryService } from '../../services/category.service';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [ProductCardComponent, CommonModule, FormsModule, RouterModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {

  // Variables
  selectedProduct?: Product;

  inputFocused: boolean = false;

  searchText: string = '';
  sortOption: string = '';
  selectedCategories: number[] = [];

  categories: Category[] = []; 

  currentPage: number = 1;
  itemsPerPage: number = 9;
  paginatedProducts: Product[] = [];

  products: Product[] = [];
  filteredProducts: Product[] = [];

  currentCategoryName: string = '';

  isMobile = false;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private titleService: Title
  ) {} 

  ngOnInit(): void {

    this.titleService.setTitle('Productos | CRC Comercial SPA');

    this.productService.getProducts().subscribe((products) => {
      this.products = products;
      this.route.queryParams.subscribe(params => {
        const categoryId = +params['category'];
  
        if (categoryId) {
          this.filteredProducts = this.products.filter(p => p.categoryId === categoryId);
  
          // Buscar el nombre de la categoría
          this.categoryService.getCategories().subscribe(categories => {
            const found = categories.find(c => c.id === categoryId);
            this.currentCategoryName = found ? found.name : 'Productos';
          });
  
        } else {
          this.filteredProducts = this.products;
          this.currentCategoryName = 'Todos los Productos';
        }

        this.isMobile = window.innerWidth < 768;
  
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
    const pagesToShow = this.isMobile ? 3 : 5;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }
  
  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  get startItem(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }
  
  get endItem(): number {
    const end = this.currentPage * this.itemsPerPage;
    return end > this.filteredProducts.length ? this.filteredProducts.length : end;
  }  

  get visiblePages(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const range = this.isMobile ? 3 : 5;
  
    let start = Math.max(current - Math.floor(range / 2), 1);
    let end = start + range - 1;
  
    if (end > total) {
      end = total;
      start = Math.max(end - range + 1, 1);
    }
  
    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
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
  
  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedProducts();
  }

  // Filter and sort logic

  applyFilters(): void {
    let filtered = [...this.products];
  
    // Filtrar por texto
    if (this.searchText.trim() !== '') {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
  
    // Filtrar por categorías
    if (this.selectedCategories.length > 0) {
      filtered = filtered.filter(product =>
        this.selectedCategories.includes(product.categoryId)
      );
    }
  
    // Ordenar
    if (this.sortOption === 'name-asc') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (this.sortOption === 'name-desc') {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    }
  
    this.filteredProducts = filtered;
    this.currentPage = 1; // Reiniciar página
    this.updatePaginatedProducts();
  }
  
  onCategoryChange(event: any): void {
    const categoryId = +event.target.value;
    if (event.target.checked) {
      this.selectedCategories.push(categoryId);
    } else {
      this.selectedCategories = this.selectedCategories.filter(id => id !== categoryId);
    }
    this.applyFilters();
  }
  
  clearFilters(): void {
    this.searchText = '';
    this.sortOption = '';
    this.selectedCategories = [];
    this.applyFilters();
  } 

  @HostListener('window:resize', [])
  onResize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth < 768;

    if (wasMobile !== this.isMobile) {
      // Cambió el tamaño de dispositivo, recalcular páginas visibles
      this.updatePaginatedProducts();
    }
  }

}
