import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { Product } from '../../models/product.model';
import Swiper from 'swiper/bundle'; 
import 'swiper/css/bundle';
import { Router } from '@angular/router';

@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './featured-products.component.html',
  styleUrls: ['./featured-products.component.scss']
})
export class FeaturedProductsComponent implements OnInit {
  @Output() productSelected = new EventEmitter<Product>();

  featuredProducts: Product[] = [];

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((products) => {
      this.featuredProducts = [...products]
        .sort(() => 0.8 - Math.random())
        .slice(0, 8);

      this.initSwiper();
    });
  }

  initSwiper(): void {
    const swiper = new Swiper(".featured-swiper", {
      slidesPerView: 'auto',
      slidesPerGroupSkip: 2,
      breakpoints: {
        769: {
          slidesPerView: 2,
          slidesPerGroup: 2,
        },
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  }

  openProduct(product: Product) {
    this.productSelected.emit(product);
  }

  viewDetails(product: Product) {
    this.router.navigate(['/product', product.id]);
  }
}
