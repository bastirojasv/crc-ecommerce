import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  cartCount = 0;
  categories: { id: number; name: string }[] = [];

  constructor(
    // private cartService: CartService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    // this.cartCount = this.cartService.getItems().reduce((acc, item) => acc + item.quantity, 0);

    fetch('assets/data/categories.json')
      .then(res => res.json())
      .then(data => this.categories = data)
      .catch(error => console.error('Error fetching categories:', error));
  }
}
