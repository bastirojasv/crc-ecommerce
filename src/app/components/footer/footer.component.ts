import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmailService } from '../../services/email.service';
import { RouterModule } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FormsModule, CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  userEmail: string = '';
  isLoading: boolean = false;

  constructor(
    private emailService: EmailService
  ) {}

  handleSubmit() {
    if (!this.userEmail || this.isLoading) return;

    this.isLoading = true;

    this.emailService.sendTemplate('template_g9g0def', {
      user_email: this.userEmail,
    })
      .then(() => {
        const modal = new bootstrap.Modal(document.getElementById('successModal'));
        modal.show();
        this.userEmail = '';
      })
      .catch((error) => {
        console.error('Error al enviar correo:', error);
        alert('Hubo un problema al enviar tu correo. Intenta nuevamente.');
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  emailIsValid(email: string): boolean {
    return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email);
  }

}