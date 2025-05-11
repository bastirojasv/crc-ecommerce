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

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private app: AppComponent,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
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
      }
    });
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product, this.quantity);
      this.app.showToast(`${this.quantity} × ${this.product.name} añadido al carrito`);
      
      this.btnPulse = true;
      setTimeout(() => this.btnPulse = false, 300); // elimina la clase tras animación
    }
  }
  
}
