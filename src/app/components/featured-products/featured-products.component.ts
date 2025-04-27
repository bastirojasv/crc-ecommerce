import { Component, OnInit, Output, EventEmitter, AfterViewInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { Product } from '../../models/product.model';
import Swiper from 'swiper/bundle'; 
import 'swiper/css/bundle';

@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './featured-products.component.html',
  styleUrls: ['./featured-products.component.scss']
})
export class FeaturedProductsComponent implements OnInit, AfterViewInit {
  @Output() productSelected = new EventEmitter<Product>();

  featuredProducts: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((products) => {
      this.featuredProducts = [...products]
        .sort(() => 0.8 - Math.random())
        .slice(0, 8);
    });
  }


  ngAfterViewInit() {
    setTimeout(() => {

      const loopEnabled = this.featuredProducts.length >= 3; // Enable loop if more than 3 products

      new Swiper('.featured-swiper', {
        slidesPerView: 3,
        spaceBetween: 20,
        loop: loopEnabled,
        navigation: {
          nextEl: '.featured-swiper-button-next',
          prevEl: '.featured-swiper-button-prev',
        },
        breakpoints: {
          640: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          }
        }
      });            
    }, 0);
  }

  openProduct(product: Product) {
    this.productSelected.emit(product);
  }
}
