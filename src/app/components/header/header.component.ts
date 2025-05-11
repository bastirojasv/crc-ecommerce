import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CategoryService, Category } from '../../services/category.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  categories: Category[] = [];
  totalItems: number = 0;
  isBouncing = false;

  constructor(
    private categoryService: CategoryService, 
    private router : Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
    });
    this.cartService.getCart().subscribe(cart => {
      this.totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    })
  }

  goToCategory(categoryId: number): void {
    this.router.navigate(['/products'], { queryParams: { category: categoryId } });
  }

  triggerBounce(): void {
    this.isBouncing = true;
    setTimeout(() => {
      this.isBouncing = false;
    }, 400);
  }
}
