import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,       
    HeaderComponent,    
    FooterComponent,
    FormsModule,
    CommonModule     
  ],
  // The template must be the app.component.html file
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  toastMessage: string = '';
  isFadingOut: boolean = false;

  showToast(message: string) {
    this.toastMessage = message;
    this.isFadingOut = false;
  
    // Después de 2.7s empieza a desvanecer
    setTimeout(() => {
      this.isFadingOut = true;
    }, 2700);
  
    // Y después lo oculta del todo
    setTimeout(() => {
      this.toastMessage = '';
      this.isFadingOut = false;
    }, 3000);
  }

}
