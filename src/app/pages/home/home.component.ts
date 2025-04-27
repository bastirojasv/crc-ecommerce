import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeaturedProductsComponent } from '../../components/featured-products/featured-products.component';
import { ProductDetailComponent } from '../../components/product-detail/product-detail.component';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FeaturedProductsComponent, ProductDetailComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  selectedProduct?: Product;
  featuredProductsCarousel: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getProducts().subscribe((products) => {
      this.featuredProductsCarousel = [...products]
        .sort(() => 0.8 - Math.random())
        .slice(0, 8);
    });
  }

  openProduct(product: Product) {
    this.selectedProduct = product;
  }

  closeProduct() {
    this.selectedProduct = undefined;
  }

  ngAfterViewInit() {
    var swiper = new Swiper('.carrousel-swiper', {
      spaceBetween: 30,
      centeredSlides: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      }
    });
  }
  
}
