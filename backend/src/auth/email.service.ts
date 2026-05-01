import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM || 'onboarding@resend.dev';

    if (!apiKey) {
      this.logger.warn(
        'RESEND_API_KEY nao configurada; envio de e-mail ignorado.',
      );
      return;
    }

    const resend = new Resend(apiKey);
    const result = await resend.emails.send({ from, to, subject, html });

    if (result.error) {
      this.logger.error(
        `Falha ao enviar e-mail para ${to}: ${result.error.message}`,
      );
      throw new Error('Nao foi possivel enviar o e-mail.');
    }
  }
}
