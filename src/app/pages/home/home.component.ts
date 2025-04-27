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
        .sort(() => 0.5 - Math.random())
        .slice(0, 5);
    });
  }


  openProduct(product: Product) {
    this.selectedProduct = product;
  }

  closeProduct() {
    this.selectedProduct = undefined;
  }

  ngAfterViewInit() {
    setTimeout(() => {

      const loopEnabled = this.featuredProductsCarousel.length >= 3;

      new Swiper('.additional-swiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: loopEnabled,
        loopAdditionalSlides: 5,
        centeredSlides: true,
        effect: 'fade',
        fadeEffect: {
          crossFade: true
        },
        pagination: {
          el: '.additional-swiper-pagination',
          clickable: true,
        },
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        }
        // breakpoints: {
        //   640: {
        //     slidesPerView: 1,
        //   },
        //   1024: {
        //     slidesPerView: 1,
        //   }
        // }
      });           
    }, 0);
  }
  
}
