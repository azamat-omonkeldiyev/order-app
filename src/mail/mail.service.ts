import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import { authenticator } from 'otplib';


authenticator.options = {
    step: 120,
  };

dotenv.config();

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      pass: process.env.EMAIL_PASS,
      user: process.env.EMAIL_USER,
    },
  });

  createOtp(email:string) {

    const otp = authenticator.generate(email);

    return otp
}

checkOtp(otp:string,email:string){
      // OTP ni tekshirish
      const isValid = authenticator.check(otp, email);
      return isValid
  }

  async sendEmail(to: string, subject: string, text: string) {
    try {
      await this.transporter.sendMail({
        to,
        subject,
        html: text,
      });
      console.log('successfully sended');

      return 'successfully sended';
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
