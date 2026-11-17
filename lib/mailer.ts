import nodemailer from 'nodemailer';

export interface EmailPayload {
  name: string;
  email: string;
  company?: string;
  projectType?: string;
  budget?: string;
  phone?: string;
  subject?: string;
  message: string;
}

export async function sendContactNotification(payload: EmailPayload): Promise<boolean> {
  const { name, email, company, projectType, budget, phone, subject, message } = payload;
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, '') : '';

  if (!emailUser || !emailPass) {
    console.warn('⚠️ EMAIL_USER or EMAIL_PASS is not configured. Email notification skipped.');
    return false;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  const mailOptions = {
    from: `"${name}" <${emailUser}>`,
    to: emailUser,
    replyTo: email,
    subject: subject || `New Contact Form Submission from ${name}`,
    text: `
Name: ${name}
Email: ${email}
Phone: ${phone || 'N/A'}
Company: ${company || 'N/A'}
Project Type: ${projectType || 'N/A'}
Budget: ${budget || 'N/A'}

Message:
${message}
    `,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #141133; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background: #141133; padding: 20px; text-align: center; border-bottom: 3px solid #FBAE44;">
          <h2 style="color: #ffffff; margin: 0; font-size: 20px;">Dream Cyber Security Pakistan</h2>
          <p style="color: #FBAE44; margin: 5px 0 0 0; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">New Client Lead & Inquiry</p>
        </div>
        <div style="padding: 24px; background: #ffffff;">
          <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${name}</p>
          <p style="margin: 0 0 10px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #28245F;">${email}</a></p>
          ${phone ? `<p style="margin: 0 0 10px 0;"><strong>Phone:</strong> <a href="tel:${phone}" style="color: #28245F;">${phone}</a></p>` : ''}
          <p style="margin: 0 0 10px 0;"><strong>Company:</strong> ${company || 'N/A'}</p>
          <p style="margin: 0 0 10px 0;"><strong>Project Type:</strong> ${projectType || 'N/A'}</p>
          <p style="margin: 0 0 10px 0;"><strong>Budget:</strong> ${budget || 'N/A'}</p>
          <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 20px 0;" />
          <p style="margin: 0 0 8px 0;"><strong>Message:</strong></p>
          <div style="background: #f8f9fa; padding: 14px 16px; border-radius: 6px; border-left: 4px solid #FBAE44; font-size: 14px; color: #333;">
            ${message.replace(/\n/g, '<br/>')}
          </div>
        </div>
        <div style="background: #f4f4f7; padding: 14px 20px; font-size: 12px; color: #777; text-align: center; border-top: 1px solid #eaeaea;">
          Received via Dream Cyber Security Official Portal &bull; <a href="https://www.dreamcybersecurity.pk" style="color: #28245F; text-decoration: none;">dreamcybersecurity.pk</a>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
  return true;
}
