import nodemailer from 'nodemailer'

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
      html: `
        <!DOCTYPE html>
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
