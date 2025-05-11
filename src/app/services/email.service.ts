import { Injectable } from '@angular/core';
import emailjs from 'emailjs-com';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private serviceId = 'service_qfftlka';
  private publicKey = 'Ju9RO8dukp6K23Apu';

  constructor() {}

  async sendTemplate(templateId: string, payload: any): Promise<void> {
    return emailjs.send(this.serviceId, templateId, payload, this.publicKey)
      .then(() => Promise.resolve())
      .catch((error) => {
        console.error('Error al enviar correo:', error);
        return Promise.reject(error);
      });
  }
}