import { Component } from '@angular/core';
import { CartItem, CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EmailService } from '../../services/email.service';
import { Title } from '@angular/platform-browser';

declare var bootstrap: any;

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  
  templateId = 'template_yy1qxjq';
  cartItems: CartItem[] = [];
  isLoading = false;

  contact = {
    name: '',
    email: '',
    company: '',
    message: ''
  }

  constructor(
    private cartService: CartService,
    private emailService: EmailService,
    private titleService: Title
  ) {}

  ngOnInit(): void {

    this.titleService.setTitle('Carrito | CRC Comercial SPA');

    this.cartService.getCart().subscribe(items => {
      this.cartItems = items;
    });
  }

  submitForm(): void {

    if (!this.contact.name || !this.contact.email) return;

    this.isLoading = true;

    const templateParams = {
      name: this.contact.name,
      email: this.contact.email,
      company: this.contact.company,
      message: this.contact.message,
      products: this.cartItems.map(item => `- ${item.product.name} (x${item.quantity})`).join('\n')
    };

    this.emailService.sendTemplate(this.templateId, templateParams)
      .then(() => {

        this.isLoading = false;

        const modal = new bootstrap.Modal(document.getElementById('successModal'));

        modal.show();

        this.cartService.clearCart();
        this.contact = { name: '', email: '', company: '', message: '' };
      })
      .catch(() => {
        this.isLoading = false;

        alert('Hubo un error al enviar tu solicitud. Intenta más tarde.');
      });
  }

  updateQuantity(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  remove(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  getTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }
}
