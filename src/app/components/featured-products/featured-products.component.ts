import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { Product } from '../../models/product.model';
import 'swiper/css/bundle';
import { Router } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './featured-products.component.html',
  styleUrls: ['./featured-products.component.scss']
})
export class FeaturedProductsComponent implements OnInit {

  @Output() productSelected = new EventEmitter<Product>();
  @ViewChild('carousel', { static: false }) carousel!: ElementRef;
  @Input() categoryId!: number;
  @Input() categoryTitle: string = 'Productos';

  featuredProducts: Product[] = [];

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    if (this.categoryId != null) {
      this.productService.getProductsByCategoryId(this.categoryId).subscribe(productsByCategory => {
        this.featuredProducts = [...productsByCategory]
          .sort(() => 0.9 - Math.random())
          .slice(0, 9);
      });
    } else {
      console.log('No category ID provided');
    }
  }

  // Navigation methods
  scrollLeft() {
    this.carousel.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight() {
    this.carousel.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
  }

  openProduct(product: Product) {
    this.productSelected.emit(product);
  }

  viewDetails(product: Product) {
    this.router.navigate(['/product', product.id]);
  }
}
