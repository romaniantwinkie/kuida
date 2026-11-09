import "server-only";
import nodemailer from "nodemailer";

const transport = process.env.SMTP_URL ? nodemailer.createTransport(process.env.SMTP_URL) : null;
const FROM = process.env.MAIL_FROM ?? "Cercana <hello@cercana.ai>";

export async function sendMail(to: string, subject: string, text: string) {
  if (!transport) {
    // No mail server configured (local development): print instead of sending.
    console.log(`\n[mail] to=${to}\n[mail] ${subject}\n${text}\n`);
    return;
  }
  await transport.sendMail({ from: FROM, to, subject, text });
}

export function codeEmail(code: string, es: boolean) {
  return es
    ? {
        subject: `Tu código de Cercana: ${code}`,
        text: `Tu código para entrar a Cercana es ${code}.\n\nVence en 10 minutos. Si no lo pediste, ignora este correo.\n\n— Cercana`,
      }
    : {
        subject: `Your Cercana code: ${code}`,
        text: `Your code to log in to Cercana is ${code}.\n\nIt expires in 10 minutes. If you didn't ask for it, you can ignore this email.\n\n— Cercana`,
      };
}
