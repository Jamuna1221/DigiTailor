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
// Send "Out for Delivery" Email
export const sendOutForDeliveryEmail = async (email, order) => {
  try {
    const transporter = createTransporter();
    console.log(`📧 Sending "Out for Delivery" email to: ${email}`);
    
    const mailOptions = {
      from: {
        name: 'DigiTailor',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: `🚚 Your order #${order.orderNumber} is Out for Delivery!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>DigiTailor - Out for Delivery</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800&display=swap');
            
            * { font-family: 'Poppins', sans-serif; }
            
            @keyframes gradient-shift {
              0%, 100% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
            }
            
            @keyframes float {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-20px) rotate(5deg); }
            }
            
            @keyframes truck-drive {
              0% { transform: translateX(-100%); opacity: 0; }
              20% { opacity: 1; }
              80% { opacity: 1; }
              100% { transform: translateX(100%); opacity: 0; }
            }
            
            @keyframes pulse-glow {
              0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.5), 0 0 40px rgba(139, 92, 246, 0.3); }
              50% { box-shadow: 0 0 30px rgba(139, 92, 246, 0.8), 0 0 60px rgba(139, 92, 246, 0.5); }
            }
            
            @keyframes sparkle {
              0%, 100% { opacity: 0; transform: scale(0); }
              50% { opacity: 1; transform: scale(1); }
            }
            
            @keyframes slide-in-left {
              from { transform: translateX(-50px); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slide-in-right {
              from { transform: translateX(50px); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes bounce-in {
              0% { transform: scale(0); opacity: 0; }
              50% { transform: scale(1.1); }
              100% { transform: scale(1); opacity: 1; }
            }
            
            @keyframes shimmer {
              0% { background-position: -1000px 0; }
              100% { background-position: 1000px 0; }
            }
            
            .gradient-bg {
              background: linear-gradient(270deg, #667eea, #764ba2, #f093fb, #667eea);
              background-size: 400% 400%;
              animation: gradient-shift 8s ease infinite;
            }
            
            .float-animation {
              animation: float 3s ease-in-out infinite;
            }
            
            .truck-animation {
              animation: truck-drive 4s ease-in-out infinite;
            }
            
            .pulse-glow {
              animation: pulse-glow 2s ease-in-out infinite;
            }
            
            .sparkle {
              position: absolute;
              width: 10px;
              height: 10px;
              background: white;
              border-radius: 50%;
              animation: sparkle 2s ease-in-out infinite;
            }
            
            .sparkle:nth-child(1) { top: 10%; left: 20%; animation-delay: 0s; }
            .sparkle:nth-child(2) { top: 30%; left: 80%; animation-delay: 0.5s; }
            .sparkle:nth-child(3) { top: 60%; left: 10%; animation-delay: 1s; }
            .sparkle:nth-child(4) { top: 80%; left: 90%; animation-delay: 1.5s; }
            .sparkle:nth-child(5) { top: 50%; left: 50%; animation-delay: 0.7s; }
            
            .slide-in-left {
              animation: slide-in-left 0.8s ease-out forwards;
            }
            
            .slide-in-right {
              animation: slide-in-right 0.8s ease-out forwards;
            }
            
            .bounce-in {
              animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
            }
            
            .shimmer {
              background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
              background-size: 1000px 100%;
              animation: shimmer 3s infinite;
            }
            
            .item-card {
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .item-card:hover {
              transform: translateX(10px) scale(1.02);
              box-shadow: 0 20px 40px rgba(139, 92, 246, 0.3);
            }
            
            .glass-effect {
              background: rgba(255, 255, 255, 0.1);
              backdrop-filter: blur(10px);
              border: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .neon-border {
              border: 2px solid transparent;
              background: linear-gradient(white, white) padding-box,
                          linear-gradient(135deg, #667eea, #764ba2) border-box;
            }
            
            @keyframes wave {
              0%, 100% { transform: rotate(0deg); }
              25% { transform: rotate(20deg); }
              75% { transform: rotate(-20deg); }
            }
            
            .wave {
              display: inline-block;
              animation: wave 1s ease-in-out infinite;
            }
            
            @keyframes progress-bar {
              0% { width: 0%; }
              100% { width: 100%; }
            }
            
            .progress-animation {
              animation: progress-bar 2s ease-out forwards;
            }
            
            .glow-text {
              text-shadow: 0 0 10px rgba(255, 255, 255, 0.8),
                           0 0 20px rgba(139, 92, 246, 0.6),
                           0 0 30px rgba(139, 92, 246, 0.4);
            }
          </style>
        </head>
        <body class="gradient-bg p-8">
          <div class="max-w-2xl mx-auto">
            <!-- Main Email Container -->
            <div class="bg-white rounded-3xl overflow-hidden shadow-2xl" style="animation: bounce-in 1s ease-out;">
              
              <!-- Header with Animated Background -->
              <div class="relative gradient-bg p-12 text-white overflow-hidden">
                <div class="sparkle"></div>
                <div class="sparkle"></div>
                <div class="sparkle"></div>
                <div class="sparkle"></div>
                <div class="sparkle"></div>
                
                <div class="relative z-10 text-center">
                  <h1 class="text-5xl font-bold mb-2 glow-text">🎯 DigiTailor</h1>
                  <div class="text-8xl my-8 float-animation">🚚</div>
                  <h2 class="text-3xl font-semibold">Your Order is On Its Way!</h2>
                  
                  <!-- Animated Road -->
                  <div class="mt-8 relative h-4 bg-white/20 rounded-full overflow-hidden">
                    <div class="absolute inset-0 shimmer"></div>
                    <div class="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-400 to-yellow-200 progress-animation rounded-full"></div>
                  </div>
                </div>
              </div>

              <!-- Content Section -->
              <div class="p-8 md:p-12">
                
                <!-- Greeting -->
                <div class="slide-in-left">
                  <h3 class="text-4xl font-bold text-gray-800 mb-4">
                    Hi ${order.userId.firstName}! <span class="wave">👋</span>
                  </h3>
                  <p class="text-lg text-gray-600 mb-6">
                    🎉 Fantastic news! Your package has left our facility and is racing towards you at lightning speed!
                  </p>
                </div>

                <!-- Status Badge with Glow Effect -->
                <div class="slide-in-right mb-8">
                  <div class="inline-block px-8 py-4 rounded-full font-bold text-white text-lg pulse-glow" 
                       style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                    ✨ OUT FOR DELIVERY ✨
                  </div>
                </div>

                <!-- Order Info Card -->
                <div class="neon-border rounded-2xl p-6 mb-8 bounce-in" style="animation-delay: 0.3s;">
                  <div class="flex items-center gap-4 mb-4">
                    <div class="text-5xl float-animation">📦</div>
                    <div>
                      <p class="text-sm text-gray-500 uppercase tracking-wide">Order Number</p>
                      <p class="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        #${order.orderNumber}
                      </p>
                    </div>
                  </div>
                  
                  <!-- Delivery Date Card -->
                  <div class="glass-effect rounded-xl p-5 mt-4">
                    <div class="flex items-center gap-4">
                      <div class="text-4xl">📅</div>
                      <div class="flex-1">
                        <p class="text-sm text-gray-700 font-semibold">Estimated Arrival</p>
                        <p class="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                          ${order.estimatedDelivery.toDateString()}
                        </p>
                      </div>
                      <div class="text-5xl float-animation" style="animation-delay: 0.5s;">🎁</div>
                    </div>
                  </div>
                </div>

                <!-- Order Summary -->
                <div class="bounce-in" style="animation-delay: 0.6s;">
                  <div class="flex items-center gap-3 mb-6">
                    <h3 class="text-3xl font-bold text-gray-800">Order Summary</h3>
                    <div class="text-3xl">📋</div>
                  </div>
                  
                  <!-- Items List -->
                  <div class="space-y-4 mb-6">
                    ${order.items.map((item, index) => `
                      <div class="item-card bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-5 border-2 border-purple-200" 
                           style="animation: slide-in-left 0.5s ease-out ${index * 0.1}s forwards; opacity: 0;">
                        <div class="flex justify-between items-center">
                          <div class="flex-1">
                            <div class="flex items-center gap-2 mb-2">
                              <span class="text-2xl">✨</span>
                              <h4 class="text-xl font-bold text-gray-800">${item.name}</h4>
                            </div>
                            <p class="text-purple-600 font-semibold">Quantity: ${item.quantity}</p>
                          </div>
                          <div class="text-right">
                            <div class="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                              ₹${item.price.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                  
                  <!-- Total Amount Card -->
                  <div class="gradient-bg rounded-2xl p-8 text-white text-center pulse-glow">
                    <p class="text-lg mb-2 opacity-90">Total Amount</p>
                    <p class="text-5xl font-bold glow-text">₹${order.totalAmount.toLocaleString()}</p>
                    <div class="mt-4 text-6xl float-animation">💎</div>
                  </div>
                </div>

                <!-- CTA Button -->
                <div class="text-center my-10">
                  <a href="${process.env.FRONTEND_URL}/orders/${order._id}" 
                     class="inline-block px-12 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold rounded-full hover:scale-110 transition-transform duration-300 pulse-glow"
                     style="text-decoration: none;">
                    🔍 Track Your Order →
                  </a>
                </div>

                <!-- Delivery Tip -->
                <div class="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 rounded-xl p-6 slide-in-right">
                  <div class="flex items-start gap-4">
                    <div class="text-4xl float-animation">💡</div>
                    <div>
                      <h4 class="text-xl font-bold text-yellow-800 mb-2">Quick Delivery Tip</h4>
                      <p class="text-yellow-700">
                        Please ensure someone is available at the delivery address. Our delivery partner will contact you shortly!
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Features Section -->
                <div class="grid grid-cols-3 gap-4 mt-10 mb-6">
                  <div class="text-center p-4 rounded-xl bg-purple-50 hover:scale-105 transition-transform">
                    <div class="text-4xl mb-2">🔒</div>
                    <p class="text-sm font-semibold text-gray-700">Secure Delivery</p>
                  </div>
                  <div class="text-center p-4 rounded-xl bg-pink-50 hover:scale-105 transition-transform">
                    <div class="text-4xl mb-2">⚡</div>
                    <p class="text-sm font-semibold text-gray-700">Fast Shipping</p>
                  </div>
                  <div class="text-center p-4 rounded-xl bg-indigo-50 hover:scale-105 transition-transform">
                    <div class="text-4xl mb-2">💯</div>
                    <p class="text-sm font-semibold text-gray-700">Quality Check</p>
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="gradient-bg text-white p-10 text-center relative overflow-hidden">
                <div class="sparkle"></div>
                <div class="sparkle"></div>
                <div class="sparkle"></div>
                
                <div class="relative z-10">
                  <p class="text-2xl font-bold mb-4 glow-text">Thank you for choosing DigiTailor! 💜</p>
                  <p class="mb-6 opacity-90">We're committed to delivering excellence, one package at a time.</p>
                  
                  <div class="mb-6">
                    <p class="mb-2">Need assistance?</p>
                    <a href="mailto:support@digitailor.com" class="text-yellow-300 font-bold hover:text-yellow-100 transition-colors" style="text-decoration: none;">
                      📧 support@digitailor.com
                    </a>
                  </div>
                  
                  <!-- Social Icons -->
                  <div class="flex justify-center gap-6 mb-6">
                    <a href="#" class="text-4xl hover:scale-125 transition-transform float-animation" style="text-decoration: none; animation-delay: 0s;">📱</a>
                    <a href="#" class="text-4xl hover:scale-125 transition-transform float-animation" style="text-decoration: none; animation-delay: 0.2s;">🐦</a>
                    <a href="#" class="text-4xl hover:scale-125 transition-transform float-animation" style="text-decoration: none; animation-delay: 0.4s;">📷</a>
                    <a href="#" class="text-4xl hover:scale-125 transition-transform float-animation" style="text-decoration: none; animation-delay: 0.6s;">💼</a>
                  </div>
                  
                  <div class="text-sm opacity-75">
                    © ${new Date().getFullYear()} DigiTailor. All rights reserved.
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Bottom Decoration -->
            <div class="text-center mt-8 text-white">
              <p class="text-sm opacity-75">✨ Crafted with love and delivered with care ✨</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ "Out for Delivery" email sent successfully to: ${email}`);
  } catch (error) {
    console.error('❌ Error sending "Out for Delivery" email:', error);
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
