import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  userEmail: string = '';

  handleSubmit() {
    // Aquí luego irá la lógica para enviar el correo
    console.log('Correo ingresado:', this.userEmail);
    alert('Gracias por tu interés. Te contactaremos pronto.');
    this.userEmail = '';
  }
}