import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { CategoryService } from '../../services/category.service';
import { CartService } from '../../services/cart.service';
import { AppComponent } from '../../app.component';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-detail-page.component.html',
  styleUrls: ['./product-detail-page.component.scss']
})
export class ProductDetailPageComponent implements OnInit {
  product?: Product;
  isCollapsed: boolean = true;
  categoryName: string = '';
  selectedImage: string = '';
  quantity: number = 1;
  btnPulse = false;
  mainImageZoomStyle: any = {};
  fadeIn = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private app: AppComponent,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      const id = +paramMap.get('id')!;
      this.productService.getProducts().subscribe(products => {
        const found = products.find(p => p.id === id);
        if (found) {
          this.product = found;
          this.selectedImage = found.images[0];

          this.titleService.setTitle(`${found.name} | CRC Comercial SPA`);

          this.categoryService.getCategories().subscribe(categories => {
            const match = categories.find(c => c.id === found.categoryId);
            if (match) this.categoryName = match.name;
          });

          // <-- Asegúrate de setear el backgroundImage aquí
          this.mainImageZoomStyle = {
            backgroundImage: `url('assets/images/${found.images[0]}')`,
            backgroundPosition: 'center',
            backgroundSize: 'contain',
          };
        }
      });
    });
    this.mainImageZoomStyle = {
      backgroundImage: '',
      backgroundPosition: 'center',
      backgroundSize: '100% 100%',
    };
  }

  get formattedDescription(): string {
    if (!this.product?.description) return '';
    return this.product.description.replace(/\n/g, '<br>');
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product, this.quantity);
      this.app.showToast(`${this.quantity} × ${this.product.name} añadido al carrito`);
      
      this.btnPulse = true;
      setTimeout(() => this.btnPulse = false, 300);
    }
  }

  onThumbnailClick(img: string) {
    this.fadeIn = false;
    setTimeout(() => {
      this.selectedImage = img;
      this.mainImageZoomStyle = {
        backgroundImage: `url('assets/images/${img}')`,
        backgroundPosition: 'center',
        backgroundSize: 'contain',
      };
      this.fadeIn = true;
    }, 10);
  }

  onImageMouseMove(event: MouseEvent) {
    const target = event.target as HTMLElement;
    // Si el mouse está sobre una flecha, no hagas zoom
    if (target.classList.contains('carousel-arrow') || target.closest('.carousel-arrow')) {

      this.mainImageZoomStyle = {
        backgroundImage: `url('assets/images/${this.selectedImage}')`,
        backgroundPosition: 'center',
        backgroundSize: 'contain',
      };

      return;
    }
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    this.mainImageZoomStyle = {
      backgroundImage: `url('assets/images/${this.selectedImage}')`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: '180% 180%',
    };
  }

  onImageMouseLeave() {
    this.mainImageZoomStyle = {
      backgroundImage: `url('assets/images/${this.selectedImage}')`,
      backgroundPosition: 'center',
      backgroundSize: 'contain',
    };
  }

  prevImage(event: Event) {
    event.stopPropagation();
    const btn = event.target as HTMLElement;
    if (btn instanceof HTMLElement) btn.blur(); // Quita el foco
    if (!this.product) return;
    const idx = this.product.images.indexOf(this.selectedImage);
    const prevIdx = (idx - 1 + this.product.images.length) % this.product.images.length;
    this.onThumbnailClick(this.product.images[prevIdx]);
  }

  nextImage(event: Event) {
    event.stopPropagation();
    const btn = event.target as HTMLElement;
    if (btn instanceof HTMLElement) btn.blur(); // Quita el foco
    if (!this.product) return;
    const idx = this.product.images.indexOf(this.selectedImage);
    const nextIdx = (idx + 1) % this.product.images.length;
    this.onThumbnailClick(this.product.images[nextIdx]);
  }
}
