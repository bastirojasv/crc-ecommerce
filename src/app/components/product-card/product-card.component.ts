import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { FormsModule } from '@angular/forms';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() currentPage!: number;
  @Input() queryParams: any = {};
  quantity: number = 1;

  currentImage: string = '';

  constructor(
    private router: Router, 
    private cartService: CartService,
    private app: AppComponent
  ) {}

  ngOnInit() {
    this.currentImage = this.product.images[0];
  }

  onMouseEnter() {
    if (this.product.images.length > 1) {
      this.currentImage = this.product.images[1];
    }
  }

  onMouseLeave() {
    this.currentImage = this.product.images[0];
  }

  addToCart(): void {
    this.cartService.addToCart(this.product, this.quantity);
    this.app.showToast(`${this.quantity} × ${this.product.name} añadido al carrito`);
  }

  goToDetails(): void {
    this.router.navigate(['/products', this.product.id]);
  }
}
