import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeaturedProductsComponent } from '../../components/featured-products/featured-products.component';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FeaturedProductsComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  selectedProduct?: Product;
  images: string[] = [
    'img1.jpg',
    // 'img2.jpg',
    // 'img3.jpg',
    // 'img4.jpg',
    // 'img5.jpg',
  ];

  featuredProductsCarousel: Product[] = [];
  brands = [
    {
      name: 'Safety',
      img: 'https://safetystore.cl/cdn/shop/files/fefbddc2-2f0f-43d7-a889-a89d56d66e09___a6d4001eb14f0664226feb6403d8b9cc_430x_430x167_89eaea70-e53a-488f-8a85-6eff702d9e87.png?v=1725390168&width=500',
      link: 'https://safetystore.cl'
    },
    {
      name: 'Siberia',
      img: 'https://siberia.cl/cdn/shop/files/siberia-500px.png?v=1710355924&width=90',
      link: 'https://siberia.cl/'
    },
    {
      name: 'Exoset',
      img: 'https://static.bolder.run/3363/logo/original/logo-exosetlogo-final-blanco_(Copy).png',
      link: 'https://www.exoset.cl/'
    },
    {
      name: 'ChileGuantes',
      img: 'https://chileguantes.cl/wp-content/uploads/2024/05/new-logo1-60.png',
      link: 'https://chileguantes.cl/'
    },
    {
      name: 'Tedamed',
      img: 'https://es.tedamed.com/Uploads/5f2b918459c429199.png',
      link: 'https://es.tedamed.com/'
    },
    {
      name: 'Dipromed',
      img: 'https://dipromed.cl/d/img/home/prehome-logo-mobile.svg',
      link: 'https://dipromed.cl/'
    },
    {
      name: 'Blunding',
      img: 'https://www.blunding.com/assets/blunding-logo-d95dde967e6f9eb15375e0476255767295a84231df6c5b4120e6d9d77d9050a1.svg',
      link: 'https://www.blunding.com/'
    },
  ];

  constructor(
    private productService: ProductService,
    private titleService: Title
  ) {}

  ngOnInit() {

    this.titleService.setTitle('Inicio | CRC Comercial SPA');

    // this.productService.getProducts().subscribe((products) => {
    //   this.featuredProductsCarousel = [...products]
    //     .sort(() => 0.8 - Math.random())
    //     .slice(0, 8);
    // });
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
