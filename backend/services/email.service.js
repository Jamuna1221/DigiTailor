import nodemailer from 'nodemailer'
import { logEmailConfig, validateEmailSetup, debugDeliveryUrl, logOrderEmailData } from '../utils/emailDebug.js'

// Create transporter with proper method name
const createTransporter = () => {
  return nodemailer.createTransport({  // ✅ Fixed: createTransport (not createTransporter)
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    debug: true,
    logger: true
  })
}

// Verify SMTP connection
export const verifyEmailConnection = async () => {
  try {
    const transporter = createTransporter()
    await transporter.verify()
    console.log('✅ SMTP Server is ready to send emails')
    return true
  } catch (error) {
    console.error('❌ SMTP configuration error:', error.message)
    return false
  }
}
// Send "Out for Delivery" Email
export const sendOutForDeliveryEmail = async (email, order) => {
  try {
    const transporter = createTransporter();
    // 🧪 Use debug utilities
    logEmailConfig();
    validateEmailSetup();
    logOrderEmailData(order);
    
    console.log('\n🚀 ======= DELIVERY EMAIL DEBUG =======');
    console.log(`📧 Sending "Out for Delivery" email to: ${email}`);
    
    // Get the delivery confirmation URL with debug
    const deliveryConfirmURL = debugDeliveryUrl(order.deliveryToken);
    
    const mailOptions = {
      from: {
        name: 'DigiTailor',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: `🚚 Your order #${order.orderNumber} is Out for Delivery!`,
      html: `
        <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>DigiTailor - Out for Delivery</title>
  <style>
    body {
      font-family: 'Poppins', sans-serif;
      background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
      margin: 0;
      padding: 0;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #fff;
      border-radius: 20px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      overflow: hidden;
      border: 2px solid #f0f0f0;
      animation: fadeIn 1.2s ease-in-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .header {
      background: linear-gradient(90deg, #ff66b2, #ff4081, #e91e63);
      color: white;
      text-align: center;
      padding: 40px 20px;
      position: relative;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      letter-spacing: 1px;
    }
    .header::after {
      content: '🚚';
      font-size: 48px;
      position: absolute;
      right: 25px;
      top: 25px;
      animation: float 2s ease-in-out infinite;
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
    .content {
      padding: 30px 25px;
      line-height: 1.8;
      color: #444;
    }
    .content h2 {
      color: #e91e63;
      text-align: center;
      font-size: 22px;
      margin-bottom: 15px;
    }
    .content p {
      margin: 8px 0;
      text-align: center;
    }
    .delivery-box {
      margin: 25px auto;
      background: #fff0f6;
      border: 1px solid #ffd6e7;
      border-radius: 15px;
      padding: 20px;
      max-width: 400px;
      box-shadow: 0 3px 8px rgba(233,30,99,0.15);
      text-align: center;
    }
    .delivery-box h3 {
      color: #e91e63;
      margin-bottom: 10px;
    }
    .btn {
      display: inline-block;
      background: linear-gradient(90deg, #ff66b2, #ff4081);
      color: white;
      text-decoration: none;
      font-weight: 600;
      padding: 12px 24px;
      border-radius: 25px;
      margin-top: 20px;
      transition: all 0.3s ease;
    }
    .btn:hover {
      transform: scale(1.05);
      box-shadow: 0 5px 15px rgba(233,30,99,0.4);
    }
    .footer {
      text-align: center;
      font-size: 13px;
      color: #999;
      padding: 20px;
      background: #fff;
      border-top: 1px solid #eee;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>DigiTailor</h1>
      <p>Your order is on the way!</p>
    </div>
      <div class="content">
        <h2>Good News 🎉</h2>
        <p>Your custom-tailored outfit is <strong>out for delivery</strong> and will reach you soon!</p>
        
        <div class="delivery-box">
          <h3>Order Details</h3>
          <p><b>Order ID:</b> ${order.orderId || order.orderNumber}</p>
          <p><b>Expected Delivery:</b> ${order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString() : 'Soon'}</p>
          <p><b>Items:</b> ${order.items ? order.items.length : '1'} custom item(s)</p>
        </div>

        <div style="margin: 30px 0; padding: 20px; background: #fff8e1; border: 2px solid #ffc107; border-radius: 15px; text-align: center;">
          <h3 style="color: #f57c00; margin-bottom: 15px;">📦 Important!</h3>
          <p style="margin-bottom: 20px;"><strong>Once you receive your order, please confirm delivery by clicking the button below:</strong></p>
          <a href="${deliveryConfirmURL}" class="btn" style="background: linear-gradient(90deg, #ff6b35, #f7931e); font-size: 16px; padding: 15px 30px;">
            ✅ Mark as Delivered
          </a>
          <p style="font-size: 12px; color: #666; margin-top: 15px;">This helps us improve our service and enables you to leave a review!</p>
        </div>

        <p style="text-align: center; margin-top: 20px;">Thank you for choosing DigiTailor!</p>
      </div>
    <div class="footer">
      <p>Thank you for choosing <b>DigiTailor</b>. Your style, our stitch 💖</p>
      <p>© 2025 DigiTailor. All rights reserved.</p>
    </div>
  </div>
</body>
</html>

      `
    };

    console.log('📤 Email options prepared:');
    console.log(`   - To: ${mailOptions.to}`);
    console.log(`   - Subject: ${mailOptions.subject}`);
    console.log(`   - From: ${mailOptions.from.name} <${mailOptions.from.address}>`);
    console.log(`   - HTML Length: ${mailOptions.html.length} characters`);
    
    console.log('🚀 Attempting to send email...');
    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully!');
    console.log(`📬 Message ID: ${result.messageId}`);
    console.log(`📨 Response: ${result.response}`);
    console.log('======= EMAIL DEBUG COMPLETE =======\n');
    
    return result;
  } catch (error) {
    console.error('\n❌ ======= EMAIL SEND ERROR =======');
    console.error(`😱 Error sending "Out for Delivery" email to: ${email}`);
    console.error(`📦 Order ID: ${order.orderId || order._id}`);
    console.error(`🔑 Token: ${order.deliveryToken}`);
    console.error(`😨 Error Details:`, {
      name: error.name,
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode
    });
    console.error('================================\n');
    throw error;
  }
};
// Send OTP Email
export const sendOTPEmail = async (email, otp, firstName) => {
  try {
    const transporter = createTransporter()
    
    console.log(`📧 Attempting to send OTP to: ${email}`)
    
    const mailOptions = {
      from: {
        name: 'DigiTailor',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: 'Your DigiTailor Verification Code',
      html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>DigiTailor - Email Verification</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center; padding: 30px; border-radius: 10px 10px 0 0;">
      <h1>🎯 DigiTailor</h1>
      <h2>Email Verification</h2>
    </div>
    <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
      <h3>Hi ${firstName}! 👋</h3>
      <p>Welcome to DigiTailor! We're excited to have you join our fashion community.</p>
      
      <p>To complete your registration, please use the verification code below:</p>
      
      <div style="background: white; border: 2px solid #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
        <p style="margin: 0; font-size: 16px; color: #666;">Your Verification Code</p>
        <div style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px;">${otp}</div>
        <p style="margin: 0; font-size: 14px; color: #666;">This code expires in 5 minutes</p>
      </div>
      
      <p><strong>Important:</strong></p>
      <ul>
        <li>This code is valid for 5 minutes only</li>
        <li>Don't share this code with anyone</li>
        <li>If you didn't request this, please ignore this email</li>
      </ul>
      
      <div style="text-align: center; margin-top: 30px; color: #666;">
        <p>Best regards,<br>The DigiTailor Team</p>
        <p><small>This is an automated email, please don't reply to this message.</small></p>
      </div>
    </div>
  </div>
</body>
</html>
`

    }
    
    const result = await transporter.sendMail(mailOptions)
    console.log('✅ Email sent successfully!')
    console.log('📋 Message ID:', result.messageId)
    console.log('📤 Response:', result.response)
    
    return result
    
  } catch (error) {
    console.error('❌ Email sending failed:')
    console.error('Error message:', error.message)
    console.error('Error code:', error.code)
    
    throw new Error('Failed to send OTP email: ' + error.message)
  }
}

// Test email function
export const sendTestEmail = async (email) => {
  try {
    const transporter = createTransporter()
    
    const result = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'DigiTailor - Email Test',
      text: 'This is a test email from DigiTailor. If you receive this, your email configuration is working correctly!'
    })
    
    console.log('✅ Test email sent successfully!')
    return result
    
  } catch (error) {
    console.error('❌ Test email failed:', error)
    throw error
  }
}
// Add this function to your existing email.service.js
export const sendPasswordResetEmail = async (email, firstName, resetURL, resetToken) => {
  try {
    const transporter = createTransporter()
    
    console.log(`📧 Sending password reset email to: ${email}`)
    
    const mailOptions = {
      from: {
        name: 'DigiTailor',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: 'DigiTailor - Password Reset Request',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>DigiTailor - Password Reset</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center; padding: 30px; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 DigiTailor</h1>
              <h2>Password Reset Request</h2>
            </div>
            <div class="content">
              <h3>Hi ${firstName}!</h3>
              <p>We received a request to reset your DigiTailor account password.</p>
              
              <p>Click the button below to reset your password:</p>
              
              <div style="text-align: center;">
                <a href="${resetURL}" class="button">Reset Password</a>
              </div>
              
              <p>Or copy and paste this link in your browser:</p>
              <p style="word-break: break-all; color: #667eea;">${resetURL}</p>
              
              <p><strong>Important:</strong></p>
              <ul>
                <li>This link expires in 10 minutes</li>
                <li>If you didn't request this, please ignore this email</li>
                <li>Your password won't change unless you click the link above</li>
              </ul>
              
              <div class="footer">
                <p>Best regards,<br>The DigiTailor Team</p>
                <p><small>This is an automated email, please don't reply to this message.</small></p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    }
    
    const result = await transporter.sendMail(mailOptions)
    console.log('✅ Password reset email sent successfully!')
    console.log('📋 Message ID:', result.messageId)
    
    return result
    
  } catch (error) {
    console.error('❌ Password reset email failed:', error)
    throw new Error('Failed to send password reset email: ' + error.message)
  }
}
