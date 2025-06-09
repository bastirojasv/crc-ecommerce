import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeaturedProductsComponent } from '../../components/featured-products/featured-products.component';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { Title } from '@angular/platform-browser';
import { trigger, transition, style, animate } from '@angular/animations';
import { PRODUCT_LOGOS } from '../../../assets/data/product-logos';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FeaturedProductsComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('fadeAnimation', [
      transition(':increment', [
        style({ opacity: 0, transform: 'scale(1.03)' }),
        animate('500ms cubic-bezier(.4,0,.2,1)', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':decrement', [
        style({ opacity: 0, transform: 'scale(0.97)' }),
        animate('500ms cubic-bezier(.4,0,.2,1)', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition('* => *', [
        style({ opacity: 0 }),
        animate('400ms', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  selectedProduct?: Product;
  images: string[] = [
    'img1.jpg',
    'img2.jpg',
    'img3.jpg',
    'img4.jpg',
    'img5.jpg',
  ];
  productLogos = PRODUCT_LOGOS;
  currentIndex = 0;
  carouselInterval: any;
  logoCarouselInterval: any;

  featuredProductsCarousel: Product[] = [];

  logosPerPage = 6;
  currentLogoPage = 0;

  constructor(
    private productService: ProductService,
    private titleService: Title
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Inicio | CRC Comercial SPA');
    this.startLogoAutoplay();
    this.startAutoplay();
  }

  ngOnDestroy() {
    this.stopLogoAutoplay();
    this.stopAutoplay();
  }

  openProduct(product: Product) {
    this.selectedProduct = product;
  }

  closeProduct() {
    this.selectedProduct = undefined;
  }

  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prevImage() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  goToImage(index: number) {
    this.currentIndex = index;
    this.restartAutoplay();
  }

  startAutoplay() {
    this.carouselInterval = setInterval(() => {
      this.nextImage();
    }, 5000);
  }

  stopAutoplay() {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }

  restartAutoplay() {
    this.stopAutoplay();
    this.startAutoplay();
  }

  ngAfterViewInit() {
  }

  get totalLogoPages(): number {
    return Math.ceil(this.productLogos.length / this.logosPerPage);
  }

  get visibleLogos(): string[] {
    const start = this.currentLogoPage * this.logosPerPage;
    return this.productLogos.slice(start, start + this.logosPerPage);
  }

  nextLogoPage() {
    this.currentLogoPage = (this.currentLogoPage + 1) % this.totalLogoPages;
  }

  prevLogoPage() {
    this.currentLogoPage =
      (this.currentLogoPage - 1 + this.totalLogoPages) % this.totalLogoPages;
  }

  goToLogoPage(page: number) {
    this.currentLogoPage = page;
  }

  startLogoAutoplay() {
    this.logoCarouselInterval = setInterval(() => {
      this.nextLogoPage();
    }, 5000);
  }

  stopLogoAutoplay() {
    if (this.logoCarouselInterval) {
      clearInterval(this.logoCarouselInterval);
    }
  }
  
}
